import React, { useState, useContext } from "react";
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from "./contexts/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Slidebar"; // Renamed to Sidebar for clarity
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AddDoctor from './pages/Admin/AddDoctor';
import AllAppointment from './pages/Admin/AllAppointment';
import DoctorList from "./pages/Admin/DoctorList";
import AddHospital from "./pages/Admin/AddHospital";
import Map from "./pages/Admin/Map";
import HospitalList from "./pages/Admin/hospitalList";
import BedStatus from "./pages/Admin/BedStatus";
import { DoctorContext } from "./contexts/DoctorContext";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorApppointment from "./pages/Doctor/DoctorApppointment";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorTestimonials from "./pages/Doctor/DoctorTestimonials";


function App() {
  const { aToken,setAToken } = useContext(AdminContext);
  const { dToken ,setDToken} = useContext(DoctorContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle Sidebar visibility
  };

  return aToken || dToken? (
    <div className='bg-[#F8F9Fd]'>
      <ToastContainer />
      {/* Navbar with toggleSidebar function */}
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex items-start">
        {/* Sidebar with isSidebarOpen and toggleSidebar props */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Routes>
          {/* Admin Rout */}
          {aToken?<Route path="/" element={<Dashboard />} />:<Route path="/" element={<DoctorDashboard />} />}
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointment" element={<AllAppointment />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/add-hospital" element={<AddHospital />} />
          <Route path="/doctor-list" element={<DoctorList />} />
          <Route path="/hospital-list" element={<HospitalList />} />
          <Route path="/hospital-list/:hospitalId/doctors" element={<DoctorList />} />
          <Route path="/hospital-list/:hospitalId/beds" element={<BedStatus />} />
          <Route path="/map" element={<Map />} />

          {/* Doctor Rout */}
          {/* <Route path="/" element={<DoctorDashboard/>} /> */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointments" element={<DoctorApppointment/>} />
          <Route path="/doctor-profile" element={<DoctorProfile/>} />
          <Route path="/doctor-testimonials" element={<DoctorTestimonials/>} />



        </Routes>

        
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
}

export default App;