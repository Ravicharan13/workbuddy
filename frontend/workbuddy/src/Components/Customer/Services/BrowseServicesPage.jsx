import React, { useState, useEffect } from 'react';
import { Star, MapPin } from 'lucide-react';
import Footer from '../../WorkerHomePage/Footer';

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
  const [error, setError] = useState('');

  const itemsPerPage = 6;

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accesstoken');
      if (!token) throw new Error('Access token not found');

      const res = await fetch('http://localhost:5000/api/auth/workers', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to fetch workers');
      const data = await res.json();

      setOriginalData(data);
      setFilteredData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    let result = originalData.filter((worker) => {
      const matchesSearch =
        worker.name?.toLowerCase().includes(search.toLowerCase()) ||
        worker.service?.toLowerCase().includes(search.toLowerCase()) ||
        worker.description?.toLowerCase().includes(search.toLowerCase());

      const matchesLocation = location === '' || worker.location === location;
      const matchesService = service === '' || worker.service === service;
      const matchesAvailability = availability === '' || worker.availability === availability;
      const matchesRating = rating === '' || worker.rating >= parseInt(rating);

      return matchesSearch && matchesLocation && matchesService && matchesAvailability && matchesRating;
    });

    setFilteredData(result);
    setCurrentPage(1);
  }, [search, location, service, availability, rating, originalData]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWorkers = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const uniqueLocations = [...new Set(originalData.map((w) => w.location))];
  const uniqueServices = [...new Set(originalData.map((w) => w.service))];
  const uniqueAvailability = [...new Set(originalData.map((w) => w.availability))];

  return (
    <>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Browse Services</h1>
        <p className="text-gray-600 mb-6">Find the right worker for your needs and request service easily.</p>

        {error && <p className="text-red-500">{error}</p>}
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
              <option key={idx} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select className="border rounded-sm px-3 py-2" value={service} onChange={(e) => setService(e.target.value)}>
            <option value="">All Services</option>
            {uniqueServices.map((srv, idx) => (
              <option key={idx} value={srv}>
                {srv}
              </option>
            ))}
          </select>

          <select
            className="border rounded-sm px-3 py-2"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="">Any Availability</option>
            {uniqueAvailability.map((av, idx) => (
              <option key={idx} value={av}>
                {av}
              </option>
            ))}
          </select>

          <select className="border rounded-sm px-3 py-2" value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="">All Ratings</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} stars & up
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedWorkers.map((worker, index) => (
            <div key={index} className="border rounded-sm shadow-sm p-4 bg-white">
              <div className="flex items-center gap-4">
                <img
                  src={worker.avatar || 'https://via.placeholder.com/48'}
                  alt={worker.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h2 className="font-semibold text-lg">{worker.name}</h2>
                  <p className="text-sm text-gray-600">{worker.service}</p>
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
                  onClick={() => setConfirmRequest(worker)}
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
                className={`px-3 py-1 rounded-sm ${
                  currentPage === idx + 1 ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-300'
                }`}
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

        {/* Modals */}
        {selectedWorker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-sm shadow-xl max-w-md w-full">
              <h2 className="text-xl font-bold mb-2">{selectedWorker.name}</h2>
              <p className="text-gray-600 mb-1">
                <strong>Service:</strong> {selectedWorker.service}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Location:</strong> {selectedWorker.location}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Availability:</strong> {selectedWorker.availability || 'N/A'}
              </p>
              <p className="text-gray-600 mb-4">{selectedWorker.description}</p>
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

        {confirmRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-sm shadow-xl max-w-sm w-full text-center">
              <p className="mb-4">
                Do you want to request service from <strong>{confirmRequest.name}</strong>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    alert('✅ Service request submitted successfully!');
                    setConfirmRequest(null);
                  }}
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
      </div>

      <Footer />
    </>
  );
}
