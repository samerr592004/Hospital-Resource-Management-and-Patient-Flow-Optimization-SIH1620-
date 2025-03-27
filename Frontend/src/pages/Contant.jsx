import React from 'react';
import { assets } from '../assets/assets';

const Contant = () => {
  return (
    <div>
      <div className='my-10 flex flex-col md:flex-row gap-10 md:ml-20 justify-center'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p className='font-semibold text-lg text-gray-600'>Our OFFICE</p>
          <p className='text-gray-500'>54709 Willms Station <br /> 
          Suite 350, Washington, USA</p>
          <p className='text-gray-500'>Tel: (415) 555‑0132 <br /> Email: greatstackdev@gmail.com</p>
          <p className='font-semibold text-lg text-gray-600'>Careers at PRESCRIPTO</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          {/* Adjusted button styles */}
          <button className='border border-black py-4 px-8 self-start hover:bg-black hover:text-white hover:border-black transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
    </div>
  );
}

export default Contant;
