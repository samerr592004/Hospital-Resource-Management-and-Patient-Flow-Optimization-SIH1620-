import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Circle, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AppContext } from "../context/AppContext";

// Component to recenter the map
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

// Component to fit bounds
const FitBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
};

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance.toFixed(2);
};

const HospitalListWithMap = () => {
  const { hospitals } = useContext(AppContext);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [distances, setDistances] = useState({});
  const [bounds, setBounds] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setIsLoading(false); // Stop loading once location is fetched
        },
        (error) => {
          console.error("Error fetching user location:", error);
          setIsLoading(false); // Stop loading even if there's an error
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false); // Stop loading if geolocation is not supported
    }
  }, []);

  // Calculate distances to hospitals whenever userLocation changes
  useEffect(() => {
    if (!isLoading && userLocation) {
      const newDistances = {};
      hospitals.forEach((hospital) => {
        const distance = calculateDistance(
          userLocation[0],
          userLocation[1],
          hospital.latitude,
          hospital.longitude
        );
        newDistances[hospital._id] = distance;
      });
      setDistances(newDistances);
    }
  }, [userLocation, isLoading, hospitals]);

  // Fetch route to a hospital
  const fetchRoute = async (hospital) => {
    if (!userLocation || !hospital) return;
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${hospital.longitude},${hospital.latitude}?geometries=geojson`;
    try {
      const response = await fetch(osrmUrl);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const coordinates = data.routes[0].geometry.coordinates.map((coord) => [coord[1], coord[0]]);
        setRoute(coordinates);
        const bounds = L.latLngBounds([userLocation, [hospital.latitude, hospital.longitude]]);
        setBounds(bounds);
      } else {
        console.error("No routes found for hospital:", hospital.name);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  // Handle hospital selection
  const handleHospitalClick = (hospital) => {
    setSelectedHospital(hospital);
    setRoute([]);
  };

  // Handle "Show Route" button click
  const handleShowRoute = (hospital) => {
    fetchRoute(hospital);
  };

  return (
    <div>
      <div className="flex flex-col items-center text-center my-6">
        <h1 className="text-3xl font-medium text-primary">All Hospital</h1>
        <p className="w-full md:w-1/3 text-sm">Simply browse through our extensive list of hospitals.</p>
      </div>


      <div className="flex flex-col lg:flex-row h-[70vh]">

        {/* Hospital List */}
        <div className="w-full lg:w-1/2 bg-white  overflow-auto max-h-[50vh] lg:max-h-full">
          <ul>
            {hospitals.map((hospital) => (
              <li
                key={hospital._id}
                className="p-4 m-4 bg-gray-200 flex flex-col lg:flex-row items-center gap-4 border-b cursor-pointer transition-all duration-300 transform hover:shadow-md hover:scale-105 hover:bg-gray-200 justify-between rounded-lg"
                onClick={() => handleHospitalClick(hospital)}
              >
                {/* Image */}
                <img src={hospital.image} alt={hospital.name} className="w-46 h-36 rounded-md" />

                {/* Details */}
                <div className="flex-1">
                  <p className="text-lg font-semibold">{hospital.name}</p>
                  <p className="text-sm text-red-500">📍 {hospital.address}</p>
                  <p className="text-sm text-gray-600">Constructed: {hospital.constructed}</p>
                  <p className="text-sm text-green-600">📧 {hospital.contact?.email}</p>
                  <p className="text-sm text-purple-600">📞 {hospital.contact?.phone}</p>
                  {distances[hospital._id] && (
                    <p className="text-sm text-blue-600">Distance: {distances[hospital._id]} km</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/hospital/${hospital._id}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                  >
                    Visit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowRoute(hospital);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                  >
                    Route
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Map */}
        <div className="sm:5 w-full lg:w-1/2 h-[50vh] lg:h-full relative z-0 pt-4 lg:pt-0">
          {userLocation && (
            <MapContainer center={userLocation} zoom={13} style={{ width: "100%", height: "100%" }} zoomControl={true}>
              <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors, Tiles courtesy of HOT' />

              {/* User Location Marker */}
              <Circle center={userLocation} radius={100} color="red" fillColor="red" fillOpacity={0.2}>
                <Popup>Your Location</Popup>
              </Circle>

              {/* Selected Hospital Marker */}
              {selectedHospital && (
                <>
                  <Circle
                    center={[selectedHospital.latitude, selectedHospital.longitude]}
                    radius={100}
                    color="blue"
                    fillColor="blue"
                    fillOpacity={0.2}
                  >
                    <Popup>{selectedHospital.name}</Popup>
                  </Circle>
                  <RecenterMap center={[selectedHospital.latitude, selectedHospital.longitude]} />
                </>
              )}

              {/* Route Polyline */}
              {route.length > 0 && <Polyline positions={route} color="blue" weight={4} opacity={0.8} />}

              {/* Fit bounds */}
              {bounds && <FitBounds bounds={bounds} />}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalListWithMap;