import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../contexts/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ImageCropper from '../../components/ImageCropper';

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCropPopup, setShowCropPopup] = useState(false);

  const { backendUrl, aToken, hospitals, getAllHospitals,getAllDoctors } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllHospitals();
    }
  }, [aToken]);

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocImg(file); // Set the selected file
      setShowCropPopup(true); // Show the crop popup
    }
  };

  const handleCropComplete = (croppedImage) => {
    setDocImg(croppedImage); // Update the docImg state with the cropped image
    setShowCropPopup(false); // Close the crop popup
  };

  const handleCancelCrop = () => {
    // setDocImg(null); // Reset the docImg state
    setShowCropPopup(false); // Close the crop popup
  };

  const handleConfirmSubmit = async () => {
    try {
      if (!docImg) {
        return toast.error('Image Not Selected');
      }

      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));
      formData.append('hospital', selectedHospital);
       
      // console.log(selectedHospital)

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, { headers: { atoken: aToken } });
      if (data.success) {
        await getAllHospitals()
        await getAllDoctors()
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className='md:m-5  w-full'>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>
      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor='doc-img'>
            <img
              className='w-16 h-16 bg-gray-100 rounded-full cursor-pointer'
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=''
            />
          </label>
          <input onChange={onImageChange} type='file' id='doc-img' hidden />
          <p>Upload doctor picture</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
  {/* Left Section */}
  <div className="w-full lg:w-1/2 flex flex-col gap-4">
    {/* Doctor Name */}
    <div className="flex-1 flex flex-col gap-1">
      <p>Doctor Name</p>
      <input
        onChange={(e) => setName(e.target.value)}
        value={name}
        className="border rounded px-3 py-2"
        type="text"
        placeholder="Name"
        required
      />
    </div>

    {/* Doctor Email */}
    <div className="flex-1 flex flex-col gap-1">
      <p>Doctor Email</p>
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="border rounded px-3 py-2"
        type="email"
        placeholder="Email"
        required
      />
    </div>

    {/* Doctor Password */}
    <div className="flex-1 flex flex-col gap-1 relative">
      <p>Doctor Password</p>
      <div className="relative">
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="border rounded px-3 py-2 w-full pr-10"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
        />
        <motion.div
          whileTap={{ scale: 0.8 }}
          whileHover={{ rotate: 10 }}
          transition={{ duration: 0.2 }}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
        >
          <FontAwesomeIcon
            icon={showPassword ? faEye : faEyeSlash}
            className="text-gray-500 w-5 h-5"
          />
        </motion.div>
      </div>
    </div>

    {/* Experience */}
    <div className="flex-1 flex flex-col gap-1">
      <p>Experience</p>
      <select
        onChange={(e) => setExperience(e.target.value)}
        value={experience}
        className="border rounded px-3 py-2"
        required
      >
        {[...Array(10).keys()].map((year) => (
          <option key={year + 1} value={`${year + 1} Year`}>
            {year + 1} Year
          </option>
        ))}
      </select>
    </div>

    {/* Fees */}
    <div className="flex-1 flex flex-col gap-1">
      <p>Fees</p>
      <input
        onChange={(e) => setFees(e.target.value)}
        value={fees}
        className="border rounded px-3 py-2"
        type="number"
        placeholder="Fees"
        required
      />
    </div>
  </div>

  {/* Right Section */}
  <div className="w-full lg:w-1/2 flex flex-col gap-4">
    {/* Speciality */}
    <div className="flex-1 flex flex-col gap-1">
      <p>Speciality</p>
      <select
        onChange={(e) => setSpeciality(e.target.value)}
        value={speciality}
        className="border rounded px-3 py-2"
        required
      >
        {[
          "General physician",
          "Gynecologist",
          "Dermatologist",
          "Pediatricians",
          "Neurologist",
          "Gastroenterologist",
        ].map((spec) => (
          <option key={spec} value={spec}>
            {spec}
          </option>
        ))}
      </select>
    </div>

    {/* Education */}
    <div className="flex-1 flex flex-col gap-1">
      <p>Education</p>
      <input
        onChange={(e) => setDegree(e.target.value)}
        value={degree}
        className="border rounded px-3 py-2"
        type="text"
        placeholder="Education"
        required
      />
    </div>

    {/* Address */}
    <div className="flex-1 flex flex-col gap-1">
      <p>Address</p>
      <input
        onChange={(e) => setAddress1(e.target.value)}
        value={address1}
        className="border rounded px-3 py-2"
        type="text"
        placeholder="Address 1"
        required
      />
      <input
        onChange={(e) => setAddress2(e.target.value)}
        value={address2}
        className="border rounded px-3 py-2"
        type="text"
        placeholder="Address 2"
        required
      />
    </div>

    {/* Hospital */}
    <div className="flex-1 flex flex-col gap-1">
      <p>Hospital</p>
      <select
        onChange={(e) => setSelectedHospital(e.target.value)}
        value={selectedHospital}
        className="border rounded px-3 py-2"
        required
      >
        <option value="">Select Hospital</option>
        {hospitals.map((hospital) => (
          <option key={hospital._id} value={hospital._id}>
            {`${hospital.name}, ${hospital.city}, ${hospital.district}, ${hospital.state}`}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>


        <div>
          <p className='mt-4 mb-4'>About Doctor</p>
          <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='Write about doctor' rows={5} required />
        </div>

        <button onClick={handleConfirmSubmit} className='mt-3 bg-primary px-10 py-3 text-white rounded-full'>Add Doctor</button>
      </div>

      {/* Image Cropper Popup */}
      {showCropPopup && (
        <ImageCropper
          image={docImg}
          onCropComplete={handleCropComplete}
          onClose={handleCancelCrop} 
        />
      )}
    </form>
  );
};

export default AddDoctor;