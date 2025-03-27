import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const { hospitalId, speciality } = useParams();
  const { doctors,hospitals} = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Function to apply filtering based on hospitalId and speciality
  const applyFilter = () => {
    let filteredDoctors = doctors;
      console.log(doctors)
    // Filter doctors by hospitalId
    if (hospitalId) {
      filteredDoctors = filteredDoctors.filter(doc => doc.hospital=== hospitalId);
    }

    // Filter doctors by speciality
    if (speciality) {
      filteredDoctors = filteredDoctors.filter(doc => doc.speciality === speciality);
    }

    setFilterDoc(filteredDoctors);
  };

  useEffect(() => {
    applyFilter();

  }, [speciality, hospitalId,hospitals,doctors]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <p className='text-gray-600'>Browse through the specialist doctors.</p>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        {/* Button to show filters on small screens */}
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilters ? 'bg-primary text-white' : ''
          }`}
          onClick={() => setShowFilters(prev => !prev)}
        >
          Filters
        </button>

        {/* Speciality Filter Section */}
        <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilters ? 'flex' : 'hidden sm:flex'}`}>
          {[
            'General physician',
            'Gynecologist',
            'Dermatologist',
            'Pediatricians',
            'Neurologist',
            'Gastroenterologist'
          ].map(specialityName => (
            <p
              key={specialityName}
              onClick={() =>
                speciality === specialityName
                  ? navigate('/doctors')
                  : hospitalId
                  ? navigate(`/hospital/${hospitalId}/doctors/${specialityName}`)
                  : navigate(`/doctors/${specialityName}`)
              }
              className={`w-[94vm] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === specialityName ? 'bg-indigo-100 text-black' : ''
              }`}
            >
              {specialityName}
            </p>
          ))}
        </div>

        {/* Doctors Listing */}
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.length > 0 ? (
            filterDoc.map((doctor, index) => (
              <div
                key={index}
                onClick={() => hospitalId ? navigate(`/hospital/${hospitalId}/doctors/appointment/${doctor._id}`) : navigate(`/appointment/${doctor._id}`)}
                className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
              >
                <img className='bg-blue-50 w-full' src={doctor.image} alt={doctor.name} />
                <div className='p-4'>
                  <div className='flex items-center gap-2 text-sm text-green-500'>
                    <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                    <p>Available</p>
                  </div>
                  <p className='text-gray-900 text-lg font-medium'>{doctor.name}</p>
                  <p className='text-gray-500 text-sm'>{doctor.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-500'>No doctors found for the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
