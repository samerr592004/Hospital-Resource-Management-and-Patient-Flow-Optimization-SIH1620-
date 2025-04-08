import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Myappointment = () => {
  const { backendUrl, token, doctors, getDoctorData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [isTimeOut, setIsTimeOut] = useState({});




  const slotFormatter = (slotDate) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const dateArray = slotDate.split("/");
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  }

  // Fetch User Appointments
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message)
    }
  };

  // Check if appointment has passed
  const checkAppointmentsTimeout = async (appointmentsList) => {
    const now = new Date();
    let updatedTimeouts = {};

    for (const appointment of appointmentsList) {
      const [day, month, year] = appointment.slotDate.split("/").map(Number);
      const slotTime = appointment.slotTime.toUpperCase();

      const appointmentDateTime = new Date(`${year}-${month}-${day} ${slotTime}`);


      if (appointmentDateTime < now && appointment.isCompleted === false) {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/timeout-appointment`,
            { appointmentId: appointment._id },
            { headers: { token } }
          );

          console.log(data);
        } catch (err) {
          console.error("Error marking timeout appointment:", err);
        }
      }

      updatedTimeouts[appointment._id] = appointmentDateTime < now;
    }

    setIsTimeOut(updatedTimeouts);
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      console.log('ok')
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, { headers: { token } },)
      console.log('ok')
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {

      console.error(error);
      toast.error(error.message)
    }

  }
  // Function to handle rating with SweetAlert2 (Emoji-based ratings + feedback)
  const handleRateAppointment = async (appointment) => {
    let selectedRating = 0;
    let feedbackText = "";
    let appointmentId = appointment._id;
    let docId = appointment.docId;


    const { value } = await Swal.fire({
      title: "Rate Your Appointment",
      html: `
  <div id="star-container" style="font-size: 30px; color: gray; cursor: pointer; display: flex; justify-content: center; gap: 10px;">
    <i class="star fa-solid fa-regular fa-star " data-value="1"></i>
    <i class="star fa-solid fa-regular fa-star " data-value="2"></i>
    <i class="star fa-solid fa-regular fa-star " data-value="3"></i>
    <i class="star fa-solid fa-regular fa-star " data-value="4"></i>
    <i class="star fa-solid fa-regular fa-star " data-value="5"></i>
  </div>
  <p id="rating-text" style="margin-top: 10px; font-size: 14px; text-align: center;">Click a star to rate</p>
  <textarea id="feedback" placeholder="Write your feedback here..." style="width: 100%; height: 60px; margin-top: 10px; padding: 5px; border-radius: 5px; border: 1px solid gray;"></textarea>
`,

      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",

      didOpen: () => {
        const stars = document.querySelectorAll(".star");
        const ratingText = document.getElementById("rating-text");
        const feedbackInput = document.getElementById("feedback");

        stars.forEach((star) => {
          star.style.cursor = "pointer";

          star.addEventListener("click", function () {
            selectedRating = this.getAttribute("data-value");

            // Update colors of stars
            stars.forEach((s, index) => {
              s.style.color = index < selectedRating ? "gold" : "gray";
            });

            ratingText.innerText = `You rated: ${selectedRating} star${selectedRating > 1 ? "s" : ""}`;
          });
        });

        feedbackInput.addEventListener("input", function () {
          feedbackText = feedbackInput.value;
        });
      },
    });


    if (selectedRating > 0) {
      try {



        const { data } = await axios.post(
          `${backendUrl}/api/user/rate-appointment`,
          { appointmentId, docId, stars: selectedRating, feedback: feedbackText, skip: false, slotTime: appointment.slotTime, slotDate: appointment.slotDate },
          { headers: { token } },
        );


        if (data.success) {
          getUserAppointments()
          getDoctorData();
          Swal.fire("Thank You!", data.message, "success");
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Could not submit rating.", "error");
      }
    } else {
      Swal.fire("Error", "Please click on a star to give a rating.", "error");
    }
  };

  const handleSkip = async (appointment) => {
    const { _id: appointmentId, docId } = appointment;
    
    try {
      // Optimistic UI update - mark as skipped immediately
      setAppointments(prev => prev.map(app => 
        app._id === appointmentId ? { ...app, isSkipped: true } : app
      ));
  
      // Show loading indicator
      const loadingSwal = Swal.fire({
        title: 'Processing...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
  
      // Make API call
      const { data } = await axios.post(
        `${backendUrl}/api/user/rate-appointment`,
        {
          appointmentId,
          docId,
          skip: true,
          slotTime: appointment.slotTime,
          slotDate: appointment.slotDate
        },
        { headers: { token } }
      );
  
      // Close loading indicator
      Swal.close(loadingSwal);
  
      if (data.success) {
        // Refresh data in background
        Promise.all([getUserAppointments(), getDoctorData()]);
        
        Swal.fire({
          title: 'Skipped!',
          text: 'Rating was skipped successfully',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } else {
        // Revert optimistic update if API failed
        setAppointments(prev => prev.map(app => 
          app._id === appointmentId ? { ...app, isSkipped: false } : app
        ));
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Skip error:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Could not skip rating',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    }
  };
  
  

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token, doctors]);

  useEffect(() => {
    if (appointments.length > 0) {
      checkAppointmentsTimeout(appointments);
    }
  }, [appointments]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkAppointmentsTimeout(appointments);
    }, 60000);

    return () => clearInterval(interval);
  }, [appointments]);



  return (
    <div className="m-[3rem]">
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My appointments</p>
      <div>
        {appointments.map((item) => (
          <div
            className="grid md:grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={item._id}
          >
            <div>
              <img className="w-40 bg-indigo-100" src={item.docData.image} alt="" />
            </div>
            <div className="flex-1 text-sm text-zinc-600 mt-3">
              <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
              <p className="text-zinc-800 font-medium ">{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Hospita:</p>
              <p className="text-xs">{item.hospitalName}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.hospitalAddress1}</p>
              <p className="text-xs">{item.hospitalAddress2}</p>
              <p className="text-xs mt-1">
                Date & Time:
                <span className="text-xs text-zinc-500 font-medium">
                  {slotFormatter(item.slotDate)} | {item.slotTime}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-end">
              {isTimeOut[item._id] || item.isCompleted && !item.cancelled ? (
                <>
                  <button
                    onClick={() => handleRateAppointment(item)}
                    className="text-sm bg-green-600 text-white text-center sm:min-w-48 py-2 border rounded hover:scale-105 transition-all duration-300"
                  >
                    Rate Me
                  </button>
                  <button
                    onClick={() => handleSkip(item)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:scale-105 transition-all duration-300 hover:bg-red-600 hover:text-white"
                  >
                    Skip
                  </button>
                </>
              ) : (
                <>
                  {!item.cancelled && !item.isCompleted && (
                    <button
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:scale-105 transition-all duration-300 hover:bg-primary hover:text-white"
                    >
                      Pay Online
                    </button>
                  )}

                  {!item.cancelled ? (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:scale-105 transition-all duration-300 hover:bg-red-600 hover:text-white"
                    >
                      Cancel Appointment
                    </button>
                  ) : (
                    <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                      Appointment Cancelled
                    </button>
                  )}
                </>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Myappointment;
