import React,{useState,useEffect} from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import {Moon, Sun, Lock, Unlock } from 'lucide-react';
import Footer from "../WorkerHomePage/Footer"

const avatarList = [
  'https://res.cloudinary.com/dquha58yu/image/upload/v1751696352/img7_jht5fj.jpg',
  'https://res.cloudinary.com/dquha58yu/image/upload/v1751696351/img2_wlnuu6.jpg',
  'https://res.cloudinary.com/dquha58yu/image/upload/v1751696350/img6_ggcsal.jpg',
  'https://res.cloudinary.com/dquha58yu/image/upload/v1751696350/img5_qqbrj6.jpg',
  'https://res.cloudinary.com/dquha58yu/image/upload/v1751696350/img3_yqkher.jpg',
  'https://res.cloudinary.com/dquha58yu/image/upload/v1751696350/img8_flpzls.jpg',
  'https://res.cloudinary.com/dquha58yu/image/upload/v1751696350/img1_bl5wm9.jpg',
  'https://res.cloudinary.com/dquha58yu/image/upload/v1751696350/img4_tpdpek.jpg'
];

const ProfilePage = () => {

    const [image, setImage] = useState('');
    const [showAvatars, setShowAvatars] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [info, setInfo] = useState({
    firstname: '',
    lastname: '',
    dob: '',
    phone: '',
    location: '',
  });

  
    const handleImageSelect = async (imgUrl) => {
    try {
      setImage(imgUrl);
      const token = localStorage.getItem('accessToken');
      await axios.patch('http://localhost:5000/api/auth/customer/update-avatar', {
        avatar: imgUrl,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(prev => ({ ...prev, avatar: imgUrl }));
      toast.success("Avatar updated!");
      setShowAvatars(false);
    } catch (err) {
      toast.error("Failed to update avatar");
      console.error(err);
    }
  };


  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isDark, setIsDark] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);

  useEffect(() => {
    const fetchWorkerProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:5000/api/auth/customer/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { firstname, lastname, dob, phone, location} = res.data;
        setInfo({ firstname, lastname, dob, phone, location});
        setProfile(res.data);
        console.log(res.data)
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerProfile();
  }, []);

   const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch('http://localhost:5000/api/auth/customer/update-info', info, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };
  const formatDate = (isoDate) => {
  if (!isoDate) return '';
  return new Date(isoDate).toISOString().split('T')[0];
};



  const [showPasswordModal, setShowPasswordModal] = useState(false);
  console.log(showPasswordModal)

  // Apply dark mode class to <html> tag
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };


  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
    const [showPassword, setShowPassword] = useState(false);

  const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New and confirm passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        'http://localhost:5000/api/auth/customer/change-password',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Password changed successfully");
      setShowPasswordModal(false);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };




  if (loading) return <div>Loading profile...</div>;




  return (
   <>
    <div className="min-h-screen bg-white dark:bg-gray-900 py-4 md:py-10 md:pb-20 px-4 md:px-20">
      <div className='px-2 py-2 lg:px-20 md:py-7'>
        <h2 className='text-2xl text-gray-800 dark:text-gray-50 font-bold'>Customer Profile</h2>
      </div>
      <div className="max-w-4xl mx-auto space-y-10">


        <section className="bg-gray-50 dark:text-gray-50 dark:bg-gray-800 text-gray-800 p-6 rounded-sm w-full shadow">
      <h2 className="text-lg font-bold mb-4">BASIC INFO</h2>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 w-full px-0">
        {/* Profile Image & Avatar Picker */}
        <div className="relative flex flex-col items-center w-52">
          <img
            src={profile?.avatar || 'https://res.cloudinary.com/dquha58yu/image/upload/v1751697248/307ce493-b254-4b2d-8ba4-d12c080d6651_pty54f.jpg'}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-500"
          />

          <div className='px-0'>
            <button
            onClick={() => setShowAvatars(!showAvatars)}
            className="mt-1 w-full bg-gray-800 dark:bg-gray-900 text-white px-2 py-1 rounded-sm hover:bg-gray-700 text-xs flex items-center gap-2"
          >
            {showAvatars ?'Choose Avatar': 'Change Avatar'}
          </button>

          {/* Avatar Picker as centered absolute dropdown */}
          {showAvatars && (
            <div className="absolute left-1/2 ml-10 transform -translate-x-1/2 top-[190px] bg-gray-100 border dark:bg-gray-800 dark:border-gray-700 border-gray-300 p-3 rounded shadow-md flex flex-wrap gap-3 justify-center w-72 z-20">
              {avatarList.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="avatar"
                  className={`w-12 h-12 rounded-full cursor-pointer border-2 transition hover:border-blue-500 ${
                    image === img ? 'border-blue-600' : 'border-transparent'
                  }`}
                  onClick={() => handleImageSelect(img)}
                />
              ))}
            </div>
          )}
          </div>
        </div>

        {/* User Info */}
        <div className="text-left space-y-0 w-full md:w-auto">
          {profile && (
            <>
              <p className="text-2xl font-bold pb-2">{profile.firstname + " " + profile.lastname}</p>
              <p className="text-base font-medium text-gray-500">{profile.username}</p>
              <p className="text-sm text-gray-500">{!profile.phone?"Phone number not mention.":`+91 ${profile.phone}`}</p>
              <p className="text-sm text-gray-500">{!profile.dob? "DOB not mention":formatDate(profile.dob)}</p>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <p className="text-sm  text-gray-500">{!profile.location? "Location not mention" :profile.location}</p>
            </>
          )}

        </div>
      </div>
        </section>


        <section className="bg-gray-50 dark:bg-gray-800 dark:text-gray-50 p-6 rounded-sm text-gray-800">
            <h2 className="text-lg font-bold mb-4">BASIC INFO</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* First Name */}
              <div>
                <label className="block text-sm mb-1 font-semibold dark:text-gray-400" htmlFor="firstname">First Name</label>
                <input
                  id="firstname"
                  name="firstname"
                  value={info.firstname}
                  onChange={handleChange}
                  placeholder="First Name"
                  className={`p-2 rounded-sm text-sm w-full border-2 dark:text-gray-100 border-gray-100 dark:border-gray-700   dark:focus:border-gray-400 focus:outline-none focus:border-gray-200 ${!isEditing?'bg-gray-100 text-gray-600 dark:bg-gray-700': 'bg-white dark:bg-gray-900'}`}
                  disabled={!isEditing}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm mb-1 font-semibold dark:text-gray-400" htmlFor="lastname">Last Name</label>
                <input
                  id="lastname"
                  name="lastname"
                  value={info.lastname}
                  onChange={handleChange}
                  placeholder="Last Name"
                 className={`p-2 rounded-sm text-sm w-full border-2 dark:text-gray-100 border-gray-100 dark:border-gray-700   dark:focus:border-gray-400 focus:outline-none focus:border-gray-200 ${!isEditing?'bg-gray-100 text-gray-600 dark:bg-gray-700': 'bg-white dark:bg-gray-900'}`}
                  disabled={!isEditing}
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm mb-1 font-semibold dark:text-gray-400" htmlFor="dob">Date of Birth</label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formatDate(info.dob)}
                  onChange={handleChange}
                  className={`p-2 rounded-sm text-sm w-full border-2 dark:text-gray-100 border-gray-100 dark:border-gray-700   dark:focus:border-gray-400 focus:outline-none focus:border-gray-200 ${!isEditing?'bg-gray-100 text-gray-600 dark:bg-gray-700': 'bg-white dark:bg-gray-900'}`}
                  disabled={!isEditing}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm mb-1 font-semibold dark:text-gray-400" htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  value={info.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                 className={`p-2 rounded-sm text-sm w-full border-2 dark:text-gray-100 border-gray-100 dark:border-gray-700   dark:focus:border-gray-400 focus:outline-none focus:border-gray-200 ${!isEditing?'bg-gray-100 text-gray-600 dark:bg-gray-700': 'bg-white dark:bg-gray-900'}`}
                  disabled={!isEditing}
                />
              </div>

              {/* Location (Textarea) */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-1 font-semibold dark:text-gray-400" htmlFor="location">Location</label>
                <textarea
                  id="location"
                  name="location"
                  value={info.location}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className={`p-2 rounded-sm text-sm w-full border-2 dark:text-gray-100 border-gray-100 dark:border-gray-700   dark:focus:border-gray-400 focus:outline-none focus:border-gray-200 ${!isEditing?'bg-gray-100 text-gray-600 dark:bg-gray-700': 'bg-white dark:bg-gray-900'}`}
                  disabled={!isEditing}
                />
              </div>
              {/* Description (Textarea) */}

            </div>

            <button
              className="px-5 py-1 text-sm bg-gray-800 dark:bg-gray-900 dark:hover:bg-gray-700 text-white rounded-sm duration-300 hover:bg-gray-700"
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? "Save" : "Edit"}
            </button>
        </section>


        <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-sm shadow text-gray-800 dark:text-white mt-10">
              <h2 className="text-xl font-bold mb-6">Change Password</h2>

              <div className="grid grid-cols-2 gap-4 ">
                {/* Current Password */}
                <div>
                  <label className="block text-sm mb-1 font-semibold">Current Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChanges}
                    placeholder="Enter current password"
                    className={`p-2 rounded-sm text-sm w-full border-2 border-gray-100 dark:text-gray-50 dark:border-gray-700  dark:bg-gray-900 dark:focus:border-gray-500 focus:outline-none focus:border-gray-200 bg-white text-gray-700`}
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm mb-1 font-semibold">New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChanges}
                    placeholder="Enter new password"
                    className={`p-2 rounded-sm text-sm w-full border-2 border-gray-100 dark:text-gray-50 dark:border-gray-700  dark:bg-gray-900 dark:focus:border-gray-500 focus:outline-none focus:border-gray-200 bg-white text-gray-700`}
                  />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm mb-1 font-semibold">Confirm New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChanges}
                    placeholder="Re-enter new password"
                    className={`p-2 rounded-sm text-sm w-full border-2 border-gray-100 dark:text-gray-50 dark:border-gray-700  dark:bg-gray-900 dark:focus:border-gray-500 focus:outline-none focus:border-gray-200 bg-white text-gray-700`}
                  />
                </div>
              </div>
              {/* Show Password Checkbox */}
                <label className="flex items-center text-sm gap-2 p-2" >
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="accent-gray-800 dark:accent-gray-900"
                  />
                  Show Password
                </label>

                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    className="mt-2 px-4 py-2 bg-gray-800 dark:bg-gray-900 duration-300 dark:hover:bg-gray-700 text-white rounded-sm hover:bg-gray-700 transition text-sm"
                  >
                    Change Password
                  </button>
                </div>
            </section>
            
            <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-sm shadow-md text-gray-800 dark:text-white mt-10">
              <h2 className="text-xl font-bold mb-6">ACCOUNT SETTINGS</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dark Mode Toggle */}
                <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded shadow-sm border dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      {isDark ? <Moon size={16} /> : <Sun size={16} />}
                      <span className="font-medium text-sm">Dark Mode</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDark}
                        onChange={toggleTheme}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-gray-800 transition-colors duration-300" />
                      <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-transform duration-300" />
                    </label>
                  </div>


                {/* Privacy Toggle */}
                <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded shadow-sm border dark:border-gray-700">
                  <div className="flex items-center gap-2">
                      {isPrivate ? <Lock size={16} /> : <Unlock size={16} />}
                      <span className="font-medium text-sm">Privacy Mode: {isPrivate ? 'Private' : 'Public'}</span>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={() => setIsPrivate(!isPrivate)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-gray-900 dark:peer-checked:bg-black dark:bg-gray-700 transition-colors duration-300" />
                      <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-full transition-transform duration-300" />
                    </label>
                </div>
              </div>
            </section>

      </div>
    </div>
    <Footer/>
   </>
  );
};

export default ProfilePage;


