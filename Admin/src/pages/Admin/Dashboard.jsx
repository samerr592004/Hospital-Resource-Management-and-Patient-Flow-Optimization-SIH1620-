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
  FaChevronRight
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

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load dashboard data</p>
      </div>
    );
  }

  // Stats Cards Component
  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md ${color} transition-all hover:shadow-lg`}>
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-opacity-20 bg-white mr-4">
          {icon}
        </div>
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
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

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Healthcare Admin Dashboard</h1>
      
      {/* Navigation Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'appointments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'reports' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard 
              title="Total Patients" 
              value={dashboardData.patients} 
              icon={<FaUserInjured className="text-blue-600 text-xl" />}
              color="bg-blue-50 text-blue-600"
            />
            <StatCard 
              title="Total Doctors" 
              value={dashboardData.doctors} 
              icon={<FaUserMd className="text-green-600 text-xl" />}
              color="bg-green-50 text-green-600"
            />
            <StatCard 
              title="Hospitals" 
              value={dashboardData.hospitals} 
              icon={<FaHospital className="text-purple-600 text-xl" />}
              color="bg-purple-50 text-purple-600"
            />
            <StatCard 
              title="Today's Appointments" 
              value={dashboardData.todayAppointmentsCount} 
              icon={<FaCalendarAlt className="text-yellow-600 text-xl" />}
              color="bg-yellow-50 text-yellow-600"
            />
            <StatCard 
              title="Total Appointments" 
              value={dashboardData.appointments} 
              icon={<FaCalendarAlt className="text-red-600 text-xl" />}
              color="bg-red-50 text-red-600"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Specialty Distribution</h2>
              <div className="h-64">
                <Pie data={specialtyChartData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Patient Age Distribution</h2>
              <div className="h-64">
                <Bar data={ageChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="w-full max-w-full ">
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
          
          <div className="bg-white border rounded text-sm h-[70vh]">
            <div className="overflow-x-auto sm:overflow-x-visible h-full">
              <div className="min-w-[800px] sm:min-w-full h-full flex flex-col">
                <div className="grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b bg-gray-50">
                  <p>#</p>
                  <p>Patient</p>
                  <p>Age</p>
                  <p>Date & Time</p>
                  <p>Doctor</p>
                  <p>Fees</p>
                  <p>Actions</p>
                </div>
                
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
                      <div className="whitespace-nowrap pr-4">
                        {slotFormatter(item.slotDate)}, {item.slotTime}
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
      )}

      {activeTab === 'reports' && (
        <div className="bg-white p-6 rounded-lg shadow-md h-[70vh] overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Specialty Distribution</h2>
              <div className="h-64">
                <Pie data={specialtyChartData} options={chartOptions} />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Patient Age Distribution</h2>
              <div className="h-64">
                <Bar data={ageChartData} options={chartOptions} />
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
              <div className="h-64">
                <Line data={revenueChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;