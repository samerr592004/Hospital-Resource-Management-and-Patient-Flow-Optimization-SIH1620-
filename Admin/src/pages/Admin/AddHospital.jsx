import React, { useState, useContext } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../contexts/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import ImageCropper from "../../components/ImageCropper";
 // Import ImageCropper

function AddHospital() {
  const [hospitalImg, setHospitalImg] = useState(null);
  const [croppedImg, setCroppedImg] = useState(null);
  const [cropperOpen, setCropperOpen] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [about, setAbout] = useState("");
  const [constructed, setConstructed] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!croppedImg) {
      return toast.error("Please upload a hospital image");
    }

    try {
      const formData = new FormData();
      formData.append("image", croppedImg);
      formData.append("name", name);
      formData.append("address", address);
      formData.append("latitude", parseFloat(latitude));
      formData.append("longitude", parseFloat(longitude));
      formData.append("state", state);
      formData.append("district", district);
      formData.append("city", city);
      formData.append("about", about);
      formData.append("constructed", Number(constructed));
      formData.append("zipcode", zipcode);
      formData.append("bedNumber", Number(bedNumber));
      formData.append("contact", JSON.stringify({ email, phone }));

      const { data } = await axios.post(`${backendUrl}/api/admin/add-hospital`, formData, {
        headers: { atoken: aToken },
      });

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong, please try again.");
    }
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHospitalImg(file);
      setCropperOpen(true); // Open the cropper
    }
  };

  // Handle Cropping Completion
  const handleCropComplete = (croppedBlob) => {
    setCroppedImg(croppedBlob);
    setCropperOpen(false);
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Hospital</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex flex-col items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="hospital-img">
            <img
              className="w-42 h-32 bg-gray-100 cursor-pointer object-cover"
              src={
                croppedImg ? URL.createObjectURL(croppedImg) :
                hospitalImg ? URL.createObjectURL(hospitalImg) :
                assets.upload_area
              }
              alt="Upload Hospital"
            />
          </label>
          <input onChange={handleImageChange} type="file" id="hospital-img" hidden />
          <p>Upload and crop hospital image</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <input onChange={(e) => setName(e.target.value)} value={name} className="border rounded px-3 py-2" type="text" placeholder="Hospital Name" required />
            <input onChange={(e) => setAddress(e.target.value)} value={address} className="border rounded px-3 py-2" type="text" placeholder="Full Address" required />
            <input onChange={(e) => setState(e.target.value)} value={state} className="border rounded px-3 py-2" type="text" placeholder="State" required />
            <input onChange={(e) => setDistrict(e.target.value)} value={district} className="border rounded px-3 py-2" type="text" placeholder="District" required />
            <input onChange={(e) => setCity(e.target.value)} value={city} className="border rounded px-3 py-2" type="text" placeholder="City" required />
            <input onChange={(e) => setZipcode(e.target.value)} value={zipcode} className="border rounded px-3 py-2" type="text" placeholder="Zip Code" required />
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <input onChange={(e) => setConstructed(e.target.value)} value={constructed} className="border rounded px-3 py-2" type="number" placeholder="Year" required />
            <input onChange={(e) => setLatitude(e.target.value)} value={latitude} className="border rounded px-3 py-2" type="number" step="any" placeholder="Latitude" required />
            <input onChange={(e) => setLongitude(e.target.value)} value={longitude} className="border rounded px-3 py-2" type="number" step="any" placeholder="Longitude" required />
            <input onChange={(e) => setEmail(e.target.value)} value={email} className="border rounded px-3 py-2" type="email" placeholder="Email" required />
            <input onChange={(e) => setPhone(e.target.value)} value={phone} className="border rounded px-3 py-2" type="text" placeholder="Phone Number" required />
            <input onChange={(e) => setBedNumber(e.target.value)} value={bedNumber} className="border rounded px-3 py-2" type="number" placeholder="Number of Beds" required />
          </div>
        </div>

        <textarea onChange={(e) => setAbout(e.target.value)} value={about} className="w-full px-4 pt-2 mt-3 border rounded" placeholder="Write about the hospital" rows={5} required />

        <button className="mt-3 bg-primary px-10 py-3 text-white rounded-full">Add Hospital</button>
      </div>

      {/* Image Cropper Popup */}
      {cropperOpen && (
        <ImageCropper
          image={hospitalImg}
          onCropComplete={handleCropComplete}
          onClose={() => setCropperOpen(false)}
          aspectRatio={16 / 9} 
        />
      )}
    </form>
  );
}

export default AddHospital;
