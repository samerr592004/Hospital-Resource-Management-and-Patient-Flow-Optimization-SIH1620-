import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaRupeeSign, FaStar } from 'react-icons/fa';
import { MdReviews, MdPayment } from 'react-icons/md';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { DoctorContext } from '../../contexts/DoctorContext';
import { AppContext } from '../../contexts/AppContext';
import TestimonialCarousel from '../../components/TestimonialCarousel';
import { toast, ToastContainer } from 'react-toastify'; // ✅ Correct import
import axios from 'axios';

const MySwal = withReactContent(Swal);

const DoctorDashboard = () => {
  const { backendUrl, dToken, doctorData, hospitalData, dashboardData, getDashboardData } = useContext(DoctorContext);
  const { calculateAge } = useContext(AppContext);
  const [selectedTab, setSelectedTab] = useState('today');
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timeLeftRef = React.useRef(timeLeft);


  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);


  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1)
    .toString().padStart(2, '0')}/${today.getFullYear()}`;

  const doctorTestimonials = doctorData?.reviews
    ? Object.values(doctorData.reviews)
      .filter((review) => review?.date === formattedDate)
      .map((review) => ({
        name: review?.name || "Anonymous",
        feedback: review?.feedback || "No comment provided.",
        stars: review?.stars || 0,
        image: review?.image,
        date: review?.date,
      }))
    : [];

  useEffect(() => {
    getDashboardData();
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      handleTimerEnd(appointmentId);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);
  const startConsultation = (appointmentId, isResume = false) => {
    setActiveConsultation(appointmentId);

    if (!isResume) {
      setTimeLeft(1800); // Only reset time for new consultations
    }
    setIsTimerRunning(true);

    MySwal.fire({
      title: <strong>Consultation Started</strong>,
      html: (
        <div className="text-center">
          <p className="mb-4">Consultation timer has started (30 minutes)</p>
          <div className="text-3xl font-bold text-indigo-600 my-4 timer-display">
            {formatTime(timeLeftRef.current)}
          </div>
          <button
            onClick={() => {
              Swal.close();
              stopConsultation(appointmentId);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            End Consultation Early
          </button>
        </div>
      ),
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        const timerInterval = setInterval(() => {
          const timer = document.querySelector('.timer-display');
          if (timer) {
            timer.textContent = formatTime(timeLeftRef.current);
          }
        }, 1000);
        Swal.getTimerInterval = () => timerInterval;
      },
      willClose: () => {
        clearInterval(Swal.getTimerInterval());
      }
    });
  };


  const stopConsultation = async (appointmentId) => {
    setIsTimerRunning(false);

    const result = await MySwal.fire({
      title: 'End Consultation?',
      text: 'Are you sure you want to end this consultation session?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, end it'
    });

    if (result.isConfirmed) {
      await completeConsultation(appointmentId);
    } else {
      // Resume timer without resetting
      setIsTimerRunning(true);
      startConsultation(activeConsultation, true); // <--- resume mode
    }
  };


  const handleTimerEnd = async (appointmentId) => {
    setIsTimerRunning(false);
    await MySwal.fire({
      title: 'Time Up!',
      text: 'The 30-minute consultation period has ended.',
      icon: 'info',
      confirmButtonText: 'Complete Consultation'
    });
    await completeConsultation(appointmentId);
  };

  const completeConsultation = async (appointmentId) => {
    try {

      console.log('backendUrl:', backendUrl);

      const { data } = await axios.post(
        backendUrl + '/api/doctor/complete-appointment',
        { appointmentId },
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        
        await MySwal.fire({
          title: 'Success!',
          text: 'Consultation completed successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        getDashboardData();
        setActiveConsultation(null);
        
      } else {
        await MySwal.fire({
          title: 'Error!',
          text: data.message || 'Something went wrong.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
      



    } catch (error) {
      console.error('Error completing consultation:', error);
      MySwal.fire({
        title: 'Error!',
        text: 'Failed to complete consultation',
        icon: 'error'
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredAppointments = dashboardData
    ? (() => {
      switch (selectedTab) {
        case 'today': return dashboardData.today || [];
        case 'upcoming': return dashboardData.upcoming || [];
        case 'completed': return dashboardData.completed || [];
        case 'canceled': return dashboardData.canceled || [];
        default: return [];
      }
    })()
    : [];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/');
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(year, month - 1, day).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen w-[100vw] bg-gray-50 p-4 sm:p-6 md:p-8 overflow-y-scroll">
      {/* Doctor Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
        <img
          src={doctorData?.image || '/default-doctor.png'}
          alt={doctorData?.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-indigo-100"
        />
        <div className="flex-1 w-full">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{doctorData?.name}</h1>
          <p className="text-indigo-600 font-medium text-sm sm:text-base">{doctorData?.speciality}</p>
          <p className="text-gray-600 text-sm truncate">{doctorData?.degree}</p>
          <div className="flex items-center mt-2">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="text-gray-700 font-medium">{doctorData?.total_rate || 'New'}</span>
          </div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg w-full lg:w-auto text-sm sm:text-base">
          <div className="flex items-center text-indigo-700">
            <FaRupeeSign className="mr-2" />
            <span className="font-bold">Consultation Fee: ₹{doctorData?.fees}</span>
          </div>
          <p className="text-gray-600 mt-1">{hospitalData?.name}</p>
          <p className="text-gray-500">{`${hospitalData?.address}, ${hospitalData?.city}`}</p>
          <p className="text-gray-500">{`${hospitalData?.district}, ${hospitalData?.state}, PINCODE: ${hospitalData?.zipcode}`}</p>
        </div>
      </div>

      {/* Appointment Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="flex flex-wrap justify-between border-b border-gray-200 text-sm sm:text-base">
          {['today', 'upcoming', 'completed', 'canceled'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 sm:flex-none px-4 py-2 font-medium capitalize text-center ${selectedTab === tab
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab} ({dashboardData?.counts?.[tab] || 0})
            </button>
          ))}
        </div>

        {/* Appointment List */}
        <div className="divide-y divide-gray-200">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  {/* Patient Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="bg-indigo-100 p-2 sm:p-3 rounded-full shrink-0">
                      <img
                        src={appointment.userData?.image || '/default-user.png'}
                        className="rounded-full w-14 h-14 sm:w-16 sm:h-16"
                        alt="Patient"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-800 truncate text-sm sm:text-base">
                        {appointment.userData?.name || 'Unknown Patient'}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        {appointment.userData?.age === 'Not Selected'
                          ? 'Not Selected'
                          : calculateAge(appointment.userData.dob)}{' '}
                        {appointment.userData?.gender === 'Not Selected'
                          ? 'Not Selected'
                          : appointment.userData?.gender}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                        <FaClock className="inline mr-1" />
                        {appointment.slotTime} • {formatDate(appointment.slotDate)}
                      </p>
                    </div>
                  </div>

                  {/* Hospital Info */}
                  <div className="text-sm md:text-right min-w-0">
                    <div className="flex items-center md:justify-end text-gray-600">
                      <FaMapMarkerAlt className="mr-1 text-indigo-500" />
                      <span className="truncate">{appointment.hospitalName}</span>
                    </div>
                    <p className="text-gray-500 mt-1 truncate">{appointment.hospitalAddress1}</p>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center gap-3 text-sm">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${appointment.cancelled
                        ? 'bg-red-100 text-red-800'
                        : appointment.isCompleted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                        }`}
                    >
                      {appointment.cancelled
                        ? 'Cancelled'
                        : appointment.isCompleted
                          ? 'Completed'
                          : 'Upcoming'}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MdPayment className="mr-1 text-green-500" />
                      ₹{appointment.amount} {appointment.payment ? '(Paid)' : '(Pending)'}
                    </div>
                  </div>
                </div>

                {!appointment.isCompleted && !appointment.cancelled && (
                  <div className="flex justify-end mt-4 space-x-2 sm:space-x-3">
                    <button
                      onClick={() => startConsultation(appointment._id)}
                      className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                      disabled={isTimerRunning}
                    >
                      {isTimerRunning ? 'Consultation in Progress' : 'Start Consultation'}
                    </button>
                  </div>
                )}

                {appointment.isCompleted && !appointment.isReviewed && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">This appointment is awaiting patient review</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-6 sm:p-8 text-center text-gray-500 text-sm">No {selectedTab} appointments found</div>
          )}
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialCarousel testimonials={doctorTestimonials} />
    </div>
  );
};

export default DoctorDashboard;