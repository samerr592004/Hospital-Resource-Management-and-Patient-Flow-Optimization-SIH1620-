import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import About from './pages/About';
import Appointment from './pages/Appointment';
import Contact from './pages/Contant';
import Myappointment from './pages/Myappointment';
import Myprofile from './pages/Myprofile';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HospitalDetails from './pages/HospitalDetails';
import BedStatus from './pages/BedStatus';
import MyBeds from './pages/MyBeds';
import NotFoundPage from './pages/NotFoundPage';


const App = () => {
  return (
    <div className=''>
     <ToastContainer/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hospital/:hospitalId" element={<HospitalDetails />} />
        <Route path="/hospital" element={<HospitalDetails />} />
        <Route path="hospital/:hospitalId/doctors" element={<Doctors />} />
        <Route path="hospital/:hospitalId/doctors/:speciality" element={<Doctors />} />
        <Route path="hospital/:hospitalId/beds-status" element={<BedStatus />} />
        <Route path="doctors/:speciality" element={<Doctors />} />
        <Route path="doctors/" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<Myprofile />} />
        <Route path="/my-appointments" element={<Myappointment />} />
        <Route path="/my-beds" element={<MyBeds />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="hospital/:hospitalId/doctors/appointment/:docId" element={<Appointment />} />
        <Route path="*" element={<NotFoundPage />} />
        

      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
