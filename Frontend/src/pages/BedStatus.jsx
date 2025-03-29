import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext ,useEffect} from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const BedStatus = () => {
  const { hospitalId } = useParams();  // Hospital ID from URL params (Note: check spelling)
  const location = useLocation();
  const { backendUrl, token, getHospitalData, hospitals ,userData,loadUserProfileData,getBeds} = useContext(AppContext);
  const navigate = useNavigate();

  const { bedNumber } = location.state || {};
  const [bedOccupiedData, setBedOccupiedData,beds] = useState(location.state?.bedOccupiedData || {});
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBedId, setSelectedBedId] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientCondition, setPatientCondition] = useState("");


  useEffect(() => {
    if (hospitalId) {
      const hospital = hospitals.find(hosp => hosp._id === hospitalId);
      setBedOccupiedData(hospital?.bed_occupied || {}); // Update state when hospitals data changes
    }
  }, [hospitals, hospitalId,beds]);
  


  const hospital = hospitals.find(hosp => hosp._id === hospitalId ) || {}
  const hospitalName = hospital?.name || "Unknown Hospital";
  const hospitalImage = hospital?.image || "https://via.placeholder.com/400";  // Fallback image

  if (!bedNumber) {
    return <p className="text-center">No bed data available</p>;
  }

  const occupiedBeds = Object.keys(bedOccupiedData).length;
  const availableBeds = bedNumber - occupiedBeds;

  const filteredBeds = Array.from({ length: bedNumber })
  .map((_, index) => {
    const bedId = (index + 1).toString();
    const bedData = bedOccupiedData[bedId] || null;

    if (!searchQuery) return { bedId, bedData };

    if (bedId === searchQuery) return { bedId, bedData };

    if (bedData) {
      const { date, patientCondition } = bedData;
      const formattedDate = date.split("/").reverse().join("-"); // Convert dd/mm/yyyy to yyyy-mm-dd for better searching

      if (
        (patientCondition && patientCondition.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (date && date.includes(searchQuery)) || 
        (formattedDate && formattedDate.includes(searchQuery))
      ) {
        return { bedId, bedData };
      }
    }

    return null;
  })
  .filter(Boolean);



  const clearSearch = () => setSearchQuery("");

  const handleBedClick = (bedData, bedId) => {
    if (!token) {
      toast.warn("Login to book a bed");
      return navigate("/login");
    } else {
      if (bedData) {
        toast.error("This bed is occupied. Cannot perform action.");
      } else {
        setSelectedBedId(bedId);
        setShowModal(true);
      }
    }
  };

  const saveDetails = async () => {
  if (!patientName || !patientCondition) {
    toast.error("Please enter patient details.");
    return;
  }

  try {
    const date = new Date().toLocaleDateString("en-GB");

    const {data} = await axios.post(
      backendUrl + "/api/user/book-bed",
      {
        key: hospitalId + selectedBedId,
        hospitalId,
        hospitalImage,
        hospitalName,
        bedId: selectedBedId,
        date,
        patientName,
        patientCondition,
      },
      { headers: { token } })

    if(data.success) {
      setShowModal(false)
      setPatientName("")
      setPatientCondition("")
      await Promise.all([
        loadUserProfileData(), 
        getHospitalData(),
      
      ])
      navigate("/my-beds")
     toast.success(data.message)
     
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};


  return (
    <div className="p-4 md:p-8 w-full">
      <h2 className="text-xl md:text-2xl font-bold text-center">Bed Status</h2>

      <div className="relative">
        <input
          type="text"
          placeholder="Search by Bed Number, Condition, or Date (dd/mm/yyyy)"
          className="w-full p-2 mb-4 border border-gray-300 rounded pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
        {searchQuery && (
          <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600" onClick={clearSearch}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      <p className="text-green-600 font-semibold text-base md:text-lg">
        Available Beds: {availableBeds}
      </p>
      <p className="text-red-600 font-semibold text-base md:text-lg">
        Occupied Beds: {occupiedBeds}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4 justify-center mt-4 md:mt-6 h-[calc(100vh-200px)] overflow-y-auto">
        {filteredBeds.map(({ bedId, bedData }) => (
          <div
            key={bedId}
            className="flex flex-col items-center p-2 md:p-4 rounded-lg shadow-md bg-white w-full h-32 md:h-48 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleBedClick(bedData, bedId)}
          >
            <FontAwesomeIcon icon={faBed} className={`text-4xl md:text-6xl ${bedData ? "text-red-500" : "text-green-500"}`} />
            <span className={`text-base md:text-lg font-bold mt-1 md:mt-2 ${bedData ? "text-red-500" : "text-green-500"}`}>#{bedId}</span>
            <span className={`text-xs md:text-sm md:mt-2 ${bedData ? "text-red-500" : "text-green-500"}`}>
              {bedData ? userData._id===bedData.userId?"Your Booking":"Occupied" : "Available"}
            </span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md relative">
            <button className="absolute top-2 right-2" onClick={() => setShowModal(false)}>
              <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
            </button>

            {/* Display Hospital Image Dynamically */}
            <img 
              src={hospitalImage}
              alt={hospitalName}
              className="w-full h-40 object-cover rounded-lg"
            />

            <h3 className="text-lg font-bold my-2 text-center">Confirm Bed Booking</h3>
            <p><strong>Hospital:</strong> {hospitalName}</p>
            <p><strong>Bed Number:</strong> #{selectedBedId}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString("en-GB")}</p>

            <input
              type="text"
              placeholder="Enter Patient Name"
              className="w-full p-2 mt-2 border rounded"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter Condition"
              className="w-full p-2 mt-2 border rounded"
              value={patientCondition}
              onChange={(e) => setPatientCondition(e.target.value)}
            />

            <button className="w-full bg-blue-600 text-white py-2 mt-4 rounded" onClick={saveDetails}>
              Book Bed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedStatus;
