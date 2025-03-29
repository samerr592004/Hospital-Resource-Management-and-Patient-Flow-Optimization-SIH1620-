import React, { useState,useContext,useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";


const MyBeds = () => {
  const { backendUrl, token,  loadUserProfileData ,getHospitalData ,beds,getBeds} = useContext(AppContext);
  


  
  // Extract beds data from userData
 

  const slotFormatter = (slotDate) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dateArray = slotDate.split("/");
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  }

  const cancelBedReservation = async (bedKey) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, cancel it!",
      });

      if (result.isConfirmed) {
        
        const { data } = await axios.post(
          `${backendUrl}/api/user/cancel-bed`,
          { bedKey },
          { headers: { token } }
        );

        if (data.success) {
          await Promise.all([
            loadUserProfileData(), // Updates userData via setUserData()
            getHospitalData(),    // Updates hospitals data
            getBeds()
          ]);
          
          await Swal.fire({
            title: "Success!",
            text: data.message,
            icon: "success",
            confirmButtonText: "OK"
          });
        } else {
          await Swal.fire({
            title: "Error!",
            text: data.message,
            icon: "error",
            confirmButtonText: "OK"
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };


  useEffect(() => {
    getBeds();
  }, [beds]); // Ensures that the latest booked/canceled beds are reflected
  
  

  return (
    <div className="m-[3rem]">
      <p className=" font-medium text-zinc-700 border-b">My Beds</p>
      <div>
        {beds.length > 0 ? (
          beds.map((bed) => (
            <div
              className="grid md:grid-cols-[1fr_2fr]  sm:flex sm:gap-6 py-4 border-b"
              key={bed.hospitalId+bed.bedId}
            >
              <div className="flex items-center justify-center">
                <img
                  className="w-70 h-60 md:w-60 md:h-40 object-cover rounded-lg"
                  src={bed.hospitalImage || "/default-hospital.jpg"}
                  alt="Hospital"
                  onError={(e) => {
                    e.target.src = "/default-hospital.jpg";
                  }}
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600 mt-3">
                <p className="text-neutral-800 font-semibold">{bed.patientName}</p>
                <p className="text-zinc-800 font-medium">Bed {bed.bedId}</p>
                <p className="text-zinc-700 font-medium mt-2">Hospital:</p>
                <p className="text-sm">{bed.hospitalName}</p>
                <p className="text-zinc-700 font-medium mt-2">Address:</p>
                <p className="text-sm">{bed.hospitalAddress}</p>
                <p className="text-zinc-700 font-medium mt-2">Date:</p>
                <p className="text-sm">{slotFormatter(bed.date)}</p>
                <p className="text-zinc-700 font-medium mt-2">Condition:</p>
                <p className="text-sm">{bed.patientCondition}</p>
              </div>
              <div className="pt-2 flex flex-col justify-end">
                <button
                  onClick={() => cancelBedReservation(bed.hospitalId+bed.bedId)}
                  className="text-sm bg-red-600 text-white text-center sm:min-w-48 py-2 px-4 rounded hover:bg-red-700 transition-all duration-300"
                >
                  Cancel Reservation
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="py-4 text-zinc-500">No bed reservations found.</p>
        )}
      </div>
    </div>
  );
};

export default MyBeds;