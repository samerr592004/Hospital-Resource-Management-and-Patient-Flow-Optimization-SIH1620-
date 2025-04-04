import React, { useState, useEffect, useContext } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import {
  FaUserInjured,
  FaUserMd,
  FaHospital,
  FaCalendarAlt,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaBars
} from 'react-icons/fa';
import { AdminContext } from '../../contexts/AdminContext';
import { AppContext } from '../../contexts/AppContext';
import { assets } from '../../assets/assets';

// Register Chart.js components
Chart.register(...registerables);

const AdminDashboard = () => {
  const { aToken, dashboardData, getDashboardData, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, currencySymbol } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage, setAppointmentsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  // const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (aToken) {
      getDashboardData();
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
    setCurrentPage(1);
  };

  // Calculate total pages
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-[100vh] w-[100vw]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Stats Cards Component - Responsive version
  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white p-4 md:p-6 rounded-lg shadow-md ${color} transition-all hover:shadow-lg`}>
      <div className="flex items-center">
        <div className="p-2 md:p-3 rounded-full bg-opacity-20 bg-white mr-3 md:mr-4">
          {React.cloneElement(icon, { className: "text-lg md:text-xl" })}
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-600">{title}</p>
          <p className="text-lg md:text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  // Prepare chart data
  const specialtyChartData = {
    labels: dashboardData.specialtyDistribution.labels,
    datasets: [{
      data: dashboardData.specialtyDistribution.data,
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#8AC24A', '#607D8B', '#E91E63', '#2196F3'
      ],
      borderWidth: 1
    }]
  };

  const ageChartData = {
    labels: dashboardData.ageDistribution.labels,
    datasets: [{
      label: 'Patients by Age',
      data: dashboardData.ageDistribution.data,
      backgroundColor: '#3B82F6',
      borderColor: '#1D4ED8',
      borderWidth: 1
    }]
  };

  const revenueChartData = {
    labels: dashboardData.revenueTrend.labels,
    datasets: [{
      label: 'Daily Revenue',
      data: dashboardData.revenueTrend.data,
      fill: true,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.4
    }]
  };

  // Responsive chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: window.innerWidth < 768 ? 'bottom' : 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label || ''}: ${context.parsed.y?.toLocaleString() || context.raw}`;
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-2 md:p-4 lg:p-8">
      

      <h1 className="hidden md:block text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Healthcare Admin Dashboard</h1>

      {/* Responsive Navigation Tabs */}
      <div className={`block md:flex border-b mb-4 md:mb-6 flex-col md:flex-row`}>
        <button
          className={`px-3 py-2 text-sm md:text-base md:px-4 md:py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => {
            setActiveTab('overview');
            setShowMobileMenu(false);
          }}
        >
          Overview
        </button>
        <button
          className={`px-3 py-2 text-sm md:text-base md:px-4 md:py-2 font-medium ${activeTab === 'appointments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => {
            setActiveTab('appointments');
            setShowMobileMenu(false);
          }}
        >
          Appointments
        </button>
        <button
          className={`px-3 py-2 text-sm md:text-base md:px-4 md:py-2 font-medium ${activeTab === 'reports' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => {
            setActiveTab('reports');
            setShowMobileMenu(false);
          }}
        >
          Reports
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4 md:space-y-6">
          {/* Responsive Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
            <StatCard 
              title="Patients" 
              value={dashboardData.patients} 
              icon={<FaUserInjured className="text-blue-600" />}
              color="bg-blue-50 text-blue-600"
            />
            <StatCard 
              title="Doctors" 
              value={dashboardData.doctors} 
              icon={<FaUserMd className="text-green-600" />}
              color="bg-green-50 text-green-600"
            />
            <StatCard 
              title="Hospitals" 
              value={dashboardData.hospitals} 
              icon={<FaHospital className="text-purple-600" />}
              color="bg-purple-50 text-purple-600"
            />
            <StatCard 
              title="Today" 
              value={dashboardData.todayAppointmentsCount} 
              icon={<FaCalendarAlt className="text-yellow-600" />}
              color="bg-yellow-50 text-yellow-600"
            />
            <StatCard 
              title="Total Apps" 
              value={dashboardData.appointments} 
              icon={<FaCalendarAlt className="text-red-600" />}
              color="bg-red-50 text-red-600"
            />
          </div>

          {/* Responsive Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
              <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Specialty Distribution</h2>
              <div className="h-48 md:h-64">
                <Pie data={specialtyChartData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
              <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Patient Age Distribution</h2>
              <div className="h-48 md:h-64">
                <Bar data={ageChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="w-full h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] flex flex-col">
          {/* Responsive Header with controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 w-full">
            <h2 className="text-lg md:text-xl font-semibold mb-2 sm:mb-0">Appointments</h2>
            <div className="flex items-center gap-2">
              <label htmlFor="perPage" className="text-xs md:text-sm text-gray-600">Show:</label>
              <select
                id="perPage"
                value={appointmentsPerPage}
                onChange={handleAppointmentsPerPageChange}
                className="border rounded px-2 py-1 text-xs md:text-sm"
              >
                {[10, 20, 30, 40, 50].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="text-xs md:text-sm text-gray-600">entries</span>
            </div>
          </div>

          {/* Responsive Appointments Table */}
          <div className="bg-white border rounded-lg shadow-sm w-full flex-1 overflow-hidden">
            <div className="overflow-x-auto h-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                    <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentAppointments.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {indexOfFirstAppointment + index + 1}
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={item.userData.image}
                            alt="Patient"
                            className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover mr-1 md:mr-2"
                          />
                          <span className="text-xs md:text-sm font-medium text-gray-900 truncate max-w-[80px] md:max-w-none">
                            {item.userData.name}
                          </span>
                        </div>
                      </td>
                      <td className={`px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm ${item.userData.dob !== "Not Selected" ? 'text-gray-500' : 'text-red-500 font-medium'}`}>
                        {item.userData.dob !== "Not Selected" ? calculateAge(item.userData.dob) : "N/A"}
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span>{slotFormatter(item.slotDate)}</span>
                          <span className="text-xs">{item.slotTime}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={item.docData.image}
                            alt="Doctor"
                            className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover mr-1 md:mr-2"
                          />
                          <span className="text-xs md:text-sm font-medium text-gray-900 truncate max-w-[80px] md:max-w-none">
                            {item.docData.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {currencySymbol}{item.docData.fees}
                      </td>
                      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {item.cancelled ? (
                          <span className="px-1 py-0.5 md:px-2 md:py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                            Cancelled
                          </span>
                        ) : (
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <img
                              src={assets.cancel_icon}
                              alt="Cancel"
                              className="w-4 h-4 md:w-5 md:h-5"
                            />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Responsive Pagination */}
          {appointments.length > appointmentsPerPage && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-3 md:mt-4 gap-2 md:gap-4">
              <div className="text-xs md:text-sm text-gray-600">
                Showing {indexOfFirstAppointment + 1} to {Math.min(indexOfLastAppointment, appointments.length)} of {appointments.length}
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 md:px-3 md:py-1 border rounded-l-md bg-white text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  if (totalPages <= 5) return i + 1;
                  if (currentPage <= 3) return i + 1;
                  if (currentPage >= totalPages - 2) return totalPages - 4 + i;
                  return currentPage - 2 + i;
                }).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-2 py-1 md:px-3 md:py-1 border-t border-b text-xs md:text-sm font-medium ${
                      currentPage === number
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2 py-1 border-t border-b border-gray-300 bg-white text-gray-700">...</span>
                )}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => paginate(totalPages)}
                    className={`px-2 py-1 md:px-3 md:py-1 border-t border-b text-xs md:text-sm font-medium ${
                      currentPage === totalPages
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 md:px-3 md:py-1 border rounded-r-md bg-white text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="w-full h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Appointment Trends</h2>
              <div className="h-64 md:h-72">
                <Line 
                  data={{
                    labels: dashboardData.appointmentTrends?.labels || [],
                    datasets: [{
                      label: 'Daily Appointments',
                      data: dashboardData.appointmentTrends?.data || [],
                      fill: true,
                      backgroundColor: 'rgba(79, 70, 229, 0.2)',
                      borderColor: 'rgba(79, 70, 229, 1)',
                      tension: 0.4
                    }]
                  }}
                  options={chartOptions}
                />
              </div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Revenue Analytics</h2>
              <div className="h-64 md:h-72">
                <Line 
                  data={revenueChartData} 
                  options={{
                    ...chartOptions,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return currencySymbol + value;
                          }
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Specialty Distribution</h2>
              <div className="h-64 md:h-72">
                <Pie data={specialtyChartData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Patient Demographics</h2>
              <div className="h-64 md:h-72">
                <Bar 
                  data={ageChartData} 
                  options={{
                    ...chartOptions,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
            

          
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;