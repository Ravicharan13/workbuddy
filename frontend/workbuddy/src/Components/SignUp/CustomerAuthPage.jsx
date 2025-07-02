import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import worker from "../../Assests/worker.png"
import axios from "axios";
import { toast } from "react-toastify";

const CustomerAuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const mode = params.get("mode");

  const [isSignup, setIsSignup] = useState(mode !== "login");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    setIsSignup(mode !== "login");
    setStep(1);
  }, [mode]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
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
    const response = await axios.post("http://localhost:5000/api/auth/customer/register", signupData, {
      headers: { "Content-Type": "application/json" },
    });

    toast.dismiss();
    toast.success("Registration successful!");

    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      confirmPassword: ""
    });
    console.log(response)

    setStep(1);
    setIsSignup(false);
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
    const response = await axios.post("http://localhost:5000/api/auth/customer/login", loginData, {
      headers: { "Content-Type": "application/json" },
    });

    toast.dismiss();
    toast.success("Login successful!");

    const data = response.data;
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("username", data.username);
    navigate("/worker/home")
    // Optional: navigate to dashboard
    // navigate("/customer/dashboard");

  } catch (error) {
    toast.dismiss();
    toast.error(error.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="min-h-screen md:min-h-0 md:h-[60vh] lg:h-[90vh] flex items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="w-full h-[90%] max-w-6xl bg-white dark:bg-gray-800 dark:rounded-sm shadow-sm dark:shadow-slate-700 flex flex-col md:flex-row overflow-hidden">

        {/* Left - Worker Options */}
        <div className="w-full md:w-2/3 bg-gray-800 dark:bg-gray-900 flex flex-col items-center justify-center p-8 space-y-2">
          <img src={worker} alt="" className="w-32 h-32 bg-gray-300 rounded-sm" />
          <h3 className="text-xl font-semibold text-white">Worker</h3>
          <Link
            to="/workerauth?mode=login"
            className="w-[24%] bg-gray-600 text-white py-2 rounded-sm hover:bg-gray-700 text-center text-xs font-semibold"
          >
            Login
          </Link>
          <p className="text-white">Or</p>
          <Link
            to="/workerauth?mode=signup"
            className="w-[24%] bg-white text-gray-800 py-2 rounded-sm hover:bg-gray-100 text-center text-xs font-semibold"
          >
            Register
          </Link>
        </div>

        {/* Right - Form Section */}
        <div className="w-full h-full md:w-2/3 px-10 py-6 bg-white dark:bg-gray-800">
          <div className="flex space-x-6 border-b dark:border-gray-500 mb-4">
            <button
              className={`pb-2 font-semibold text-sm ${isSignup ? "border-b-2 border-gray-800 dark:text-white text-gray-800" : "text-gray-600 dark:text-gray-400"}`}
              onClick={() => {
                setIsSignup(true);
                setStep(1);
              }}
            >
              SIGN UP
            </button>
            <button
              className={`pb-2 font-semibold text-sm ${!isSignup ? "border-b-2 border-gray-800  text-gray-800 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
              onClick={() => setIsSignup(false)}
            >
              LOGIN
            </button>
          </div>

          {isSignup ? (
            <>
              <h2 className="mb-4">
                <span className="block text-xl font-bold text-gray-900 dark:text-gray-50">Customer Registration</span>
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
                        className="w-full border-0 border-b-2 dark:text-gray-50 border-gray-100 dark:border-gray-700  dark:bg-gray-800 dark:focus:border-gray-500 focus:outline-none focus:border-gray-600 px-1 py-2"
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
                        className="w-full border-0 border-b-2 dark:text-gray-50 border-gray-100 dark:border-gray-700  dark:bg-gray-800 dark:focus:border-gray-600 focus:outline-none focus:border-gray-600 px-1 py-2"
                        type="text"
                        placeholder="First name"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 font-semibold dark:text-gray-50" >Last Name*</label>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border-0 border-b-2 dark:text-gray-50 dark:border-gray-700  dark:bg-gray-800 dark:focus:border-gray-500 border-gray-100 focus:outline-none focus:border-gray-600 px-1 py-2"
                        type="text"
                        placeholder="Last name"
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
                      className="w-full border-0 border-b-2 dark:text-gray-50 dark:border-gray-700  dark:bg-gray-800 dark:focus:border-gray-500 border-gray-100 focus:outline-none focus:border-gray-600 px-1 py-2"
                      type="text"
                      placeholder="Choose a username"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-semibold dark:text-gray-50">Password*</label>
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full border-0 border-b-2 dark:text-gray-50 dark:border-gray-700  dark:bg-gray-800 dark:focus:border-gray-500 border-gray-100 focus:outline-none focus:border-gray-600 px-1 py-2"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-semibold dark:text-gray-50">Confirm Password*</label>
                    <input
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full border-0 border-b-2 dark:text-gray-50 dark:border-gray-700  dark:bg-gray-800 dark:focus:border-gray-500 border-gray-100 focus:outline-none focus:border-gray-600 px-1 py-2"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat password"
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
                      className="w-[28%] bg-gray-400 duration-300 dark:bg-gray-700 dark:hover:bg-gray-400 text-white py-1 rounded-sm hover:bg-gray-400"
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
          ) : (
            <>
              <h1 className="text-xl font-bold mb-2 dark:text-gray-50">Customer Login</h1>
              <h2 className="text-base font-medium mb-1 dark:text-gray-50">Welcome Back!</h2>
              <p className="text-xs text-gray-500 mb-4">
                Log in and explore available services tailored for you.
              </p>

              <form onSubmit={handleLogin} className="space-y-4 text-sm">
                <div>
                  <label htmlFor="email" className="block text-gray-600 mb-1 dark:text-gray-50 font-semibold">Email*</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-0 border-b-2 dark:text-gray-50 border-gray-100 dark:border-gray-700  dark:bg-gray-800 dark:focus:border-gray-500 focus:outline-none focus:border-gray-600 px-1 py-2"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-gray-600 mb-1 dark:text-gray-50 font-semibold">Password*</label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-0 border-b-2 dark:text-gray-50 border-gray-100 dark:border-gray-700  dark:bg-gray-800 dark:focus:border-gray-500 focus:outline-none focus:border-gray-600 px-1 py-2"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 dark:text-gray-50">
                  <input
                    id="showPassword"
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="accent-blue-600 "
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
                    Forgot{' '}
                    <Link to={"/customer/forgot-password"} className="text-gray-600 cursor-pointer underline">
                      Password?
                    </Link>
                  </p>
                  <p className="text-center dark:text-gray-50">
                    Don't have an account?{' '}
                    <span
                      className="text-gray-600 cursor-pointer underline"
                      onClick={() => setIsSignup(true)}
                    >
                      Register now
                    </span>
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerAuthPage;