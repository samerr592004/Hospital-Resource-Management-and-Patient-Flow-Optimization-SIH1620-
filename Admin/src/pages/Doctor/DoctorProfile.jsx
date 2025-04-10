import React, { useContext, useState } from 'react'
import { DoctorContext } from '../../contexts/DoctorContext'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../contexts/AppContext'

const DoctorProfile = () => {
  const { dToken, getDocotrData, doctorData, setDoctorData, hospitalData, setHospitalData, backendUrl } = useContext(DoctorContext)
  const { currencySymbol } = useContext(AppContext)
  const [isEditable, setIsEditable] = useState(false)

  const updateProfileData = async () => {
    try {

      const updateData ={
        address:doctorData.address,
        fees:doctorData.fees,
        avilable:doctorData.avilable
      }

        const {data}= await axios.post(backendUrl+"/api/doctor/update-profile" ,updateData ,{headers:{dToken}})


      if (data.success) {
        toast.success(data.message)
      
        setIsEditable(false)
        getDocotrData()
        
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // Return null or loading state if doctorData is not available yet
  if (!doctorData) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex flex-col gap-4 m-5'>
      <div>
        <div>
          <img className='bg-primary w-full sm:max-w-64 rounded-lg' src={doctorData.image} alt="" />
        </div>

        <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{doctorData.name}</p>
          <div className='flex items-center gap-2 text-gray-600 mt-1'>
            <p className='flex items-center gap-2 mt-2 text-gray-700'>{doctorData.degree}-{doctorData.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{doctorData.experience}</button>
          </div>

          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-5'>About:</p>
            <p className='text-sm text-gray-600 mt-1 max-w-[700px]'>{doctorData.about}</p>
          </div>

          <p className='text-gray-600 font-medium mt-4'>
            Appointment fee: <span className='text-gray-800'>{currencySymbol}{isEditable ? <input onChange={(e) => setDoctorData(prev => ({ ...prev, fees: e.target.value }))} value={doctorData.fees} type="number" /> : doctorData.fees}</span>
          </p>

          <div className='flex gap-2 py-2'>
            <p>Address:</p>
            <p className='text-sm'>
              {
                isEditable ? (
                  <input
                    onChange={(e) => setDoctorData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line1: e.target.value
                      }
                    }))}
                    value={doctorData.address?.line1 || ''}
                    type="text"
                  />
                ) : (
                  doctorData.address?.line1 || 'N/A'
                )
              }
              <br />
              {
                isEditable ? (
                  <input
                    onChange={(e) => setDoctorData(prev => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line2: e.target.value
                      }
                    }))}
                    value={doctorData.address?.line2 || ''}
                    type="text"
                  />
                ) : (
                  doctorData.address?.line2 || 'N/A'
                )
              }
            </p>
          </div>

          <div className='flex gap-1 pt-2'>
            <input onChange={()=>isEditable && setDoctorData(prev=>({...prev,avilable:!prev.avilable}))} checked={doctorData.avilable} type="checkbox" name='' id='' />
            <label htmlFor="">Available</label>
          </div>

         {
          isEditable?
          <button
          onClick={updateProfileData}
          className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'
        >
          Save
        </button>
         :
         <button
         onClick={() => setIsEditable(true)}
         className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'
       >
         Edit
       </button>
         }
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile