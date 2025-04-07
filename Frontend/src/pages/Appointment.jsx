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
  const [slotTime, setSlotTime] = useState('');
  const Days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [rating, setRating] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    total: 0
  });

  const navigate = useNavigate();

  const fetchDocInfo = () => {
    const foundDoctor = doctors.find(doc => doc._id === docId);
    setDocInfo(foundDoctor);
  };

  const doctorTestimonials = docInfo?.reviews
    ? Object.values(docInfo.reviews).map((review, index) => ({
      name: review?.name || "Anonymous",
      feedback: review?.feedback || "No comment provided.",
      stars: review?.stars || 0,
      image: review?.image,
      data:review.date
    }))
    : [];

  useEffect(() => {
    let newRating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, total: doctorTestimonials.length };
    doctorTestimonials.forEach((item) => {
      newRating[parseInt(item.stars)] += 1;
    });
    setRating(newRating);
  }, [docInfo]);

  const getAvailableSlot = async () => {
    if (!docInfo || !docInfo.slot_booked) return;

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

      let timeSlot = [];
      while (currentDate < endTime) {
        let formattedtime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = `${day}/${month}/${year}`;
        const slotTime = formattedtime;

        const isSlotAvailable =
          docInfo.slot_booked[slotDate] && docInfo.slot_booked[slotDate].includes(slotTime) 
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlot.push({
            datetime: new Date(currentDate),
            time: formattedtime,
          });
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlot(prev => [...prev, timeSlot]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment');
      return navigate('/login');
    }

    try {
      const date = docSlot[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = day + "/" + month + "/" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [docId, doctors]);

  useEffect(() => {
    getAvailableSlot();
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
          <div className='flex flex-col sm:flex-row gap-8'>
            <div className='flex-1'>
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
                  <span className='text-gray-800'> {currencySymbol}{docInfo.fees}</span>
                </p>
              </div>
            </div>

            {/* Rating Component */}
            <div className="flex flex-col gap-3 w-full max-w-xs animate-fadeIn">
  {/* Rating header with pulse animation */}
  <div className="flex items-center gap-2">
    <p className="text-3xl font-bold animate-pulse">{docInfo.total_rate }</p>
    <svg 
      className="w-6 h-6 text-yellow-400 animate-bounce" 
      fill="currentColor" 
      viewBox="0 0 20 20"
      style={{ animationDelay: '0.2s' }}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
    <p className="text-sm text-gray-500 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
      {rating.total.toLocaleString() || '1,39,751'} Ratings & {doctorTestimonials.length.toLocaleString() || '14,225'} Reviews
    </p>
  </div>

  {/* Rating breakdown with staggered animations */}
  <div className="grid grid-cols-6 gap-2 items-center w-full">
    {[
      { star: 5, starColor: 'text-green-600', barColor: 'bg-green-600' },
      { star: 4, starColor: 'text-green-500', barColor: 'bg-green-500' },
      { star: 3, starColor: 'text-green-400', barColor: 'bg-green-400' },
      { star: 2, starColor: 'text-orange-400', barColor: 'bg-orange-400' },
      { star: 1, starColor: 'text-red-500', barColor: 'bg-red-500' }
    ].map(({ star, starColor, barColor }, index) => {
      const percentage = rating.total > 0 ? (rating[star] / rating.total) * 100 : 0;
      const delay = 0.4 + (index * 0.1);

      return (
        <React.Fragment key={star}>
          <div 
            className="flex items-center gap-1 col-span-1 animate-fadeIn"
            style={{ animationDelay: `${delay}s` }}
          >
            <span className="text-sm">{star}</span>
            <svg className={`w-4 h-4 ${starColor}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="col-span-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            {percentage > 0 && (
              <div
                className={`h-full rounded-full ${barColor} animate-growWidth`}
                style={{ 
                  width: `${percentage}%`,
                  animationDelay: `${delay + 0.05}s`
                }}
              />
            )}
          </div>
          <span 
            className="text-sm text-gray-500 text-right animate-fadeIn"
            style={{ animationDelay: `${delay + 0.1}s` }}
          >
            {rating[star]?.toLocaleString() || [
              '78,677',
              '34,520',
              '12,410',
              '4,816',
              '9,328'
            ][5 - star]}
          </span>
        </React.Fragment>
      );
    })}
  </div>
</div>
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
              <p>{item[0] && Days[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Displaying Time Slots */}
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlot.length && docSlot[slotIndex].map((item, index) => (
            <p
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'bg-gray-100 border border-gray-300'}`}
              key={index}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button
          onClick={bookAppointment}
          className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'
        >
          Book an appointment
        </button>
      </div>

      {/* Testimonials Section */}
      <TestimonialCarousel testimonials={doctorTestimonials} />

      {/* Related Doctors */}
      <RelatedDoctor docId={docId} speciality={docInfo.speciality} />
    </div>
  );
}

export default Appointment;