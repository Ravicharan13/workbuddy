import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {Link,useNavigate} from "react-router-dom"
import { API_URL } from '../../constants/constant';


const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const inputsRef = useRef([]);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate =useNavigate();


  const validatePassword = (pwd) => {
  const errors = [];

  if (pwd.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(pwd)) errors.push("An uppercase letter (A-Z)");
  if (!/[a-z]/.test(pwd)) errors.push("A lowercase letter (a-z)");
  if (!/[0-9]/.test(pwd)) errors.push("A number (0-9)");
  if (!/[@$!%*?&]/.test(pwd)) errors.push("A special character (@$!%*?&)");

  return errors;
};

  const handleSendCode = async () => {
  if (!email) {
    toast.warning("Please enter your email");
    return;
  }

  const loadingToastId = toast.loading("Sending reset code...");

  try {
    const response = await axios.post(`${API_URL}/api/auth/worker/send-resetcode`, { email });
    
    toast.update(loadingToastId, {
      render: response.data.message || "Reset code sent to your email",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });

    setStep(2);
  } catch (error) {
    toast.update(loadingToastId, {
      render: error.response?.data?.message || "Failed to send reset code",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
};

  const handleVerifyCode = async () => {
  const fullCode = code.join('');
  if (fullCode.length !== 6 || code.includes("")) {
    toast.error("Please enter all 6 digits");
    return;
  }

  try {
    toast.loading("Verifing...")
    const response = await axios.post(`${API_URL}/api/auth/worker/verify-resetcode`, {
      email,
      code: fullCode
    });
    toast.dismiss();
    toast.success(response.data.message || "Code verified!");
    setStep(3);
  } catch (error) {
    toast.error(error.response?.data?.message || "Invalid or expired code");
  }
};

  const handleCodeChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updatedCode = [...code];
    updatedCode[index] = value;
    setCode(updatedCode);
    if (value && index < 5) inputsRef.current[index + 1].focus();
  };

  const handleResetPassword = async () => {
  if (!password || !confirmPassword) {
    toast.warning("Please enter both password fields");
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  // Password strength validation
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

  if (!strongPasswordRegex.test(password)) {
    toast.warning("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
    return;
  }

  try {
    toast.loading("Reseting password...")
    const response = await axios.post(`${API_URL}/auth/worker/reset-password`, {
      email,
      newPassword: password,
    });

    toast.success(response.data.message || "Password reset successful!");
    navigate("/workerauth?mode=login")
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to reset password");
  }
};


  return (
    <div className="h-[91vh]  md:h-[90vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-[80%] md:w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-sm ">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {step === 1 && 'Forgot your password?'}
            {step === 2 && 'Check your inbox'}
            {step === 3 && 'Reset password'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {step === 1 && 'Enter your email address to get a reset code.'}
            {step === 2 && 'We sent a 6-digit code to your email. Enter it below.'}
            {step === 3 && 'Set a new password for your account.'}
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-4 h-4 rounded-full ${step === s ? 'bg-gray-800 dark:bg-gray-900' : 'bg-gray-300 dark:bg-gray-600'}`}
            ></div>
          ))}
        </div>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-0 border-b-2 dark:text-gray-50 border-gray-100 dark:border-gray-700  dark:bg-gray-800 dark:focus:border-gray-500 focus:outline-none focus:border-gray-600 px-1 py-2"
            />
            <div className='flex justify-center pt-5'>
              <button
              onClick={handleSendCode}
              className="w-full  bg-gray-800 dark:bg-gray-900 hover:bg-gray-700 text-white font-medium py-2 rounded-sm duration-300 text-xs md:text-sm"
            >
              Send Reset Code
            </button>
            </div>
          </>
        )}

        {/* Step 2: Enter Code */}
        {step === 2 && (
          <>
            <div className="flex justify-between space-x-2 mb-6">
              {code.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(e.target.value, index)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        if (digit === "") {
                          if (index > 0) {
                            inputsRef.current[index - 1].focus();
                          }
                        }
                      } else if (e.key >= "0" && e.key <= "9") {
                        // Optional: allow typing over without selecting
                        setTimeout(() => {
                          if (index < code.length - 1) {
                            inputsRef.current[index + 1].focus();
                          }
                        }, 10);
                      }
                    }}
                    className="w-7 h-9 md:w-10 md:h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />

              ))}
            </div>
            <div className='flex justify-center'>
              <button
              onClick={handleVerifyCode}
              className="w-full bg-gray-800  hover:bg-gray-700 dark:bg-gray-900 text-white font-medium py-2 duration-300 rounded-sm text-xs md:text-sm"
            >
              Verify Code
            </button>
            </div>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
         <>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => {const pwd = e.target.value;
                      setPassword(pwd);
                      setPasswordErrors(validatePassword(pwd));}}
              className="w-full border-0 mb-3 border-b-2 dark:text-gray-50 border-gray-100 dark:border-gray-700  dark:bg-gray-800 dark:focus:border-gray-500 focus:outline-none focus:border-gray-600 px-1 py-2"
            />
            {password && passwordErrors.length > 0 && (
              <ul className="text-xs text-gray-600 mb-4 ml-1 list-disc pl-4">
                {passwordErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            )}


            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-0 border-b-2  dark:text-gray-50 border-gray-100 dark:border-gray-700  dark:bg-gray-800 dark:focus:border-gray-500 focus:outline-none focus:border-gray-600 px-1 py-2"
            />
            {confirmPassword && (
                  <p
                    className={`text-xs mt-1 ${
                      confirmPassword === password
                        ? 'text-gray-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {confirmPassword === password
                      ? 'Passwords match'
                      : 'Passwords do not match'}
                  </p>
                )}


            <div className="flex items-center space-x-2 mt-3 mb-4">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="accent-blue-600"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-600 dark:text-gray-50">
                Show Password
              </label>
            </div>

            <div className='flex justify-center pt-1'>
              <button
                  onClick={handleResetPassword}
                  disabled={passwordErrors.length > 0 || confirmPassword !== password}
                  className={`w-full bg-gray-800 dark:bg-gray-900 hover:bg-gray-700 text-white font-medium py-2 rounded-sm duration-300 text-xs md:text-sm ${
                    passwordErrors.length > 0 || confirmPassword !== password ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Reset Password
                </button>


            </div>
          </>

        )}

        {/* Footer Section */}
<div className="text-center mt-6">
  {step === 1 && (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Remember your password?{" "}
      <span
        className="text-gray-800 hover:underline cursor-pointer"
        onClick={() => {
          // TODO: replace this with navigate("/login") or a prop-based handler
          toast.info("Navigate back to login page.");
        }}
      >
        <Link to="/workerauth?mode=login">Back to Login</Link>
      </span>
    </p>
  )}

  {step === 2 && (
    <p className="text-xs text-gray-400 dark:text-gray-500">
      If you didn’t receive the code, check your spam folder.
    </p>
  )}
</div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
