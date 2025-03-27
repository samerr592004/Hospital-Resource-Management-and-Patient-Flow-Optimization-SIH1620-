import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Copy, Check } from "lucide-react"; // Icons for copy functionality
import { motion, AnimatePresence } from "framer-motion"; // Animations

// Component to update map center dynamically
const ChangeMapCenter = ({ position }) => {
  const map = useMap();
  map.setView(position, 10);
  return null;
};

const SearchableMap = () => {
  const [position, setPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [noResults, setNoResults] = useState(false); // Track if no results are found

  // Fetch search results when input changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsLocationSelected(false);
      setNoResults(false);
      return;
    }

    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${searchQuery}`
        );

        if (response.data.length === 0) {
          setSearchResults([]);
          setNoResults(true); // Show "No results found" message
        } else {
          setSearchResults(response.data);
          setNoResults(false);
        }
      } catch (error) {
        toast.error("Failed to fetch location. Check your internet connection.");
      }
    };

    fetchLocations();
  }, [searchQuery]);

  const selectLocation = (place) => {
    const latNum = parseFloat(place.lat);
    const lonNum = parseFloat(place.lon);

    setPosition([latNum, lonNum]);
    setLatitude(latNum.toFixed(6));
    setLongitude(lonNum.toFixed(6));
    setFullAddress(place.display_name);
    
    const extractedZipCode = place.address?.postcode ?? "N/A";
    setZipCode(extractedZipCode);

    setSearchResults([]);
    setSearchQuery(place.display_name);
    setIsLocationSelected(true);
    setNoResults(false);
  };

  const copyToClipboard = (value, field) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success(`${field} copied!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="p-5 w-full">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      {/* Search Box */}
      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsLocationSelected(false);
            setNoResults(false);
          }}
          placeholder="Search for a location..."
          className="border px-3 py-2 rounded-full w-[50%]"
        />

        {/* Animated Search Results Dropdown */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 border rounded mt-2 bg-white z-50 shadow-lg max-h-40 overflow-y-auto"
            >
              {searchResults.map((place) => (
                <li
                  key={place.place_id}
                  onClick={() => selectLocation(place)}
                  className="cursor-pointer p-2 hover:bg-gray-200 transition duration-200"
                >
                  {place.display_name}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* No Results Found Message with External Link */}
        {noResults && (
          <div className="mt-2 text-red-600">
            No results found. Try using{" "}
            <a
              href="https://www.gps-coordinates.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              GPS Coordinates
            </a>
          </div>
        )}
      </div>

      {/* Show map only if a location is selected */}
      <AnimatePresence>
        {isLocationSelected && position && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {/* Map */}
            <MapContainer center={position} zoom={5} style={{ height: "300px", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ChangeMapCenter position={position} />
              <Marker position={position}>
                <Popup>Latitude: {latitude}, Longitude: {longitude}</Popup>
              </Marker>
            </MapContainer>

            {/* Fields with Copy Functionality */}
            <div className="mt-4 flex gap-4 flex-wrap">
              {[
                { label: "Latitude", value: latitude },
                { label: "Longitude", value: longitude },
                { label: "Full Address", value: fullAddress },
                { label: "Zip Code", value: zipCode }
              ].map(({ label, value }) => (
                <div className="flex-1 relative w-[48%]" key={label}>
                  <p>{label}:</p>
                  <input type="text" value={value} readOnly className="border px-3 py-2 w-full rounded" />
                  <button onClick={() => copyToClipboard(value, label)} className="absolute right-2 top-9 text-gray-500 hover:text-gray-700">
                    {copiedField === label ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchableMap;
