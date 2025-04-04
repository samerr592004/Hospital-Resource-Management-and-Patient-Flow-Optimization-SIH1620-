import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AdminContext } from '../contexts/AdminContext.jsx';
import { toast, ToastContainer } from 'react-toastify'; // ✅ Correct import
import 'react-toastify/dist/ReactToastify.css'; // ✅ Required CSS for Toastify
import { DoctorContext } from '../contexts/DoctorContext.jsx';

function Login() {
  const [state, setState] = useState('Admin');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Admin') {
       
        const response = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
       
        const { data } = response; 
        

        if (data.success) {
          localStorage.setItem('aToken', data.token);
          setAToken(data.token);
          toast.success(data.message, { position: "top-right" });
        } else {
          toast.error(data.message, { position: "top-right" });
        }
      }else{
        const {data} = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });
        if (data.success) {
          localStorage.setItem('dToken', data.token);
          setDToken(data.token);
          console.log(data.token)
          // toast.success(data.message, { position: "top-right" });
        } else {
          toast.error(data.message, { position: "top-right" });
        }

      }
      
    } catch (error) {
      

    }

  };

  return (
    <>
      {/* ✅ Toast container is required to display toasts */}
      <ToastContainer />

      <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
        <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
          <p className="text-2xl font-semibold m-auto">
            <span className="text-primary">{state}</span> Login
          </p>
          <div className="w-full">
            <p>Email:</p>
            <input
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="flex w-full relative flex-col">
            <label className="mb-1 text-sm text-gray-600">Password</label>
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                className="border border-zinc-300 rounded w-full p-2 pr-10"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-6 h-6 flex items-center justify-center">
                <motion.div
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="text-primary w-5 h-5" />
                </motion.div>
              </div>
            </div>
          </div>
          <button className="bg-primary text-white w-full py-2 rounded-md text-base" type="submit">
            Login
          </button>
          {state === 'Admin' ? (
            <p>
              Doctor Login?
              <span onClick={() => setState('Doctor')} className="text-primary underline cursor-pointer"> Click here</span>
            </p>
          ) : (
            <p>
              Admin Login?
              <span onClick={() => setState('Admin')} className="text-primary underline cursor-pointer"> Click here</span>
            </p>
          )}
        </div>
      </form>
    </>
  );
}

export default Login;
