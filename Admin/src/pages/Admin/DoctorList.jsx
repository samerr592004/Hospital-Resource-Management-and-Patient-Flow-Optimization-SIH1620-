import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../contexts/AdminContext';
import { useParams } from 'react-router-dom';

const DoctorList = () => {
  const { doctors, getAllDoctors, getDoctorsByHospital, aToken, changeAvilability } = useContext(AdminContext);
  const { hospitalId } = useParams(); // Get hospitalId from the URL


   console.log(hospitalId)
  useEffect(() => {
    if (aToken) {
      if (hospitalId) {
        // Fetch doctors for the specific hospital
        getDoctorsByHospital(hospitalId);
      } else {
        // Fetch all doctors
        getAllDoctors();
      }
    }
  }, [aToken, hospitalId]);

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>
        {hospitalId ? "Hospital Doctors" : "All Doctors"}
      </h1>
      <div className='sm:justify-center sm:items-center w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.length > 0 ? (
          doctors.map((item, index) => (
            <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group:' key={index}>
              <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
              <div className='p-4'>
                <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                <div className='mt-2 flex items-center gap-1 text-sm'>
                  <input onChange={() => changeAvilability(item._id)} type="checkbox" checked={item.avilable} />
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No doctors available</p>
        )}
      </div>
    </div>
  );
};

export default DoctorList;