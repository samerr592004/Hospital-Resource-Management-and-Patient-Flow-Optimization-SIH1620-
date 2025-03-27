import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctor from '../components/RelatedDoctor';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { toast } from 'react-toastify';
import axios from 'axios';

function Appointment() {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorData } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('')
  const Days = ['SUN', 'MON', 'TUS', 'WED', 'THU', 'FRI', 'SAT'];


  const navigate = useNavigate()

  const fetchDocInfo = () => {
    const foundDoctor = doctors.find(doc => doc._id === docId);
    setDocInfo(foundDoctor);
  };



  
  const doctorTestimonials = docInfo?.reviews
  ? Object.values(docInfo.reviews).map((review, index) => (
    {
      name: review?.name || "Anonymous",
      feedback: review?.feedback || "No comment provided.",
        stars: review?.stars || 0,
      image: review?.image,

    }))
  : [];

  



  const getAvilableSlot = async () => {
    if (!docInfo || !docInfo.slot_booked) return;  // Prevent null access
  
    setDocSlot([]);
    let today = new Date();
  
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);
  
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
  
      let timeSolt = [];
      console
      // .log(docInfo.slot_booked)
      while (currentDate < endTime) {
        let formattedtime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
  
        const slotDate = `${day}/${month}/${year}`;
        const slotTime = formattedtime;
        
        // console.log(slotDate) 
        const isSlotAvailable =
          docInfo.slot_booked[slotDate] && docInfo.slot_booked[slotDate].includes(slotTime)
            ? false
            : true;

            // console.log(isSlotAvailable)
  
        if (isSlotAvailable) {
          timeSolt.push({
            datetime: new Date(currentDate),
            time: formattedtime,
          });
        }
        // console.log(timeSolt)
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlot(prev => [...prev, timeSolt]);
    }
  };
  

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login for book appointment')
      return navigate('/login')
    }

    try {
      const date = docSlot[slotIndex][0].datetime


      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()


      const slotDate = day + "/" + month + "/" + year


      const { data } = await axios.post(backendUrl + "/api/user/book-appointment", { docId, slotDate, slotTime, }, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        getDoctorData()
        navigate("/my-appointments")
      } else {
        // console.log(data.message)
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)

    }

  }



  useEffect(() => {
    fetchDocInfo();
  }, [docId, doctors]);

  useEffect(() => {
    getAvilableSlot();
  }, [docInfo]);

  if (!docInfo) {
    return <div>Loading doctor information...</div>;
  }

  return (
    <div>
      {/* Doctor Details */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='flex items-center border gap-2 text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          {/* Doctor About */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About
              <img src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <div>
            <p className='text-sm text-gray-700 font-medium mt-4'>
              Appointment fee:
              <span className='text-gray-800'>{currencySymbol}{docInfo.fees}</span>
            </p>
          </div>

        </div>
      </div>


      {/* Slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p className='text-xl font-medium text-primary'>Booking Slot</p>
        <div className={`flex gap-3 items-center w-full overflow-x-scroll mt-4`}>
          {docSlot.length && docSlot.map((item, index) => (
            <div
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'} ${index === 0 && (!item[0] || !item[0].datetime) ? 'invisible' : 'visible'}`}
              key={index}
            >
              {/* Display only day name */}
              <p>{item[0] && Days[item[0].datetime.getDay()]}</p>
              {/* Display only date */}
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Displaying Time Slots */}
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlot.length && docSlot[slotIndex].map((item, index) => (
            // Display only time
            <p
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0  px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'bg-gray-100 border border-gray-300'}`} key={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>

      </div>

      {/* Testimonials Section */}
      <TestimonialCarousel testimonials={doctorTestimonials} />
      

      {/* {Related Doctors} */}
      <RelatedDoctor docId={docId} speciality={docInfo.speciality} />
    </div>
  );
}

export default Appointment;
