import React, { useState,useEffect } from 'react';
import { Star, MapPin } from 'lucide-react';
import Footer from '../../WorkerHomePage/Footer';



// ADD MORE WORKERS
const workersData = [
  // Original 5
  {
    name: 'James Smith',
    service: 'Plumbing',
    location: 'Springfield',
    availability: 'Available',
    rating: 5,
    description: 'Experienced plumber offering reliable repair and installation ser-',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Mary Johnson',
    service: 'House cleaning',
    location: 'Riverside',
    availability: 'Available',
    rating: 5,
    description: 'Expert in home cleaning with attention to detail.',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Robert Brown',
    service: 'Painting',
    location: 'Greenville',
    availability: 'Unavailable',
    rating: 5,
    description: 'Professional painter dedicated to quality workmanship.',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Patricia Miller',
    service: 'Gardening',
    location: 'Centerville',
    availability: 'Available',
    rating: 5,
    description: 'Passionate gardener who loves to make your yard beautiful.',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Steven Clark',
    service: 'Electrician',
    location: 'Hilltown',
    availability: 'Unavailable',
    rating: 4,
    description: 'Certified electrician with 10+ years of experience.',
    avatar: 'https://via.placeholder.com/48',
  },
  // Add 15 more
  {
    name: 'Liam Johnson',
    service: 'AC Repair',
    location: 'Brookline',
    availability: 'Available',
    rating: 4,
    description: 'Reliable AC technician with quick turnaround.',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Emma White',
    service: 'Carpet Cleaning',
    location: 'Springfield',
    availability: 'Available',
    rating: 5,
    description: 'Deep carpet cleaning for homes and offices.',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Noah Lee',
    service: 'Dog Walking',
    location: 'Hilltown',
    availability: 'Available',
    rating: 4,
    description: 'Loves pets and provides safe, fun walks.',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Olivia Brown',
    service: 'Window Washing',
    location: 'Greenville',
    availability: 'Available',
    rating: 5,
    description: 'Makes your windows shine like new.',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Elijah Martin',
    service: 'Computer Repair',
    location: 'Centerville',
    availability: 'Unavailable',
    rating: 3,
    description: 'Affordable and fast PC & laptop repairs.',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Sophia Anderson',
    service: 'Tailoring',
    location: 'Riverside',
    availability: 'Available',
    rating: 5,
    description: 'Custom fits and alterations from a pro.',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Logan King',
    service: 'Furniture Assembly',
    location: 'Springfield',
    availability: 'Available',
    rating: 4,
    description: 'IKEA specialist with tools and skills.',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Mia Scott',
    service: 'Babysitting',
    location: 'Brookline',
    availability: 'Unavailable',
    rating: 5,
    description: 'Certified sitter with 8 years experience.',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Benjamin Adams',
    service: 'Floor Polishing',
    location: 'Hilltown',
    availability: 'Available',
    rating: 4,
    description: 'Restores shine to wood and marble floors.',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Isabella Lewis',
    service: 'Tutoring',
    location: 'Greenville',
    availability: 'Available',
    rating: 5,
    description: 'Math & science tutoring for all grades.',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Lucas Wright',
    service: 'Lawn Mowing',
    location: 'Centerville',
    availability: 'Available',
    rating: 3,
    description: 'Regular and one-time lawn maintenance.',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'Ava Baker',
    service: 'Nail Services',
    location: 'Riverside',
    availability: 'Available',
    rating: 5,
    description: 'Manicure and pedicure at your home.',
    avatar: 'https://via.placeholder.com/48',
  },
  {
    name: 'William Perez',
    service: 'Interior Design',
    location: 'Brookline',
    availability: 'Unavailable',
    rating: 5,
    description: 'Transform your home with expert design.',
    avatar: 'https://via.placeholder.com/48',
  },
];
export default function BrowseServicesPage() {
    
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [availability, setAvailability] = useState('');
  const [rating, setRating] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [confirmRequest, setConfirmRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;


  const filteredWorkers = workersData.filter(worker => {
  const matchesSearch = worker.name.toLowerCase().includes(search.toLowerCase()) ||
    worker.service.toLowerCase().includes(search.toLowerCase()) ||
    worker.description.toLowerCase().includes(search.toLowerCase());

  const matchesLocation = location === '' || worker.location === location;
  const matchesService = service === '' || worker.service === service;
  const matchesAvailability = availability === '' || worker.availability === availability;
  const matchesRating = rating === '' || worker.rating >= parseInt(rating);

  return matchesSearch && matchesLocation && matchesService && matchesAvailability && matchesRating;
});


  const uniqueLocations = [...new Set(workersData.map((w) => w.location))];
  const uniqueServices = [...new Set(workersData.map((w) => w.service))];
  const uniqueAvailability = [...new Set(workersData.map((w) => w.availability))];

const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedWorkers = filteredWorkers.slice(startIndex, startIndex + itemsPerPage);
const totalPages = Math.ceil(filteredWorkers.length / itemsPerPage);


    useEffect(() => {
  setCurrentPage(1); // Reset to page 1 when filters change
}, [search, location, service, availability, rating]);
return (
  <>
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Browse Services</h1>
      <p className="text-gray-600 mb-6">
        Find the right worker for your needs and request service easily.
      </p>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, service, or description"
          className="w-full px-3 py-2 border-2 rounded-sm focus:outline-none focus:border-gray-600 dark:focus:border-gray-500 border-gray-100"
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
      

      {/* Worker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedWorkers.map((worker, index) => (

          <div key={index} className="border rounded-sm shadow-sm p-4 bg-white">
            <div className="flex items-center gap-4">
              <img src={worker.avatar} alt={worker.name} className="w-12 h-12 rounded-full" />
              <div>
                <h2 className="font-semibold text-lg">{worker.name}</h2>
                <p className="text-sm text-gray-600">{worker.service}</p>
                <div className="flex items-center text-yellow-500">
                  {Array.from({ length: worker.rating }).map((_, idx) => (
                    <Star key={idx} size={16} fill="currentColor" stroke="none" />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-2 text-gray-600">
              <p className="text-sm flex items-center gap-1 mb-1">
                <MapPin size={14} /> {worker.location} ({worker.availability})
              </p>
              <p className="text-sm">{worker.description}</p>
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
    </div>

    {/* View Profile Modal */}
    {selectedWorker && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-sm shadow-xl max-w-md w-full">
          <h2 className="text-xl font-bold mb-2">{selectedWorker.name}</h2>
          <p className="text-gray-600 mb-1"><strong>Service:</strong> {selectedWorker.service}</p>
          <p className="text-gray-600 mb-1"><strong>Location:</strong> {selectedWorker.location}</p>
          <p className="text-gray-600 mb-1"><strong>Availability:</strong> {selectedWorker.availability}</p>
          <p className="text-gray-600 mb-4">{selectedWorker.description}</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setSelectedWorker(null)}
              className="px-4 py-2 bg-gray-800 text-gray-50 duration-300 rounded-sm hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Confirm Request Modal */}
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
              className="px-4 py-2 bg-gray-800 text-white rounded-sm duration-300 hover:bg-gray-600"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmRequest(null)}
              className="px-4 py-2 bg-gray-300 rounded-sm duration-300 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
          {/* Pagination Controls */}
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
                currentPage === idx + 1
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 hover:bg-gray-300'
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
      {/* Confirm Request Modal */}

      <Footer/>

  </>
);
  
}
