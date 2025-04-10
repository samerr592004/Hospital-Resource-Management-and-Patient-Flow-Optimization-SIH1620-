import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../contexts/AdminContext';
import { DoctorContext} from '../contexts/DoctorContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'; // Hamburger menu icon

function Navbar({ toggleSidebar }) {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate('/');
    if(aToken){
    aToken && setAToken('');
    aToken && localStorage.removeItem('aToken');
    }
      dToken && setDToken('');
      dToken && localStorage.removeItem('dToken');
    
  };

  return (
    <div className='flex sticky   justify-between items-center px-4 sm:px-10 py-3 border-b bg-white '>
      <div className='flex items-center gap-2 text-xs'>
        {/* Hamburger Menu (Visible on Mobile and Tablet) */}
       
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
      {/* Logout Button (Hidden on Mobile and Tablet) */}
      <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full hidden md:block'>
        Logout
      </button>
      <button onClick={toggleSidebar} className="block md:hidden">
          <FontAwesomeIcon icon={faBars} className="text-2xl text-gray-600" />
        </button>
    </div>
  );
}

export default Navbar;