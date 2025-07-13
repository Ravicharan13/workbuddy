import React, { useState, useEffect } from 'react';
import { Star, MapPin } from 'lucide-react';
import Footer from '../../WorkerHomePage/Footer';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';


export default function BrowseServicesPage() {
   const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [availability, setAvailability] = useState('');
  const [rating, setRating] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [confirmRequest, setConfirmRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  

  const itemsPerPage = 6;

  useEffect(() => {
  fetchWorkers();
}, []);

const fetchWorkers = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('Access token not found');

    const res = await fetch('http://localhost:5000/api/auth/workers', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    setOriginalData(data);
    setFilteredData(data);

  } catch (err) {
   toast.error("Failed to fetch workers", {
  toastId: "fetch-error"
});

  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  let result = originalData.filter((worker) => {
    const fullName = `${worker.firstname} ${worker.lastname}`.toLowerCase();

    const matchesSearch =
      search === '' ||
      fullName.includes(search.toLowerCase()) ||
      worker.username?.toLowerCase().includes(search.toLowerCase());

    const matchesLocation =
      location === '' || worker.location?.toLowerCase() === location.toLowerCase();

    const matchesService =
      service === '' ||
      worker.services?.some((s) =>
        typeof s === 'string'
          ? s.toLowerCase().includes(service.toLowerCase())
          : s.name?.toLowerCase().includes(service.toLowerCase())
      );

    const matchesAvailability =
      availability === '' || worker.availability?.toLowerCase() === availability.toLowerCase();

    const matchesRating =
      rating === '' || (worker.rating && worker.rating >= parseInt(rating));

    return (
      matchesSearch &&
      matchesLocation &&
      matchesService &&
      matchesAvailability &&
      matchesRating
    );
  });

  setFilteredData(result);
  setCurrentPage(1);
}, [search, location, service, availability, rating, originalData]);



  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWorkers = filteredData.slice(startIndex, startIndex + itemsPerPage);
  console.log(paginatedWorkers)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const uniqueLocations = [...new Set(originalData.map((w) => w.location))];
  const uniqueServices = [
  ...new Set(
    originalData.flatMap((w) =>
      w.services?.map((s) => (typeof s === 'string' ? s : s.name)) || []
    )
  ),
];


  const uniqueAvailability = [...new Set(originalData.map((w) => w.availability))];

const handleSubmitRequest = async () => {
  const customerEmail = localStorage.getItem('email');
  const workerEmail = confirmRequest?.email || confirmRequest?.user?.email;

  console.log("Selected Service:", selectedService);
  console.log("User Location:", userLocation);
  console.log("Worker Email:", workerEmail);

  if (!selectedService || !userLocation || !workerEmail) {
    toast.warning("All required fields must be filled.");
    return;
  }

  try {
    const token = localStorage.getItem('accessToken');

    const response = await fetch('http://localhost:5000/api/auth/workreq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        customerEmail,
        workerEmail,
        serviceWanted: selectedService,
        customerLocation: userLocation,
        scheduleDate:selectedDate.toISOString(),
        timeSlot:selectedTimeSlot
      }),
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message || 'Request failed');

    toast.success("Service request submitted successfully!");

    setConfirmRequest(null);
    setShowServiceForm(false);
    setSelectedService('');
    setUserLocation('');
  } catch (err) {
    toast.error(`${err.message}`);

  }
};


  return (
    <>
      <div className="w-[85%] h-[90vh] mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Browse Services</h1>
        <p className="text-gray-600 mb-6">Find the right worker for your needs and request service easily.</p>

      
        {loading && <p>Loading workers...</p>}

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name, service, or description"
            className="w-full px-3 py-2 border-2 rounded-sm focus:outline-none focus:border-gray-600 border-gray-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select className="border rounded-sm px-3 py-2" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">All Locations</option>
            {uniqueLocations.map((loc, idx) => (
              <option key={idx} value={loc}>{loc}</option>
            ))}
          </select>

          <select className="border rounded-sm px-3 py-2" value={service} onChange={(e) => setService(e.target.value)}>
            <option value="">All Services</option>
            {uniqueServices.map((srv, idx) => (
              <option key={idx} value={srv}>{srv}</option>
            ))}
          </select>

          <select className="border rounded-sm px-3 py-2" value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <option value="">Any Availability</option>
            {uniqueAvailability.map((av, idx) => (
              <option key={idx} value={av}>{av}</option>
            ))}
          </select>

          <select className="border rounded-sm px-3 py-2" value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="">All Ratings</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} stars & up</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedWorkers.map((worker, index) => (
            <div key={index} className="border rounded-sm shadow-sm p-4 bg-white">
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
                  <div className="flex items-center text-yellow-500">
                    {Array.from({ length: worker.rating || 0 }).map((_, idx) => (
                      <Star key={idx} size={16} fill="currentColor" stroke="none" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-gray-600">
                <p className="text-sm flex items-center gap-1 mb-1">
                  <MapPin size={14} /> {worker.location} ({worker.availability || 'N/A'})
                </p>
                <p className="text-sm">{worker.description || 'No description provided.'}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setSelectedWorker(worker)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    setConfirmRequest(worker);
                    setShowServiceForm(false);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-sm hover:bg-gray-200"
                >
                  Request Service
                </button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 mb-4 gap-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded-sm disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded-sm ${currentPage === idx + 1 ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-300'}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 bg-gray-200 rounded-sm disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}


        {selectedWorker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-sm shadow-xl max-w-md w-full">
              <h2 className="text-xl font-bold mb-2">{selectedWorker.firstname + ' ' + selectedWorker.lastname}</h2>
              <p className="text-gray-600 mb-1">
                <strong>Location:</strong> {selectedWorker.location}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Availability:</strong> {selectedWorker.availability || 'N/A'}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Rating:</strong> {selectedWorker.rating || 'N/A'}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Services:</strong> {selectedWorker.services?.map(s => typeof s === 'string' ? s : s.name).join(', ')}
              </p>
              <p className="text-gray-600 mb-4">{selectedWorker.description || 'No description available.'}</p>
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
            <div className="bg-white p-6 rounded-sm shadow-xl max-w-sm w-full text-center">
              <p className="mb-4">
                Do you want to request service from <strong>{confirmRequest.firstname}</strong>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                    onClick={() => setShowServiceForm(true)} // ✅ wrapped in a function
                    className="px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-600"
                  >
                    Confirm
                  </button>

                <button
                  onClick={() => setConfirmRequest(null)}
                  className="px-4 py-2 bg-gray-300 rounded-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmRequest && showServiceForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-sm shadow-xl max-w-sm w-full space-y-4">
      <h2 className="text-lg font-semibold mb-2 text-center">
        Request a service from <span className="text-gray-800 font-bold">{confirmRequest.firstname}</span>
      </h2>

      {/* Select Service */}
      <select
        value={selectedService}
        onChange={(e) => setSelectedService(e.target.value)}
           className="w-full px-3 py-2 border-2 rounded-sm focus:outline-none focus:border-gray-600 border-gray-100"
      >
        <option value="">Select a service</option>
        {confirmRequest.services.map((s, idx) => (
          <option key={idx} value={s.name}>{s.name}</option>
        ))}
      </select>

      {/* Enter Location */}
      <input
        type="text"
        value={userLocation}
        onChange={(e) => setUserLocation(e.target.value)}
        placeholder="Enter your location"
        className="w-full px-3 py-2 border-2 rounded-sm focus:outline-none focus:border-gray-600 border-gray-100"
      />

      {/* Select Date */}
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        minDate={new Date()}
        dateFormat="yyyy/MM/dd"
        className="w-full px-3 py-2 border-2 rounded-sm focus:outline-none focus:border-gray-600 border-gray-100"
        placeholderText="Select a date"
      />

      {/* Time Slots */}
      <select
        value={selectedTimeSlot}
        onChange={(e) => setSelectedTimeSlot(e.target.value)}
        className="w-full px-3 py-2 border-2 rounded-sm focus:outline-none focus:border-gray-600 border-gray-100"
      >
        <option value="">Select a time slot</option>
        {[
          "09:00 AM - 10:00 AM",
          "10:00 AM - 11:00 AM",
          "11:00 AM - 12:00 PM",
          "01:00 PM - 02:00 PM",
          "02:00 PM - 03:00 PM",
          "03:00 PM - 04:00 PM"
        ].map((slot, idx) => (
          <option key={idx} value={slot}>{slot}</option>
        ))}
      </select>

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
          className="px-4 py-2 bg-gray-200 rounded-sm hover:bg-gray-400 duration-300"
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
