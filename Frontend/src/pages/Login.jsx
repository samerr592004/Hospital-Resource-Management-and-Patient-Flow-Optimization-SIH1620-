import React, { useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { token, setToken, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [redirecting, setRedirecting] = useState(false); // State to handle transition before navigation

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, password, email });

        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Sign up successful!");

          // Smooth transition before redirecting
          setRedirecting(true);
          setTimeout(() => navigate('/'), 600);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { password, email });

        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Login successful!");

          // Smooth transition before redirecting
          setRedirecting(true);
          setTimeout(() => navigate('/'), 600);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <AnimatePresence>
      {!redirecting && (
        <motion.form
          className="min-h-[80vh] flex items-center"
          onSubmit={onSubmitHandler}
          initial={{ opacity: 0, x: 100 }} // Initial animation (slide in from right)
          animate={{ opacity: 1, x: 0 }} // Animate to normal position
          exit={{ opacity: 0, x: -100 }} // Exit animation (slide out to left)
          transition={{ duration: 0.6, ease: "easeInOut" }} // Smooth transition
        >
          <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
            <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
            <p>Please {state === 'Sign Up' ? 'sign up' : 'login'} to book an appointment</p>

            {state === "Sign Up" && (
              <div className='w-full'>
                <p>Full Name</p>
                <input
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>
            )}

            <div className='w-full'>
              <p>Email</p>
              <input
                className='border border-zinc-300 rounded w-full p-2 mt-1'
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <div className='flex w-full relative flex-col'>
              <label className='mb-1 text-sm text-gray-600'>Password</label>
              <div className="relative w-full">
                <input
                  className='border border-zinc-300 rounded w-full p-2 pr-10'
                  type={showPassword ? "text" : "password"}
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

            <button type='submit' className='bg-primary text-white rounded-md w-full p-2 mt-1 text-base'>
              {state === 'Sign Up' ? 'Create Account' : 'Login'}
            </button>

            {state === "Sign Up" ? (
              <p>Already have an account?
                <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'> Login here</span>
              </p>
            ) : (
              <p>Create a new account?
                <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'> Click here</span>
              </p>
            )}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
};

export default Login;
