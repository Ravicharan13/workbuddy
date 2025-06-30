import React, { useState, useEffect } from "react";

const CustomerProfileUpdate = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    address: ""
  });

  const token = localStorage.getItem("token"); // token saved after login

  useEffect(() => {
    // Optional: Fetch current customer profile
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/customer/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setFormData(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/customer/profileupdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Profile updated successfully!");
      } else {
        alert(`❌ ${data.message || "Update failed"}`);
      }
    } catch (error) {
      alert("❌ Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Update Customer Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="firstname" label="First Name" value={formData.firstname} onChange={handleChange} />
        <Input name="lastname" label="Last Name" value={formData.lastname} onChange={handleChange} />
        <Input name="phone" label="Phone" value={formData.phone} onChange={handleChange} />
        <Input name="address" label="Address" value={formData.address} onChange={handleChange} />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Update Profile</button>
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
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
      required
    />
  </div>
);

export default CustomerProfileUpdate;
