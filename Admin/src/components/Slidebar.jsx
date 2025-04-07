import React, { useContext } from 'react';
import { AdminContext } from '../contexts/AdminContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DoctorContext } from '../contexts/DoctorContext';

// Reusable Sidebar Link Component
const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all duration-300 ease-in-out ${
        isActive
          ? 'bg-[#F2F3FF] border-r-4 border-primary text-primary font-semibold'
          : 'hover:bg-[#F2F3FF] hover:border-r-4 hover:border-primary'
      }`
    }
  >
    <img src={icon} alt="" className="w-7" />
    <p>{label}</p>
  </NavLink>
);

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const logout = () => {
    localStorage.removeItem('aToken');
    localStorage.removeItem('dToken');
    window.location.reload();
  };

  return (
    <div
      className={`fixed  md:relative min-h-screen border-r bg-white lg:z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      

      {(aToken || dToken) && (
        <ul >
          {/* Admin Links */}
          {aToken && (
            <>
              <SidebarLink to="/admin-dashboard" icon={assets.home_icon} label="Dashboard" />
              <SidebarLink to="/all-appointment" icon={assets.appointment_icon} label="Appointments" />
              <SidebarLink to="/add-doctor" icon={assets.add_icon} label="Add Doctor" />
              <SidebarLink to="/add-hospital" icon={assets.hospital_icon} label="Add Hospital" />
              <SidebarLink to="/doctor-list" icon={assets.people_icon} label="Doctors List" />
              <SidebarLink to="/hospital-list" icon={assets.hospital_list_icon} label="Hospital List" />
              <SidebarLink to="/map" icon={assets.map_search_icon} label="Find Place" />
            </>
          )}

          {/* Doctor Links */}
          {dToken && (
            <>
              <SidebarLink to="/doctor-dashboard" icon={assets.home_icon} label="Dashboard" />
              <SidebarLink to="/doctor-appointments" icon={assets.appointment_icon} label="Appointments" />
              <SidebarLink to="/doctor-testimonials" icon={assets.testimonial_icon} label="Testimonials" />
              <SidebarLink to="/doctor-profile" icon={assets.profile_icon} label="Profile" />
            </>
          )}

          {/* Logout Button (Mobile only) */}
          <div className="block md:hidden mt-4 px-3 md:px-9">
            <button
              onClick={logout}
              className="bg-primary text-white text-sm px-10 py-2 rounded-full w-full md:w-auto"
            >
              Logout
            </button>
          </div>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
