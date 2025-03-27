import { useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useContext } from "react";
import { AdminContext } from "../../contexts/AdminContext";

const BedStatus = () => {
  const { hospitalId } = useParams();
  const location = useLocation();  // ✅ Fix: Define location
  const { hospitals, getAllHospitals } = useContext(AdminContext);
  const { bedNumber = 0 } = location.state || {};  // ✅ Fix: Provide default value for bedNumber
  const [bedOccupiedData, setBedOccupiedData] = useState(location.state?.bedOccupiedData || {});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBed, setSelectedBed] = useState(null);

  useEffect(() => {
    getAllHospitals();  // ✅ Fix: Ensure hospital data is updated

    if (hospitalId) {
      const hospital = hospitals.find(hosp => hosp._id === hospitalId);
      setBedOccupiedData(hospital?.bed_occupied || {});  // ✅ Fix: Ensure state updates when hospital data changes
    }
  }, [hospitals, hospitalId]);

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
        const { patientName, patientCondition, date } = bedData;
        const formattedDate = new Date(date).toLocaleDateString("en-GB");

        if (
          patientName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          patientCondition?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          formattedDate.includes(searchQuery)
        ) {
          return { bedId, bedData };
        }
      }

      return null;
    })
    .filter(Boolean);

  return (
    <div className="p-4 md:p-8 w-full">
      <h2 className="text-xl md:text-2xl font-bold text-center">Bed Status</h2>

      {/* ✅ Fix: Search input should be inside a wrapper */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by Bed Number, Name, Condition, or Date (dd/mm/yyyy)"
          className="w-full p-2 mb-4 border border-gray-300 rounded pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
        {searchQuery && (
          <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600" onClick={() => setSearchQuery("")}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      <p className="text-green-600 font-semibold text-base md:text-lg">Available Beds: {availableBeds}</p>
      <p className="text-red-600 font-semibold text-base md:text-lg">Occupied Beds: {occupiedBeds}</p>

      {/* ✅ Fix: Ensure proper grid layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4 justify-center mt-4 md:mt-6 h-[calc(100vh-200px)] overflow-y-auto">
        {filteredBeds.map(({ bedId, bedData }) => (
          <div
            key={bedId}
            className="flex flex-col items-center p-2 md:p-4 rounded-lg shadow-md bg-white w-full h-32 md:h-48 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => bedData && setSelectedBed(bedData)}
          >
            <FontAwesomeIcon icon={faBed} className={`text-4xl md:text-6xl ${bedData ? "text-red-500" : "text-green-500"}`} />
            <span className="text-base md:text-lg font-bold mt-1 md:mt-2">#{bedId}</span>
            {bedData ? (
              <div className="mt-1 md:mt-2 text-center">
                <p className="text-xs md:text-sm font-semibold">{bedData.patientName}</p>
                <p className="text-xs md:text-sm text-gray-600">{bedData.patientCondition}</p>
                <p className="text-xs md:text-sm text-gray-600">{bedData.date}</p>
              </div>
            ) : (
              <span className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">Available</span>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Fix: Proper Modal Implementation */}
      {selectedBed && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm relative">
            <button className="absolute top-2 right-2" onClick={() => setSelectedBed(null)}>
              <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
            </button>
            <h3 className="text-lg font-bold mb-2">Patient Details</h3>
            <p className="text-sm"><strong>Name:</strong> {selectedBed.patientName}</p>
            <p className="text-sm"><strong>Condition:</strong> {selectedBed.patientCondition}</p>
            <p className="text-sm"><strong>Admission Date:</strong> {selectedBed.date}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedStatus;
