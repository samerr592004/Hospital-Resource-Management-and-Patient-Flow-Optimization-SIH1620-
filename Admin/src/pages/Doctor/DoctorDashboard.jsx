import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaRupeeSign, FaStar, FaCheck, FaStop } from 'react-icons/fa';
import { MdReviews, MdPayment } from 'react-icons/md';
import { DoctorContext } from '../../contexts/DoctorContext';
import { AppContext } from '../../contexts/AppContext';
import TestimonialCarousel from '../../components/TestimonialCarousel';

const DoctorDashboard = () => {
  const { doctorData, hospitalData, dashboardData, getDashboardData } = useContext(DoctorContext);
  const { calculateAge } = useContext(AppContext);
  const [selectedTab, setSelectedTab] = useState('today');
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const today = new Date();
const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth()+1)
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
  : []
  // Fetch dashboard data when component mounts
  useEffect(() => {
    getDashboardData();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      completeConsultation();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const startConsultation = (appointmentId) => {
    setActiveConsultation(appointmentId);
    setTimeLeft(1800); // Reset to 30 minutes
    setIsTimerRunning(true);
  };

  const stopConsultation = () => {
    setIsTimerRunning(false);
  };

  const completeConsultation = async () => {
    setIsTimerRunning(false);
    try {
      // Here you would call your API to complete the consultation
      // await api.completeAppointment(activeConsultation);
      alert('Consultation completed successfully!');
      getDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error completing consultation:', error);
      alert('Failed to complete consultation');
    } finally {
      setActiveConsultation(null);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter appointments based on selected tab
  const filteredAppointments = dashboardData 
    ? (() => {
        switch(selectedTab) {
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

  // Just replacing your existing JSX return block
// CHANGES: Only updated responsive Tailwind classes

// ...keep your imports & hooks untouched

return (
  <div className="min-h-screen w-[100vw] bg-gray-50 p-4 sm:p-6 md:p-8 overflow-y-scroll">
    {/* Consultation Timer Modal */}
    {activeConsultation && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-sm sm:max-w-md">
          {/* Content unchanged */}
        </div>
      </div>
    )}

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
            className={`flex-1 sm:flex-none px-4 py-2 font-medium capitalize text-center ${
              selectedTab === tab
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
                    <img src={appointment.userData?.image} className="rounded-full w-14 h-14 sm:w-16 sm:h-16" alt="" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-800 truncate text-sm sm:text-base">
                      {appointment.userData?.name}
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
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.cancelled
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
                    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Start Consultation
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