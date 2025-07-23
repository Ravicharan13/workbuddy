import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import worker from "../../Assests/worker.png";
import axios from "axios";
import { toast } from "react-toastify";
import {useUser} from "../../context/UserContext"
import axiosInstance from "../../axiosInstance";
import { API_URL } from "../../constants/constant";

const CustomerAuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();
  const params = new URLSearchParams(location.search);
  const mode = params.get("mode");
  const [passwordErrors, setPasswordErrors] = useState([]);



  const [isSignup, setIsSignup] = useState(mode !== "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);


  // unify formData for both login and signup
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const validatePassword = (pwd) => {
  const errors = [];

  if (pwd.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(pwd)) errors.push("One uppercase letter (A-Z)");
  if (!/[a-z]/.test(pwd)) errors.push("One lowercase letter (a-z)");
  if (!/[0-9]/.test(pwd)) errors.push("One number (0-9)");
  if (!/[@$!%*?#&]/.test(pwd)) errors.push("One special character (@$!%*?#&)");

  return errors;
};


  useEffect(() => {
    setIsSignup(mode !== "signup");
    setStep(1);
  }, [mode]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNext = () => {
    if (formData.email && formData.firstName && formData.lastName) {
      setStep(2);
    } else {
      alert("Please fill in all fields before proceeding.");
    }
  };

const handleSignup = async () => {

  const { email, firstName, lastName, username, password, confirmPassword } = formData;

   if (validatePassword(password).length > 0) {
  toast.error("Password does not meet requirements.");
  return;
}

  if (!email || !firstName || !lastName || !username || !password || !confirmPassword) {
    toast.error("Please fill in all fields.");
    return;
  }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

  const signupData = {
    email,
    firstname: firstName,
    lastname: lastName,
    username,
    password,
  };

  try {
    toast.loading("Registering...");
    const response = await axios.post( `${API_URL}/auth/customer/register`, signupData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // if backend sets httpOnly cookies
    });

    toast.dismiss();
    toast.success("Registration successful!");

    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      confirmPassword: "",
    });

    setStep(1);
    setIsSignup(true);
  } catch (error) {
    toast.dismiss();
    toast.error(error.response?.data?.message || "Registration failed");
  }
};

const handleLogin = async (e) => {
  e.preventDefault();

  const loginData = { email, password };

  try {
    toast.loading("Logging in...");
    await axios.post(`${API_URL}/auth/customer/login`, loginData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // important if backend sets cookies
    });

    toast.dismiss();
    toast.success("Login successful!");

    const response = await axiosInstance.get("/auth/get-require-info", {
      withCredentials: true,
    });
    const data = response.data;
    data.isLogin = true;
    setUser(data)

    if(data.profileUpdateStatus) {
      navigate("/customer/home");
    } else {
      navigate("/customer/profile-update");
    }
 
    
  } catch (error) {
    toast.dismiss();
    toast.error(error.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="min-h-screen md:min-h-0 md:h-[60vh] lg:h-[90vh] flex items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="w-full h-[90%] max-w-6xl bg-white dark:bg-gray-800 dark:rounded-sm shadow-sm dark:shadow-slate-700 flex flex-col md:flex-row overflow-hidden">
        {/* Left - Worker Options */}
        <div className="w-full md:w-2/3  bg-gray-800 dark:bg-gray-900 flex flex-col items-center justify-center p-8 space-y-1">
          <img src={worker} alt="" className="w-24 h-24 bg-gray-300 rounded-sm" />
          <h3 className="text-base font-semibold text-gray-200 uppercase">Worker</h3>
          <br />
          <Link
            to="/workerauth?mode=login"
            className="text-gray-50 hover:text-gray-500 py-0 rounded-sm duration-300 text-center text-base underline underline-offset-4 decoration-gray-500 font-normal"
          >
            Login as Worker
          </Link>
          <p className="text-gray-50 py-1 pt-2">Or</p>
          <Link
            to="/workerauth?mode=signup"
            className="text-gray-50 hover:text-gray-500 py-0 rounded-sm duration-300 text-center text-base underline underline-offset-4 decoration-gray-500 font-normal"
          >
            Register as Worker
          </Link>
        </div>

        {/* Right - Form Section */}
        <div className="w-full h-full md:w-2/3 lg:w-[1000px] px-10 py-6  bg-white dark:bg-gray-800">
          <div className="flex space-x-6 border-b dark:border-gray-500 mb-4">
            <button
              className={`pb-2 font-semibold text-sm ${isSignup ? "border-b-2 border-gray-800 dark:text-white text-gray-800" : "text-gray-600 dark:text-gray-400"}`}
              onClick={() => navigate("?mode=login")}

            >
              LOGIN
            </button>
            <button
              className={`pb-2 font-semibold text-sm ${!isSignup ? "border-b-2 border-gray-800  text-gray-800 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
              onClick={() => navigate("?mode=signup")}

            >
              SIGN UP
            </button>
          </div>

          {isSignup ? (
            <>
              <h1 className="text-xl font-bold mb-2 uppercase dark:text-gray-50">Customer Login</h1>
              <h2 className="text-base font-medium mb-1 dark:text-gray-50">Welcome Back!</h2>
              <p className="text-xs text-gray-500 mb-4">
                Log in and explore available services tailored for you.
              </p>

              <form onSubmit={handleLogin} className="space-y-4 text-sm">
                <div>
                  <label htmlFor="email" className="block text-gray-600 mb-1 dark:text-gray-50 font-semibold">
                    Email*
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    placeholder="Enter your email address"
                    onChange={(e)=> setEmail(e.target.value)}
                    className="w-full border-0 border-b-2 dark:text-gray-50 border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-gray-500 focus:outline-none focus:border-gray-600 px-1 py-2 placeholder:text-sm placeholder:uppercase"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-gray-600 mb-1 dark:text-gray-50 font-semibold">
                    Password*
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e)=>setPassword(e.target.value)}
                    className="w-full border-0 border-b-2 dark:text-gray-50 border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-gray-500 focus:outline-none focus:border-gray-600 px-1 py-2 placeholder:text-sm placeholder:uppercase"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 dark:text-gray-50">
                  <input
                    id="showPassword"
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="accent-blue-600"
                  />
                  <label htmlFor="showPassword" className="text-gray-600 text-sm dark:text-gray-50">
                    Show Password
                  </label>
                </div>

                <div className="flex justify-center py-0">
                  <button
                    type="submit"
                    className="w-[58%] bg-gray-700 text-white py-2 rounded-sm hover:bg-gray-800 duration-300 dark:bg-gray-900 dark:hover:bg-gray-700"
                  >
                    Login
                  </button>
                </div>

                <div>
                  <p className="text-center pb-1 dark:text-gray-50">
                    Forgot{" "}
                    <Link to={"/customer/forgot-password"} className="text-gray-600 cursor-pointer underline">
                      Password?
                    </Link>
                  </p>
                  <p className="text-center dark:text-gray-50">
                    Don't have an account?{" "}
                    <span className="text-gray-600 cursor-pointer underline" onClick={() => setIsSignup(false)}>
                      Register now
                    </span>
                  </p>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="mb-4">
                <span className="block text-xl uppercase font-bold text-gray-900 dark:text-gray-50">
                  Customer Registration
                </span>
                <h2 className="text-base font-medium mt-1 dark:text-gray-50 text-gray-900">Get Started!</h2>
                <span className="block text-sm text-gray-500 mt-1">
                  Create your account and enjoy personalized services.
                </span>
              </h2>
              <form className="space-y-1 text-sm">
                {step === 1 && (
                  <>
                    <div>
                      <label className="block text-gray-600 font-semibold dark:text-gray-50">Email*</label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border-0 border-b-2 dark:text-gray-50 border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-gray-500 focus:outline-none focus:border-gray-600 px-1 py-2 placeholder:text-sm placeholder:uppercase"
                        type="email"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 font-semibold dark:text-gray-50">First Name*</label>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border-0 border-b-2 dark:text-gray-50 border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-gray-500 focus:outline-none focus:border-gray-600 px-1 py-2 placeholder:text-sm placeholder:uppercase"
                        type="text"
                        placeholder="Enter your First name"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 font-semibold dark:text-gray-50">Last Name*</label>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border-0 border-b-2 dark:text-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-gray-500 border-gray-100 focus:outline-none focus:border-gray-600 px-1 py-2 placeholder:text-sm placeholder:uppercase"
                        type="text"
                        placeholder="Enter your Last name"
                      />
                    </div>

                    <div className="flex justify-end py-2 pt-8 dark:text-gray-50">
                      <button
                        type="button"
                        className="w-[28%] bg-gray-700 duration-300 dark:bg-gray-900 dark:hover:bg-gray-700 text-white py-2 rounded-sm hover:bg-gray-800"
                        onClick={handleNext}
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div>
                      <label className="block text-gray-600 font-semibold dark:text-gray-50">Username*</label>
                      <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full border-0 border-b-2 dark:text-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-gray-500 border-gray-100 focus:outline-none focus:border-gray-600 px-1 py-2 placeholder:text-sm placeholder:uppercase"
                        type="text"
                        placeholder="Choose an username"
                      />
                    </div>

                  <div className="relative flex items-start">
                    <div className="w-full">
                      <label className="block text-gray-600 font-semibold dark:text-gray-50">Password*</label>
                      <input
                        name="password"
                        value={formData.password}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setTimeout(() => setPasswordFocused(false), 100)}
                        onChange={(e) => {
                          const newPwd = e.target.value;
                          setFormData((prev) => ({ ...prev, password: newPwd }));
                          const errors = validatePassword(newPwd);
                          setPasswordErrors(errors);
                        }}
                        className="w-full border-0 border-b-2 dark:text-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-gray-500 border-gray-100 focus:outline-none focus:border-gray-600 px-1 py-2 placeholder:text-sm placeholder:uppercase"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create your password"
                      />
                    </div>

                    {/* Floating card to the right */}
                    {passwordFocused && formData.password && passwordErrors.length > 0 && (
                      <div className="absolute top-14 left-0 md:top-14 md:left-0 lg:top-12 lg:right-56 ml-4 w-64 z-20 bg-white dark:bg-gray-900 shadow-lg rounded-sm border border-gray-200 dark:border-gray-700 p-3 text-xs text-gray-700 dark:text-gray-200">
                        <p className="font-semibold mb-2 text-sm text-gray-800 dark:text-white">Password must contain:</p>
                        <ul className="space-y-1">
                          {[
                            { label: "At least 8 characters", valid: formData.password.length >= 8 },
                            { label: "One uppercase letter (A-Z)", valid: /[A-Z]/.test(formData.password) },
                            { label: "One lowercase letter (a-z)", valid: /[a-z]/.test(formData.password) },
                            { label: "One number (0-9)", valid: /[0-9]/.test(formData.password) },
                            { label: "One special character (@$!%*?#&)", valid: /[@$!%*?#&]/.test(formData.password) },
                          ]
                            .filter((item) => !item.valid)
                            .map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-gray-500">
                                <span className="text-xl rounded-full bg-gray-500"></span>
                                {item.label}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>


                  <div>
                    <label className="block text-gray-600 font-semibold dark:text-gray-50">Confirm Password*</label>
                    <input
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full border-0 border-b-2 dark:text-gray-50 dark:border-gray-700  dark:bg-gray-800 dark:focus:border-gray-500 border-gray-100 focus:outline-none focus:border-gray-600 px-1 py-2 placeholder:text-sm placeholder:uppercase"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat your password"
                    />
                  </div>

                  <div className="flex items-center space-x-2 dark:text-gray-50 pt-2">
                    <input
                      id="showPasswordSignup"
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      className="accent-blue-600"
                    />
                    <label htmlFor="showPasswordSignup" className="text-gray-600 text-sm dark:text-gray-50">
                      Show Password
                    </label>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-[28%] bg-gray-500 duration-300 dark:bg-gray-700 dark:hover:bg-gray-400 text-white py-1 rounded-sm hover:bg-gray-400"
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={handleSignup}
                      className="w-[48%] bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700 text-white py-2 rounded-sm hover:bg-gray-800"
                    >
                      Sign Up
                    </button>
                  </div>

                  <p className="text-center pt-3 dark:text-gray-50">
                    Already have an account?{' '}
                    <span className="text-gray-600 cursor-pointer" onClick={() => setIsSignup(false)}>
                      Login now
                    </span>
                  </p>
                </>
              )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerAuthPage;
