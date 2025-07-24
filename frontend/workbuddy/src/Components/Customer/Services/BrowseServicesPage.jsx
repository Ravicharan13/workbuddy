import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import Footer from '../../WorkerHomePage/Footer';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import axiosInstance from '../../../axiosInstance';
import { MdDescription } from "react-icons/md";
import { State, City } from 'country-state-city';
import {useRole} from "../../SignUp/auth"
import { useNavigate } from 'react-router-dom';

const Services = [ 
  "Electrician", "Plumber", "Carpenter", "Painter", "Cleaner",
  "Mechanic", "Tutor", "AC Technician", "Gardener", "Cook",
  "Driver", "Babysitter", "Elderly Care", "Hair Stylist", "Makeup Artist",
  "Tailor", "Event Planner", "Photographer", "Pest Control", "Housekeeper",
  "Pet Groomer", "Yoga Instructor", "Personal Trainer", "Massage Therapist", "Laundry Service",
  "Laptop Repair", "Mobile Repair", "Home Automation", "Interior Designer", "Home Security Installer",
  "Handyman", "Roof Repair", "Tile Installer", "Furniture Assembler", "Courier Delivery",
  "DJ Services", "Dance Instructor", "Music Teacher", "Math Tutor", "Science Tutor",
  "Choreographer", "Language Translator", "Web Developer", "Graphic Designer", "CCTV Technician",
  "Water Purifier Technician", "Solar Panel Installer", "Driving Instructor", "Nutritionist", "Therapist"
];

export default function BrowseServicesPage() {
  const [search, setSearch] = useState('');
  const [service, setService] = useState('');
  const [availability, setAvailability] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [confirmRequest, setConfirmRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState('');
  const [selectedStateName, setSelectedStateName] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const user = useRole();
  const profileStatus = user.profileUpdateStatus;
  const navigate = useNavigate();
  const itemsPerPage = 6;

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/auth/workers");
      setOriginalData(res.data);
      setFilteredData(res.data);
    } catch (err) {
      toast.error("Failed to fetch workers", { toastId: "fetch-error" });
    } finally {
      setLoading(false);
    }
  };

  const stateCodeToNameMap = {
    AP: "Andhra Pradesh", AR: "Arunachal Pradesh", AS: "Assam", BR: "Bihar", CG: "Chhattisgarh",
    GA: "Goa", GJ: "Gujarat", HR: "Haryana", HP: "Himachal Pradesh", JH: "Jharkhand",
    KA: "Karnataka", KL: "Kerala", MP: "Madhya Pradesh", MH: "Maharashtra", MN: "Manipur",
    ML: "Meghalaya", MZ: "Mizoram", NL: "Nagaland", OD: "Odisha", PB: "Punjab",
    RJ: "Rajasthan", SK: "Sikkim", TN: "Tamil Nadu", TS: "Telangana", TR: "Tripura",
    UP: "Uttar Pradesh", UK: "Uttarakhand", WB: "West Bengal", DN: "Dadra and Nagar Haveli and Daman and Diu",
    DL: "Delhi", JK: "Jammu and Kashmir", LA: "Ladakh", AN: "Andaman and Nicobar Islands",
    CH: "Chandigarh", PY: "Puducherry"
  };

  useEffect(() => {
    let result = originalData.filter((worker) => {
      const fullName = `${worker.firstname} ${worker.lastname}`.toLowerCase();
      const backendStateName = stateCodeToNameMap[worker.state?.toUpperCase()] || worker.state;

      const matchesSearch =
        search === '' ||
        fullName.includes(search.toLowerCase()) ||
        worker.username?.toLowerCase().includes(search.toLowerCase()) ||
        worker.services?.some((s) =>
          typeof s === 'string'
            ? s.toLowerCase().includes(search.toLowerCase())
            : s.name?.toLowerCase().includes(search.toLowerCase())
        ) ||
        backendStateName?.toLowerCase().includes(search.toLowerCase()) ||
        worker.city?.toLowerCase().includes(search.toLowerCase());

      const matchesState =
        selectedStateName === '' || backendStateName?.toLowerCase() === selectedStateName.toLowerCase();

      const matchesCity =
        selectedCity === '' || worker.city?.toLowerCase() === selectedCity.toLowerCase();

      const matchesService =
        service === '' ||
        worker.services?.some((s) =>
          typeof s === 'string'
            ? s.toLowerCase().includes(service.toLowerCase())
            : s.name?.toLowerCase().includes(service.toLowerCase())
        );

      const matchesAvailability =
        availability === '' || worker.workerAvailability?.toLowerCase() === availability.toLowerCase();


      return (
        matchesSearch &&
        matchesState &&
        matchesCity &&
        matchesService &&
        matchesAvailability
      );
    });

    setFilteredData(result);
    setCurrentPage(1);
  }, [search, selectedStateName, selectedCity, service, availability, originalData]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWorkers = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);


  const handleSubmitRequest = async () => {
    console.log(user.email)
    const workerEmail = confirmRequest?.email || confirmRequest?.user?.email;

    if (!selectedService || !userLocation || !workerEmail) {
      toast.warning("All required fields must be filled.");
      return;
    }
    toast.loading("Sending Reqest...")
    try {
      await axiosInstance.post('/api/auth/workreq', {
        customerEmail: user.email,
        workerEmail,
        serviceWanted: selectedService,
        customerLocation: userLocation,
        scheduleDate: selectedDate.toISOString(),
        timeSlot: selectedTimeSlot,
      });
      toast.dismiss();
      toast.success("Service request submitted successfully!");
      setConfirmRequest(null);
      setShowServiceForm(false);
      setSelectedService('');
      setUserLocation('');
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || 'Request failed');
    }
  };

  const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
];

function isToday(date) {
  if (!date) return false;
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Filter out past time slots only if selected date is today
const filteredSlots = isToday(selectedDate)
  ? timeSlots.filter((slot) => {
      const slotStart = slot.split(" - ")[0]; // "09:00 AM"
      const [time, meridian] = slotStart.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (meridian === "PM" && hours !== 12) hours += 12;
      if (meridian === "AM" && hours === 12) hours = 0;

      const now = new Date();
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);

      return now < slotTime;
    })
  : timeSlots;



  return (
    <>
      {loading && <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
        <span className="ml-3">Loading...</span>
      </div>}
      <div className="w-full h-full md:h-[80vh] lg:h-full dark:text-gray-50 dark:bg-gray-900 px-12 md:px-20 lg:px-36 py-10">
        <h1 className="text-3xl font-bold mb-2">Browse Services</h1>
        <p className="text-gray-600 mb-6">Find the right worker for your needs and request service easily.</p>

        
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
           <input
              type="text"
              placeholder="Search by name, service, state or city"
              className="w-full lg:w-[330px] px-3 py-2 border-2 rounded-sm focus:outline-none focus:ring-gray-300 focus:border-gray-300  border-gray-100 dark:focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="w-full lg:w-[280px] px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 
                        dark:focus:ring-gray-500 dark:focus:border-gray-500 
                        border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              value={selectedStateCode}
              onChange={(e) => {
                const code = e.target.value;
                setSelectedStateCode(code);
                setSelectedStateName(State.getStateByCodeAndCountry(code, 'IN')?.name || '');
                setSelectedCity('');
              }}
            >
              <option value="" className="text-gray-500 dark:text-gray-300">All State</option>
              {State.getStatesOfCountry('IN').map((state) => (
                <option
                  key={state.isoCode}
                  value={state.isoCode}
                  className="text-gray-800 dark:text-white bg-white dark:bg-gray-800"
                >
                  {state.name}
                </option>
              ))}
            </select>


            <select
               className="w-full lg:w-[280px] px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 
                        dark:focus:ring-gray-500 dark:focus:border-gray-500 
                        border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedStateCode}
            >
              <option value="">{ !selectedStateCode ? "Please Select State" : "Select City"}</option>
              {City.getCitiesOfState('IN', selectedStateCode)?.map((city, idx) => (
                <option key={idx} value={city.name}>
                  {city.name}
                </option>
              ))}
           </select>

           <select  className="w-full lg:w-[280px] h-10 border rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 
                        dark:focus:ring-gray-500 dark:focus:border-gray-500 
                        border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-gray-800 dark:text-gray-100" value={service} onChange={(e) => setService(e.target.value)}>
            <option value="">All Services</option>
            {Services.map((srv, idx) => (
              <option key={idx} value={srv}>{srv}</option>
            ))}
          </select>

          <select  className="w-full lg:w-[280px] h-10 border rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 
                        dark:focus:ring-gray-500 dark:focus:border-gray-500 
                        border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-gray-800 dark:text-gray-100" value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {paginatedWorkers.map((worker, index) => (
            worker.profileUpdateStatus && <div key={index} className="w-full border rounded-sm shadow-sm p-4 bg-white dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-4">
                <img
                  src={worker.avatar || 'https://via.placeholder.com/48'}
                  alt={`${worker.firstname} ${worker.lastname}`}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h2 className="font-semibold text-lg">{worker.firstname + " " + worker.lastname}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {worker.services?.map((service, i) => (
                      <span key={i} className="bg-gray-200 text-gray-700 text-xs px-2.5 py-0.5 rounded-sm">
                        {typeof service === 'string' ? service : service.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-400">
                <p className="text-sm flex items-center gap-1 md:mb-1">
                  <MapPin className='w-7 pb-3 md:w-4 md:pb-0' /><span> {worker.location}, {worker.city}, {worker.state}</span>
                </p>
                <p className="text-sm flex gap-1"><MdDescription className='pt-1 text-lg '/>{worker.description || 'No description provided.'}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setSelectedWorker(worker)}
                  className="px-3 py-1 text-sm md:px-4 md:py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700"
                >
                  View Profile{profileStatus}
                </button>
                {worker.workerAvailability === "available" ? (
                  profileStatus ? (
                    <button
                      onClick={() => {
                        setConfirmRequest(worker);
                        setShowServiceForm(false);
                      }}
                      className="px-3 py-1 text-sm md:px-4 md:py-2 bg-gray-100 text-gray-800 rounded-sm hover:bg-gray-200"
                    >
                      Request Service
                    </button>
                  ) : (
                      <button
                       title="Please update your profile to request a service"
                      onClick={() => navigate("/customer/profile-update")}
                      className="px-4 py-2 bg-yellow-400 text-white rounded-sm hover:bg-yellow-500 duration-300"
                    >
                      Update Profile
                    </button>
                  )
                ) : (
                  <button className="px-4 py-2 bg-gray-400 text-gray-100 rounded-sm" disabled>
                    Unavailable
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && !loading && (
          <div className="text-center py-6 text-lg mt-4 shadow-sm flex justify-center">
             <div className='bg-gray-100 text-gray-800 px-6 py-4 font-semibold rounded-sm'>⚠️ No worker found matching the selected filters.</div>
          </div>
        )}


        {totalPages >= 1 && (
          <div className="flex justify-center items-center mt-6 mb-4 gap-2">
            <span>Pages:</span>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded-sm ${currentPage === idx + 1 ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-300'}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}



        {selectedWorker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-xl max-w-md w-full">
              <div className='flex items-center gap-4 mb-2'>
                <img
                  src={selectedWorker.avatar || 'https://via.placeholder.com/48'}
                  alt={`${selectedWorker.firstname} ${selectedWorker.lastname}`}

                  className="w-10 h-10 rounded-full"
                />
                <h2 className="text-xl font-bold mb-1">{selectedWorker.firstname + ' ' + selectedWorker.lastname}</h2>
              </div>
              <div className='px-3'>
                <p className="text-gray-700 dark:text-gray-400 mb-1">
                <strong>Location:</strong> {selectedWorker.location}, {selectedWorker.city}, {selectedWorker.state}
              </p>
              <p className="text-gray-700 mb-1 dark:text-gray-400">
                <strong>Services:</strong> {selectedWorker.services?.map(s => typeof s === 'string' ? s : s.name).join(', ')}
              </p>
              <p className="text-gray-700 mb-1 dark:text-gray-400">
                <strong>E-Mail:</strong> {selectedWorker.email || "Not Mention Email Address"}
              </p>
              <p className="text-gray-700 mb-1 dark:text-gray-400">
                <strong>Phone Number:</strong>+91 {selectedWorker.phone || "Not Mention Phone Number"}
              </p>
              <p className="text-gray-700 mb-1 dark:text-gray-400" >
                <strong>Description:</strong> {selectedWorker.description || "Not Mention Descritpion"}
              </p>
               <p className="text-gray-700 mb-1 capitalize dark:text-gray-400">
                <strong>Worker Availability:</strong> {selectedWorker.workerAvailability || "Worker Availabile"}
              </p>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setSelectedWorker(null)}
                  className="px-4 py-2 bg-gray-800 text-gray-50 hover:bg-gray-600 rounded-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmRequest && !showServiceForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-xl max-w-sm w-full text-center">
              <p className="mb-4">
                Do you want to request service from <strong>{confirmRequest.firstname}</strong>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                    onClick={() => setShowServiceForm(true)} // ✅ wrapped in a function
                    className="px-4 py-2 bg-gray-800  duration-300 text-white rounded-sm hover:bg-gray-600"
                  >
                    Confirm
                  </button>

                <button
                  onClick={() => setConfirmRequest(null)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-500 duration-300 rounded-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmRequest && showServiceForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-sm shadow-xl max-w-sm w-full space-y-4">
                  <h2 className="text-lg font-semibold mb-2 text-center">
                    Request a service from <span className="text-gray-800 font-bold dark:text-gray-300">{confirmRequest.firstname}</span>
                  </h2>

                  {/* Select Service */}
                  <div className="flex flex-col">
                    <label htmlFor="serviceSelect" className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">Service</label>
                    <select
                      id="serviceSelect"
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-3 py-2 border-2 rounded-sm focus:outline-none focus:border-gray-600 border-gray-100 dark:focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900"
                    >
                      <option value="">Select a service</option>
                      {confirmRequest.services.map((s, idx) => (
                        <option key={idx} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Enter Location */}
                  <div className="flex flex-col">
                    <label htmlFor="locationInput" className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">Your Location</label>
                    <input
                      id="locationInput"
                      type="text"
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                      placeholder="Enter your location"
                      className="w-full px-3 py-2 border-2 rounded-sm focus:outline-none focus:border-gray-600 border-gray-100 dark:focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900"
                    />
                  </div>

                  {/* Select Date */}
                  <div className="flex flex-col">
                    <label htmlFor="datePicker" className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">Select Date</label>
                    <DatePicker
                      id="datePicker"
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      minDate={new Date()}
                      dateFormat="yyyy/MM/dd"
                      className="w-full px-3 py-2 border-2 rounded-sm focus:outline-none focus:border-gray-600 border-gray-100 dark:focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900"
                      placeholderText="Select a date"
                    />
                  </div>

                  {/* Time Slots */}
                  <div className="flex flex-col">
                    <label htmlFor="timeSlotSelect" className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">Time Slot</label>
                    <select
                      id="timeSlotSelect"
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 border-2 rounded-sm focus:outline-none focus:border-gray-600 border-gray-100 dark:focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900"
                    >
                      <option value="">Select a time slot</option>
                      {filteredSlots.map((slot, idx) => (
                        <option key={idx} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  {/* Submit & Cancel */}
                  <div className="flex justify-center gap-4 pt-2">
                    <button
                      onClick={handleSubmitRequest}
                      className="px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700 duration-300"
                      disabled={!selectedService || !userLocation || !selectedDate || !selectedTimeSlot}
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => {
                        setConfirmRequest(null);
                        setShowServiceForm(false);
                        setSelectedService('');
                        setUserLocation('');
                        setSelectedDate(null);
                        setSelectedTimeSlot('');
                      }}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-500 rounded-sm hover:bg-gray-400 duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}


      </div>
      <Footer />
    </>
  );
}
