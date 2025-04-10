import React, { useContext,useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function RelatedDoctor({speciality,docId}) {
    const {doctors}=useContext(AppContext)
    const [relDoc, setRleDoc] = useState([])
    const navigate=useNavigate()

useEffect(()=>{
    if(doctors.length>0 && speciality){
        const doctorsData=doctors.filter((doc)=>doc.speciality=== speciality && doc._id!==docId)
        setRleDoc(doctorsData)
    }
},[doctors,speciality,docId])


  return (
    <div className='flex  flex-col items-center gap-4 py-16 '>
    <h1 className='text-3xl font-medium text-primary'>Related Doctors</h1>
    <p className='w-1/3 text-center text-sm ' >Simply browse through our extensive list of trusted doctors.</p>
    <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
      {relDoc.slice(0,5).map((item, index) => (
        <div onClick={()=>{navigate(`/appointment/${item._id}`);scrollTo(0,0)}} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
          <img className='bg-blue-50' src={item.image} alt="" />
          <div className='p-4'>
          <div className={`flex items-center gap-2 text-sm text-center ${item.avilable ?' text-green-500' : ' text-red-500'}`}>
                  <p className={`w-2 h-2 ${item.avilable ?' bg-green-500' : ' bg-red-500'}  rounded-full`}></p><p>{item.avilable ?" Available ": "Not Available"}</p>
                </div> 
              <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
              <p className='text-gray-500 text-sm'>{item.speciality}</p>
          </div>
        </div>

      ))}
    </div>
  <button onClick={()=>{navigate('/doctors');scrollTo(0,0)}} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'>More</button>
  </div>
  )
}

export default RelatedDoctor