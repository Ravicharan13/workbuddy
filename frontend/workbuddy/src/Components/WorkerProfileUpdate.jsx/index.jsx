import React, { useState, useEffect } from "react";

const SERVICE_OPTIONS = ["Plumbing", "Electrician", "Carpentry", "Painting", "Cleaning"];

const WorkerProfileUpdate = () => {
  const [formData, setFormData] = useState({
    services: [],
    phone: "",
    location: "",
    skills: []
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWorkerProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/worker/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setFormData({
            services: data.services || [],
            phone: data.phone || "",
            location: data.location || "",
            skills: data.skills || []
          });
        } else {
          alert(`❌ ${data.message}`);
        }
      } catch (error) {
        alert("❌ Failed to load profile");
      }
    };

    fetchWorkerProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      services: checked
        ? [...prev.services, value]
        : prev.services.filter((s) => s !== value)
    }));
  };

  const handleSkillsChange = (e) => {
    const { value } = e.target;
    const skillsArray = value.split(",").map((s) => s.trim());
    setFormData(prev => ({ ...prev, skills: skillsArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/worker/profileupdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Worker profile updated successfully!");
      } else {
        alert(`❌ ${data.message || "Update failed"}`);
      }
    } catch (error) {
      alert("❌ Server error");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">Update Worker Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Phone */}
        <Input name="phone" label="Phone Number" value={formData.phone} onChange={handleChange} />

        {/* Location */}
        <Input name="location" label="Location" value={formData.location} onChange={handleChange} />

        {/* Skills */}
        <Input
          name="skills"
          label="Skills (comma separated)"
          value={formData.skills.join(", ")}
          onChange={handleSkillsChange}
        />

        {/* Services */}
        <div className="text-left">
          <label className="block mb-2 text-sm font-medium text-gray-700">Select Services</label>
          <div className="grid grid-cols-2 gap-2">
            {SERVICE_OPTIONS.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.services.includes(option)}
                  onChange={handleServiceChange}
                  className="accent-gray-700"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Update Profile
        </button>
      </form>
    </div>
  );
};

const Input = ({ name, label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
      required
    />
  </div>
);

export default WorkerProfileUpdate;
