import React, { useContext } from 'react';
import { AdminContext } from '../contexts/AdminContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Close icon

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { aToken } = useContext(AdminContext);

  const logout = () => {
    localStorage.removeItem('aToken');
    window.location.reload();
  };

  return (
    <div
      className={`fixed md:relative min-h-screen border-r bg-white z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Close Button (Visible on Mobile and Tablet) */}
      <button
        onClick={toggleSidebar}
        className="absolute top-2 right-2 p-2 md:hidden z-50" // Added z-50 to ensure it's above other elements
      >
        <FontAwesomeIcon icon={faTimes} className="text-2xl text-gray-600" />
      </button>

      {aToken && (
        <ul className={`text-[#515151] ${isSidebarOpen ? 'mt-10' : ''}`}>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all duration-300 ease-in-out ${
                isActive
                  ? 'bg-[#F2F3FF] border-r-4 border-primary transform text-primary' // Added text-primary for active link
                  : 'hover:bg-[#F2F3FF] hover:border-r-4 hover:border-primary hover:transform hover:translate-x-1'
              }`
            }
            to={'/admin-dashboard'}
          >
            <img src={assets.home_icon} alt="" className="w-7" /> {/* Updated icon size */}
            <p>Dashboard</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all duration-300 ease-in-out ${
                isActive
                  ? 'bg-[#F2F3FF] border-r-4 border-primary transform text-primary' // Added text-primary for active link
                  : 'hover:bg-[#F2F3FF] hover:border-r-4 hover:border-primary hover:transform hover:translate-x-1'
              }`
            }
            to={'/all-appointment'}
          >
            <img src={assets.appointment_icon} alt="" className="w-7" /> {/* Updated icon size */}
            <p>Appointments</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all duration-300 ease-in-out ${
                isActive
                  ? 'bg-[#F2F3FF] border-r-4 border-primary transform text-primary' // Added text-primary for active link
                  : 'hover:bg-[#F2F3FF] hover:border-r-4 hover:border-primary hover:transform hover:translate-x-1'
              }`
            }
            to={'/add-doctor'}
          >
            <img src={assets.add_icon} alt="" className="w-7" /> {/* Updated icon size */}
            <p>Add Doctor</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all duration-300 ease-in-out ${
                isActive
                  ? 'bg-[#F2F3FF] border-r-4 border-primary transform text-primary' // Added text-primary for active link
                  : 'hover:bg-[#F2F3FF] hover:border-r-4 hover:border-primary hover:transform hover:translate-x-1'
              }`
            }
            to={'/add-hospital'}
          >
            <img src={assets.hospital_icon} alt="" className="w-7" /> {/* Updated icon size */}
            <p>Add Hospital</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all duration-300 ease-in-out ${
                isActive
                  ? 'bg-[#F2F3FF] border-r-4 border-primary transform text-primary' // Added text-primary for active link
                  : 'hover:bg-[#F2F3FF] hover:border-r-4 hover:border-primary hover:transform hover:translate-x-1'
              }`
            }
            to={'/doctor-list'}
          >
            <img src={assets.people_icon} alt="" className="w-7" /> {/* Updated icon size */}
            <p>Doctors List</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all duration-300 ease-in-out ${
                isActive
                  ? 'bg-[#F2F3FF] border-r-4 border-primary transform text-primary' // Added text-primary for active link
                  : 'hover:bg-[#F2F3FF] hover:border-r-4 hover:border-primary hover:transform hover:translate-x-1'
              }`
            }
            to={'/hospital-list'}
          >
            <img src={assets.hospital_list_icon} alt="" className="w-7" /> {/* Updated icon size */}
            <p>Hospital List</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all duration-300 ease-in-out ${
                isActive
                  ? 'bg-[#F2F3FF] border-r-4 border-primary transform text-primary' // Added text-primary for active link
                  : 'hover:bg-[#F2F3FF] hover:border-r-4 hover:border-primary hover:transform hover:translate-x-1'
              }`
            }
            to={'/map'}
          >
            <img src={assets.map_search_icon} alt="" className="w-7" /> {/* Updated icon size */}
            <p>Find Place</p>
          </NavLink>

          {/* Logout Button */}
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