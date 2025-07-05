import React, { useContext, useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import validator from 'validator';

const Login = () => {
  const { token, setToken, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [isOtp, setIsOtp] = useState();

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer effect for OTP
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      clearInterval(timerRef.current);
      setTimerActive(false);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timeLeft]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, password, email });
        if(data.success){
        handleAuthSuccess(data);

        }else{
          toast.warn(data.message)
          if (data.message.includes('User already exist')) {
            setState('Login');
          }}
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { password, email });
        handleAuthSuccess(data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleAuthSuccess = (data) => {
    if (data.success) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      toast.success(state === 'Sign Up' ? "Sign up successful!" : "Login successful!");
      setRedirecting(true);
      setTimeout(() => navigate('/'), 600);
    } else {
      toast.error(data.message);
    }
  };

  const handleForgotPassword = async () => {
    const { value: enteredEmail } = await Swal.fire({
      title: 'Reset Password',
      text: 'Please enter your email address to receive an OTP',
      input: 'email',
      inputPlaceholder: 'Your registered email',
      inputValue: email || '',
      showCancelButton: true,
      confirmButtonText: 'Send OTP',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) return 'You need to enter an email address!';
        if (!validator.isEmail(value)) return 'Please enter a valid email address';
      }
    });

    if (!enteredEmail) return;

    try {
      Swal.fire({
        title: 'Sending OTP',
        text: 'Please wait while we send the OTP to your email',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const { data } = await axios.post(`${backendUrl}/api/user/forgot-password`, { email: enteredEmail });
      Swal.close();

      if (data.success) {
        sessionStorage.removeItem('otpData');
        const otpData = {
          otp: data.otp,
          expiresAt: Date.now() + 600000
        };
        sessionStorage.setItem('otpData', JSON.stringify(otpData));
        setEmail(enteredEmail);
        showOtpAlert(enteredEmail);
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || "Failed to send OTP", 'error');
    }
  };

  const showOtpAlert = (enteredEmail) => {
    // Reset timer state
    setTimeLeft(60);
    setTimerActive(true);
  
    Swal.fire({
      title: 'Enter OTP',
      html: `
        <p class="mb-4">We've sent a 6-digit OTP to ${enteredEmail}</p>
        <input type="number" id="otp" class="swal2-input" 
               placeholder="Enter OTP" maxlength="6" 
               oninput="this.value=this.value.slice(0,6)"
               pattern="\\d{6}" inputmode="numeric">
        <p id="timer" class="mt-2 text-blue-500 font-medium">Time remaining: ${timeLeft} seconds</p>
        <p id="resend-link" class="mt-2 text-blue-500 font-medium hidden cursor-pointer hover:underline">
          Didn't receive OTP? Resend now
        </p>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Verify',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const enteredOtp = Swal.getPopup().querySelector('#otp').value;
        const otpNumber = parseInt(enteredOtp, 10);
        
        if (!enteredOtp || enteredOtp.length !== 6 || isNaN(otpNumber)) {
          Swal.showValidationMessage('Please enter a valid 6-digit OTP');
          return false;
        }
  
        const otpData = JSON.parse(sessionStorage.getItem('otpData'));
        
        if (!otpData || Date.now() > otpData.expiresAt) {
          Swal.showValidationMessage('OTP has expired. Please request a new one.');
          return false;
        }
  
        if (otpNumber !== otpData.otp) {
          Swal.showValidationMessage('Invalid OTP. Please try again.');
          return false;
        }
  
        return enteredOtp;
      },
      didOpen: () => {
        const timerElement = Swal.getPopup().querySelector('#timer');
        const resendLink = Swal.getPopup().querySelector('#resend-link');
        
        // Clear any existing interval
        if (timerRef.current) clearInterval(timerRef.current);
        
        // Start new interval
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            const newTime = prev - 1;
            
            // Update timer display
            if (timerElement) {
              timerElement.textContent = `Time remaining: ${newTime} seconds`;
            }
            
            // Handle timer expiration
            if (newTime <= 0) {
              clearInterval(timerRef.current);
              setTimerActive(false);
              timerElement.classList.add('hidden');
              resendLink.classList.remove('hidden');
            }
            
            return newTime;
          });
        }, 1000);
      },
      willClose: () => {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }).then((result) => {
      if (result.isConfirmed) {
        showPasswordResetDialog();
      }
    });
  
    // Add click handler for resend link
    Swal.getPopup().querySelector('#resend-link')?.addEventListener('click', () => {
      handleResendOtp(enteredEmail);
      Swal.close();
    });
  };
  
  const handleResendOtp = async (email) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/resend-otp`, { email });
      if (data.success) {
        sessionStorage.removeItem('otpData');
        const otpData = {
          otp: data.otp,
          expiresAt: Date.now() + 600000
        };
        sessionStorage.setItem('otpData', JSON.stringify(otpData));
        showOtpAlert(email); // Re-open the OTP dialog with new timer
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  const showPasswordResetDialog = () => {
    Swal.fire({
      title: 'Reset Your Password',
      html: `
        <input type="password" id="newPassword" class="swal2-input mb-3" 
               placeholder="New Password" required minlength="8">
        <input type="password" id="confirmPassword" class="swal2-input" 
               placeholder="Confirm Password" required minlength="8">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update Password',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const newPassword = Swal.getPopup().querySelector('#newPassword').value;
        const confirmPassword = Swal.getPopup().querySelector('#confirmPassword').value;
        
        if (!newPassword || !confirmPassword) {
          Swal.showValidationMessage('Both fields are required');
          return false;
        }
        
        if (newPassword.length < 8) {
          Swal.showValidationMessage('Password must be at least 8 characters');
          return false;
        }
        
        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('Passwords do not match');
          return false;
        }
        // console.log(email)
        
        return newPassword;
      }
    }).then(async (result) => {
      // console.log(email)
      if (result.isConfirmed) {
        try {
          const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, {
            email,
            newPassword: result.value
          });
          
          if (data.success) {
            Swal.fire('Success!', 'Your password has been updated successfully.', 'success');
            sessionStorage.removeItem('otpData');
          } else {
            Swal.fire('Error', data.message || 'Password update failed', 'error');
          }
        } catch (error) {
          Swal.fire('Error', error.response?.data?.message || 'Password update failed', 'error');
        }
      }
    });
  };

  

  return (
    <AnimatePresence>
      {!redirecting && (
        <motion.form
          className="min-h-[80vh] flex items-center justify-center p-4"
          onSubmit={onSubmitHandler}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className='flex flex-col gap-3 w-full max-w-md p-6 sm:p-8 border rounded-xl text-zinc-600 text-sm shadow-lg bg-white'>
            <p className='text-2xl font-semibold text-center'>
              {state === 'Sign Up' ? 'Create Account' : 'Login'}
            </p>
            <p className='text-center'>
              Please {state === 'Sign Up' ? 'sign up' : 'login'} to book an appointment
            </p>

            {state === "Sign Up" && (
              <div className='w-full'>
                <label className='block mb-1'>Full Name</label>
                <input
                  className='w-full p-2 border border-zinc-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>
            )}

            <div className='w-full'>
              <label className='block mb-1'>Email</label>
              <input
                className='w-full p-2 border border-zinc-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <div className='w-full relative'>
              <label className='block mb-1'>Password</label>
              <div className="relative">
                <input
                  className='w-full p-2 border border-zinc-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10'
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {state === 'Login' && (
              <p className="text-right w-full text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className='text-blue-600 hover:text-blue-800 underline focus:outline-none'
                >
                  Forgot Password?
                </button>
              </p>
            )}

            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200'
            >
              {state === 'Sign Up' ? 'Create Account' : 'Login'}
            </button>

            <p className="text-center text-sm">
              {state === "Sign Up" ? (
                <>Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setState('Login')}
                    className='text-blue-600 hover:text-blue-800 underline focus:outline-none'
                  >
                    Login here
                  </button>
                </>
              ) : (
                <>Create a new account?{' '}
                  <button
                    type="button"
                    onClick={() => setState('Sign Up')}
                    className='text-blue-600 hover:text-blue-800 underline focus:outline-none'
                  >
                    Click here
                  </button>
                </>
              )}
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
};

export default Login;