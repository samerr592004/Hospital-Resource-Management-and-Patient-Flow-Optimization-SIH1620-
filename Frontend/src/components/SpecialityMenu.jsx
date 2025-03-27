import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

function Specialitymenu() {
  return (
    <div id='speciality' className='flex flex-col items-center gap-4 py-16 '>
      <h1 className='text-3xl font-medium text-primary'>Find By Speciality</h1>
      <p className='w-full sm:w-1/2 text-center text-sm'>
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>

      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
        {specialityData.map((item, index) => (
          <Link
            key={index}
            onClick={() => scrollTo(0, 0)}
            to={`/doctors/${item.speciality}`}
            className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:-translate-y-2 transition-all duration-500 relative z-10'
          >
            <img className='w-16 sm:w-24 mb-2' src={item.image} alt={item.speciality} />
            <p className='text-center'>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Specialitymenu;
