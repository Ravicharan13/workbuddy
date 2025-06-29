import React, { useState } from "react";

const SERVICE_OPTIONS = ["Plumbing", "Electrician", "Carpentry", "Painting", "Cleaning"];

const SignUp = () => {
  const [isCustomer, setIsCustomer] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirmPassword: "",
    services: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedServices = checked
        ? [...prev.services, value]
        : prev.services.filter((s) => s !== value);
      return { ...prev, services: updatedServices };
    });
  };

  const handleNext = () => {
    if (!formData.email || !formData.password || (!isLogin && (!formData.firstname || !formData.lastname || !formData.confirmPassword))) {
      alert("❌ Fill all fields before continuing");
    } else if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("❌ Passwords do not match");
    } else {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : isCustomer
        ? "http://localhost:5000/api/auth/customer/register"
        : "http://localhost:5000/api/auth/register";

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : isCustomer
        ? {
            email: formData.email,
            firstname: formData.firstname,
            lastname: formData.lastname,
            username: formData.username,
            password: formData.password
          }
        : {
            email: formData.email,
            firstname: formData.firstname,
            lastname: formData.lastname,
            username: formData.username,
            password: formData.password,
            services: formData.services
          };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${isLogin ? "Login" : "Registration"} successful!`);
        setFormData({
          email: "",
          firstname: "",
          lastname: "",
          username: "",
          password: "",
          confirmPassword: "",
          services: []
        });
        setStep(1);
      } else {
        alert(`❌ ${data.message || "Something went wrong!"}`);
      }
    } catch (err) {
      alert("❌ Server error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 mb-12">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isLogin ? "Welcome Back" : "Register Now"}
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          {isLogin ? "Login to your account" : "Create an account to get started"}
        </p>

        {/* Toggle user type */}
        {!isLogin && (
          <div className="flex justify-between mb-6">
            <button
              type="button"
              onClick={() => setIsCustomer(true)}
              className={`w-1/2 py-2 rounded-l-md transition ${
                isCustomer ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setIsCustomer(false)}
              className={`w-1/2 py-2 rounded-r-md transition ${
                !isCustomer ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Worker
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <>
              <Input label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
              {!isLogin && (
                <>
                  <Input label="First Name" name="firstname" value={formData.firstname} onChange={handleChange} />
                  <Input label="Last Name" name="lastname" value={formData.lastname} onChange={handleChange} />
                </>
              )}
              <Input label="Password" name="password" value={formData.password} onChange={handleChange} type="password" />
              {!isLogin && (
                <Input label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" />
              )}
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-500"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {!isLogin && (
                <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
              )}
              {!isLogin && !isCustomer && (
                <div className="flex flex-col text-left">
                  <label className="mb-2 text-sm font-medium text-gray-700">Select Services</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SERVICE_OPTIONS.map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={formData.services.includes(option)}
                          onChange={handleServiceChange}
                          className="accent-gray-700"
                        />
                        <span className="text-sm text-gray-800">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-500"
              >
                {isLogin ? "Login" : `Register as ${isCustomer ? "Customer" : "Worker"}`}
              </button>
            </>
          )}
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button onClick={() => { setIsLogin(false); setStep(1); }} className="text-blue-600 underline">
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => { setIsLogin(true); setStep(1); }} className="text-blue-600 underline">
                Login here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col text-left">
    <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      required
      value={value}
      onChange={onChange}
      placeholder={`Enter your ${label.toLowerCase()}`}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
    />
  </div>
);

export default SignUp;
