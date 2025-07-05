import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const[showMenu,setShowMenu]=useState(false);



  const {token,setToken,userData}=useContext(AppContext)
  // const[token,setToken]=useState(true);

  const logout=()=>{

    setToken(false)
    localStorage.removeItem('token')
  }
  
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-black m-3">
      
      <img onClick={()=>navigate('/')} className="w-44 cursor-pointer " src={assets.logo} alt="Logo" />
      <ul className="hidden md:flex items-start gap-5 font-semibold text-base">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `group relative ${
              isActive || location.pathname === '/' ? 'text-primary animate-ease-in' : ''
            }`
          }
        >
          <li className="py-1">Home</li>
          <hr className="transition-all duration-300 ease-in-out border-none outline-none h-0.5 bg-primary w-0 m-auto group-hover:w-3/5" />
        </NavLink>
        <NavLink
          to="/hospital"
          className={({ isActive }) =>
            `group relative ${isActive ? 'text-primary animate-ease-in' : ''}`
          }
        >
          <li className="py-1">Hospital</li>
          <hr className="transition-all duration-300 ease-in-out border-none outline-none h-0.5 bg-primary w-0 m-auto group-hover:w-3/5" />
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `group relative ${isActive ? 'text-primary animate-ease-in' : ''}`
          }
        >
          <li className="py-1">About</li>
          <hr className="transition-all duration-300 ease-in-out border-none outline-none h-0.5 bg-primary w-0 m-auto group-hover:w-3/5" />
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `group relative ${isActive ? 'text-primary animate-ease-in' : ''}`
          }
        >
          <li className="py-1">Contact</li>
          <hr className="transition-all duration-300 ease-in-out border-none outline-none h-0.5 bg-primary w-0 m-auto group-hover:w-3/5" />
        </NavLink>
        <a target="_blank" href='  http://localhost:5174/' class="border px-5 text-xs py-1.5 rounded-full">Admin Panel</a>
      </ul>
      <div className="flex items-center gap-4 ">
        {
            token && userData
            ?<div className='flex items-center gap-3 cursor-pointer group relative'>
                <img className='w-8 rounded-full' src={userData.image} alt="" />
                <img className='w-2.5'src={assets.dropdown_icon} alt="" />
                <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                   <div className='min-w-48 bg-stone-200 rounded p-3 flex justify-center flex-col gap-4 text-medium'>
                   <p onClick={()=>navigate('my-profile')}  className="p-1 hover:text-primary cursor-pointer">My Profile</p>
                    <p onClick={()=>navigate('my-appointments')}  className="p-1 hover:text-primary cursor-pointer">My Appointment</p>
                    <p onClick={()=>navigate('my-beds')}  className="p-1 hover:text-primary cursor-pointer">My Beds</p>
                    <p onClick={logout} className="p-1 hover:text-primary cursor-pointer">Logout</p>
                   </div>

                </div>

            </div>
            :<button
            onClick={() => {
              navigate('/login');
            }}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Sign Up/Sign In
          </button>
        }
        <img onClick={()=>setShowMenu(true)} className='w-6 md:hidden cursor-pointer' src={assets.menu_icon} alt="" />
        {/* {Mobile Menu} */}
        <div className={`${showMenu ? 'fixed  w-full ':'h-0 w-0 '}md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
             <img onClick={()=>navigate('/')} className='w-36 cursor-pointer' src={assets.logo} alt="" />
             <img className='w-7 cursor-pointer' onClick={()=>setShowMenu(false)}  src={assets.cross_icon} alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink  
            className={({ isActive }) =>
            `group relative ${isActive ? 'text-primary animate-ease-in' : ''}`
          } onClick={()=>setShowMenu(false)} to='/'>
            <p className='px-4 py-2 rounedd inline-block'>Home</p>
          <hr className="transition-all duration-300 ease-in-out border-none outline-none h-0.5 bg-primary w-0 m-auto group-hover:w-3/5" />
          </NavLink>


            <NavLink
             className={({ isActive }) =>
            `group relative ${isActive ? 'text-primary animate-ease-in' : ''}`
          }  onClick={()=>setShowMenu(false)} to='/hospital' >
            <p className='px-4 py-2 rounedd inline-block'>All Hospital</p>
          <hr className="transition-all duration-300 ease-in-out border-none outline-none h-0.5 bg-primary w-0 m-auto group-hover:w-3/5" />
          </NavLink>

            <NavLink className={({ isActive }) =>
            `group relative ${isActive ? 'text-primary animate-ease-in' : ''}`
          }  onClick={()=>setShowMenu(false)} to='/about'>
            <p className='px-4 py-2 rounedd inline-block'>About</p>
            <hr className="transition-all duration-300 ease-in-out border-none outline-none h-0.5 bg-primary w-0 m-auto group-hover:w-3/5" />
            </NavLink>
            <NavLink className={({ isActive }) =>
            `group relative ${isActive ? 'text-primary animate-ease-in' : ''}`
          }  onClick={()=>setShowMenu(false)} to='/contact'>
            <p className='px-4 py-2 rounedd inline-block'>Contact</p>
            <hr className="transition-all duration-300 ease-in-out border-none outline-none h-0.5 bg-primary w-0 m-auto group-hover:w-3/5" />
            </NavLink>
           
            {
            token && userData
            ?
            <NavLink
            onClick={()=>{setShowMenu(false)
              logout()
            }} 
            className="bg-primary text-white px-8 py-3 rounded-full font-light  md:block"
          >
            Logout
          </NavLink>
            :<NavLink
            onClick={()=>setShowMenu(false)} to='/login'
            className="bg-primary text-white px-8 py-3 rounded-full font-light  md:block"
          >
            Sign Up/Sign In
          </NavLink>
        }
        

          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar;
