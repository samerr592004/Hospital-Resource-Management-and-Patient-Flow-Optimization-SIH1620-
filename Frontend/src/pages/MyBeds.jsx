import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyBed = () => {
  const { backendUrl,token} = useContext(AppContext);



  const [appointments,setAppointments] = useState([])


  const getUserApppointments= async () =>{
    try{

      const {data}= await axios.get(backendUrl+'/api/user/appointments',{headers:{token}})
      console.log(data)
      if(data.success){
        setAppointments(data.appointments.reverse())
        console.log(data.appointments)
      }

    }catch(error){
      console.log(error)
      

    }

  }


  useEffect(()=>{

    if(token){
      getUserApppointments()
    }

  },[token])
  

  return (
    <div className='m-[3rem]'>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div className=' grid md:grid-cols-[1fr_2fr] gap-4 sm:flex  sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-40 bg-indigo-100' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600 mt-3'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p className='text-zinc-800 font-medium '>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs mt-1'> Date & Time: <span className='text-sm text-neutral-700 font-medium'>{item.slotDate}|{item.slotTime}</span></p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
              <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:scale-105 translate-all hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>
              <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:scale-105 translate-all hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBed;
