import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../contexts/AdminContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const HospitalList = () => {
  const { aToken, hospitals, getAllHospitals, backendUrl } = useContext(AdminContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch hospitals on component mount
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        await getAllHospitals();
      } catch (error) {
        toast.error("Failed to fetch hospitals");
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, [aToken]);

  if (loading) {
    return <p className="text-center">Loading hospitals...</p>;
  }

  return (
    <div className="p-8 w-full">
      <h2 className="text-2xl font-bold mb-4">Hospitals</h2>
      <div className="space-y-6 w-full overflow-y-auto max-h-[calc(100vh-200px)]">
  {hospitals.length > 0 ? (
    hospitals.map((hospital) => (
      <div
        key={hospital._id}
        className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {/* Hospital Image (50% on larger screens, full width on mobile) */}
        <div className="w-full md:w-1/2 h-48 md:h-64">
          <img
            className="w-full h-full object-cover"
            src={hospital.image.startsWith("http") ? hospital.image : `${backendUrl}/${hospital.image}`}
            alt={hospital.name}
            onError={(e) => {
              e.target.src = assets.placeholder_image; // Fallback image
            }}
          />
        </div>

        {/* Hospital Details (50% on larger screens, full width on mobile) */}
        <div className="w-full md:w-1/2 p-4 bg-gray-50 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold">{hospital.name}</h3>
            {/* Combined Address, City, District, State, and Zipcode in one line */}
            <p className="text-gray-600 mt-2">
              <span className="font-semibold">Location:</span>{" "}
              {`${hospital.address}, ${hospital.city}, ${hospital.district}, ${hospital.state}, ${hospital.zipcode}`}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Constructed:</span> {hospital.constructed}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">About:</span> {hospital.about}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Contact:</span>{" "}
              {hospital.contact ? (
                <>
                  <p>Phone: {hospital.contact.phone}</p>
                  <p>Email: {hospital.contact.email}</p>
                </>
              ) : (
                "N/A"
              )}
            </p>
            <p className="text-blue-600 mt-2">
              <span className="font-semibold">Available Beds:</span>{" "}
              {hospital.bedNumber - Object.keys(hospital.bed_occupied || {}).length}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex gap-2">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex-1"
              onClick={() => navigate(`/hospital-list/${hospital._id}/beds`, {
                state: {
                  bedNumber: hospital.bedNumber,
                  bedOccupiedData: hospital.bed_occupied || {}
                }
              })}
            >
              Check Beds
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex-1"
              onClick={() => navigate(`/hospital-list/${hospital._id}/doctors`)}
              aria-label="View hospital details"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-500">No hospitals available</p>
  )}
</div>
    </div>
  );
};

export default HospitalList;