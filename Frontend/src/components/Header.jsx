import React from 'react';
import { assets } from '../assets/assets';

function Header() {
  return (
    <div className="flex flex-col md:flex-row items-center bg-primary rounded-lg px-6 md:px-10 lg:px-20 py-0">
      {/* Left side */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-6">
        <p className="mt-5 text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight">
          Book Appointment <br />
          With Trusted Doctors
        </p>
        <div className="flex flex-col items-center gap-4">
          <img className="w-28 rounded-full" src={assets.group_profiles} alt="Group Profiles" />
          <p className="text-white text-base">
            Simply browse through our extensive list of trusted doctors, <br />
            schedule your appointment hassle-free.
          </p>
        </div>
        <a
          href="#speciality"
          className="mt-4 px-6 py-3 bg-white text-primary rounded-full flex items-center gap-2 font-medium hover:scale-105 transition-transform duration-300"
        >
          Book Appointment
          <img className="w-4 h-4" src={assets.arrow_icon} alt="Arrow Icon" />
        </a>
      </div>

      {/* Right side */}
      <div className="md:w-1/2 flex items-center justify-center relative mt-8 md:mt-0">
        <img
          className="w-full h-auto object-cover rounded-lg"
          src={assets.header_img}
          alt="Header Image"
        />
      </div>
    </div>
  );
}

export default Header;
