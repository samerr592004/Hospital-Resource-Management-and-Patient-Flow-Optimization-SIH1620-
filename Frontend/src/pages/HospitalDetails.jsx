import React, { useContext,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import HospitalListWithMap from "../components/HospitalListWithMap";
import { FaEnvelope, FaPhoneAlt , FaBed, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6"
import { GiHospital } from "react-icons/gi"

const HospitalDetails = () => {
  const { hospitals } = useContext(AppContext);
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);


  // Find hospital by ID
  const hospital = hospitals.find((hosp) => hosp._id === hospitalId);

  console.log("Hospital ID:", hospitalId);
  console.log("Matched Hospital:", hospital);
  console.log("All Hospitals:", hospitals);

  if (!hospital) {
    return <HospitalListWithMap />;
  }

  // Check if hospital.occupied exists, if not, set it to an empty object
  const occupiedBeds = hospital.bed_occupied ? Object.keys(hospital.bed_occupied).length : 0;
  const availableBeds = hospital.bedNumber - occupiedBeds;




  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8 items-start">
      {/* Left: Hospital Image */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <img
          className="w-full lg:w-4/5 h-72 object-cover rounded-lg shadow-md"
          src={hospital.image}
          alt={hospital.name}
        />
      </div>

      {/* Right: Hospital Details */}
      <div className="w-full lg:w-1/2 space-y-4">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <GiHospital className="text-red-500" /> {hospital.name}
        </h2>

        {/* About Section Directly Below Name */}
        <p className="text-gray-700">{hospital.about}</p>

        {/* Address with Map Marker Icon */}
        <p className="text-gray-600 flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-500" /> {hospital.address}, {hospital.city}, {hospital.district}, {hospital.state}, {hospital.zipcode}
        </p>

        <p className="text-sm flex items-center gap-2 text-gray-700">
          <FaCheckCircle className="text-blue-500" /> Established: {hospital.constructed}
        </p>

        <div className="space-y-2">
          <p className="flex items-center gap-2 text-green-600">
            <FaEnvelope className="text-green-500" /> Email: {hospital.contact?.email}
          </p>
          <p className="flex items-center gap-2 text-purple-600">
            <FaPhoneAlt  className="text-purple-500" /> Phone: {hospital.contact?.phone}
          </p>
          <p className="flex items-center gap-2 text-blue-600">
            <FaBed className="text-blue-500" /> Total Beds: {hospital.bedNumber}
          </p>
          <p className="flex items-center gap-2 text-green-600">
            <FaBed className="text-red-500" /> Available Beds: {availableBeds}
          </p>
        </div>

        {/* Buttons Section */}
        <div className="mt-4 flex gap-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
            onClick={() => navigate(`/hospital/${hospitalId}/beds-status`, {
              state: {
                bedNumber: hospital.bedNumber,
                bedOccupiedData: hospital.bed_occupied || {}
              }
            })}
          >
            <FaBed /> Check Beds
          </button>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            onClick={() => navigate(`/hospital/${hospitalId}/doctors`)}
          >
            <FaUserDoctor /> Visit Doctors
          </button>
        </div>
      </div>
    </div>
  );
};

export default HospitalDetails;
