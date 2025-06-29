import React, { useState } from "react";

const SERVICE_OPTIONS = ["Plumbing", "Electrician", "Carpentry", "Painting", "Cleaning"];

const SignUp = () => {
  const [flag, setFlag] = useState(true); // true = customer, false = worker

  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    service: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedServices = checked
        ? [...prev.service, value]
        : prev.service.filter((s) => s !== value);
      return { ...prev, service: updatedServices };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = "http://localhost:5000/api/auth/register";

    const payload = flag
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
          service: formData.service
        };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Registration successful!");
        setFormData({
          email: "",
          firstname: "",
          lastname: "",
          username: "",
          password: "",
          service: []
        });
      } else {
        alert(`❌ ${data.message || "Something went wrong!"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Get Started</h1>
        <p className="text-gray-600 text-sm mb-6">
          Create your account to unlock opportunities
        </p>

        {/* Toggle Buttons */}
        <div className="flex justify-between mb-6">
          <button
            type="button"
            onClick={() => setFlag(true)}
            className={`w-1/2 py-2 rounded-l-md transition ${
              flag ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Customer SignUp
          </button>
          <button
            type="button"
            onClick={() => setFlag(false)}
            className={`w-1/2 py-2 rounded-r-md transition ${
              !flag ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Worker SignUp
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <Input label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />

          {/* First Name */}
          <Input label="First Name" name="firstname" value={formData.firstname} onChange={handleChange} />

          {/* Last Name */}
          <Input label="Last Name" name="lastname" value={formData.lastname} onChange={handleChange} />

          {/* Worker Service Selection */}
          {!flag && (
            <div className="flex flex-col text-left">
              <label className="mb-2 text-sm font-medium text-gray-700">Select Services</label>
              <div className="grid grid-cols-2 gap-2">
                {SERVICE_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded hover:bg-gray-200 transition"
                  >
                    <input
                      type="checkbox"
                      value={option}
                      checked={formData.service.includes(option)}
                      onChange={handleServiceChange}
                      className="accent-gray-700"
                    />
                    <span className="text-sm text-gray-800">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Username */}
          <Input label="Username" name="username" value={formData.username} onChange={handleChange} />

          {/* Password */}
          <Input label="Password" name="password" value={formData.password} onChange={handleChange} type="password" />

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition duration-200"
          >
            Register as {flag ? "Customer" : "Worker"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col text-left">
    <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
      {label}
    </label>
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
