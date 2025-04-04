import React, { useState } from "react";
import { useContext } from "react";
import { AdminContext } from "../../contexts/AdminContext";
import { useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";
import { assets } from "../../assets/assets";

const AllAppointment = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, currencySymbol } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage, setAppointmentsPerPage] = useState(10);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const slotFormatter = (slotDate) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateArray = slotDate.split("/");
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };

  // Get current appointments
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Change appointments per page
  const handleAppointmentsPerPageChange = (e) => {
    setAppointmentsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Calculate total pages
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  return (
    <div className="w-full max-w-6xl mx-4 mt-5 sm:mx-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
        <p className="text-lg font-medium">All Appointments</p>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <label htmlFor="perPage" className="text-sm text-gray-600">Show:</label>
          <select
            id="perPage"
            value={appointmentsPerPage}
            onChange={handleAppointmentsPerPageChange}
            className="border rounded px-2 py-1 text-sm"
          >
            {[10, 20, 30, 40, 50].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">per page</span>
        </div>
      </div>
      
      {/* Fixed height container */}
      <div className="bg-white border rounded text-sm" style={{ height: 'calc(60vh + 56px)' }}>
        {/* Horizontal scroll wrapper for mobile */}
        <div className="overflow-x-auto sm:overflow-x-visible h-full">
          {/* Table with fixed minimum width */}
          <div className="min-w-[800px] sm:min-w-full h-full flex flex-col">
            {/* Header row */}
            <div className="grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b bg-gray-50">
              <p>#</p>
              <p>Patient</p>
              <p>Age</p>
              <p>Date & Time</p>
              <p>Doctor</p>
              <p>Fees</p>
              <p>Actions</p>
            </div>
            
            {/* Scrollable content area with fixed height */}
            <div className="flex-1 overflow-y-auto">
              {currentAppointments.map((item, index) => (
                <div 
                  key={index} 
                  className="grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center py-3 px-6 border-b hover:bg-gray-50"
                >
                  <p>{indexOfFirstAppointment + index + 1}</p>
                  <div className="flex items-center gap-2">
                    <img 
                      src={item.userData.image} 
                      alt="Patient" 
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                    <p className="truncate">{item.userData.name}</p>
                  </div>
                  <p className={`${item.userData.dob !== "Not Selected" ? '' : 'text-red-500 text-xs font-medium'}`}>
                    {item.userData.dob !== "Not Selected" ? calculateAge(item.userData.dob) : "Not Selected"}
                  </p>
                  <div className="whitespace-nowrap pr-4"> {/* Added padding-right */}
                    {slotFormatter(item.slotDate)}, {item.slotTime} {/* Added space after comma */}
                  </div>
                  <div className="flex items-center gap-2">
                    <img 
                      src={item.docData.image} 
                      alt="Doctor" 
                      className="w-8 h-8 bg-gray-200 rounded-full object-cover" 
                    />
                    <p className="truncate">{item.docData.name}</p>
                  </div>
                  <p>{currencySymbol + item.docData.fees}</p>
                  {item.cancelled ? (
                    <p className="text-red-500 text-xs font-medium">Cancelled</p>
                  ) : (
                    <img 
                      onClick={() => cancelAppointment(item._id)} 
                      className="w-6 h-6 cursor-pointer" 
                      src={assets.cancel_icon} 
                      alt="Cancel" 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination controls - positioned below the fixed height container */}
      {appointments.length > appointmentsPerPage && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstAppointment + 1} to {Math.min(indexOfLastAppointment, appointments.length)} of {appointments.length} entries
          </div>
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium ${
                  currentPage === number
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {number}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AllAppointment;