import React, { useState, useEffect } from "react";
import { Edit, Mail, Phone, Moon, User } from "lucide-react";

export default function WorkerProfileUpdate() {
  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    services: [],
    skills: [],
    email: "",
    username: "",
  });

  const [newService, setNewService] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [acceptingRequests, setAcceptingRequests] = useState(true);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/worker/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setFormData({
            phone: data.phone || "",
            location: data.location || "",
            services: data.services || [],
            skills: data.skills || [],
            email: data.email || "",
            username: localStorage.getItem("username") || data.username || "",
          });
        } else {
          alert(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Server error");
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/profileupdate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile updated successfully");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Server error");
    }
  };

  const updateField = async (updatedData) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/profileupdate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating field:", err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-gray-100 p-0 m-0 w-full">
      <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Worker Profile</h1>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <Moon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Your current profile info is shown below. Update any field and click "Save Changes".
        </p>

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-500 rounded-full"></div>
            </div>
            <div className="flex-1 w-full space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4" />
                <span className="text-sm">{formData.username}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{formData.email}</span>
              </div>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="px-4 py-2 border rounded w-full text-sm"
              />
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="border px-3 py-1 rounded w-full text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services Offered */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4">Services Offered</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="e.g. Plumbing"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className="flex-1 px-4 py-2 border rounded"
            />
            <button
              type="button"
              onClick={async () => {
                if (newService.trim() && !formData.services.includes(newService.trim())) {
                  const updatedServices = [...formData.services, newService.trim()];
                  setFormData((prev) => ({ ...prev, services: updatedServices }));
                  setNewService("");
                  await updateField({ ...formData, services: updatedServices });
                }
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.services.map((s) => (
              <span
                key={s}
                className="bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full flex items-center text-sm shadow-sm"
              >
                {s}
                <button
                  onClick={() => {
                    const updatedServices = formData.services.filter((item) => item !== s);
                    setFormData((prev) => ({ ...prev, services: updatedServices }));
                    updateField({ ...formData, services: updatedServices });
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Technical Skills */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4">Technical Skills</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="e.g. Communication"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 px-4 py-2 border rounded"
            />
            <button
              type="button"
              onClick={async () => {
                if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
                  const updatedSkills = [...formData.skills, newSkill.trim()];
                  setFormData((prev) => ({ ...prev, skills: updatedSkills }));
                  setNewSkill("");
                  await updateField({ ...formData, skills: updatedSkills });
                }
              }}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full flex items-center text-sm shadow-sm"
              >
                {skill}
                <button
                  onClick={() => {
                    const updatedSkills = formData.skills.filter((item) => item !== skill);
                    setFormData((prev) => ({ ...prev, skills: updatedSkills }));
                    updateField({ ...formData, skills: updatedSkills });
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Accepting Requests Toggle */}
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-medium text-gray-800">Accepting Requests</h3>
          <button
            type="button"
            onClick={() => setAcceptingRequests(!acceptingRequests)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              acceptingRequests ? 'bg-gray-800' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                acceptingRequests ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Final Save Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-lg font-semibold"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
