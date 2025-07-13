import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Footer from '../WorkerHomePage/Footer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function WorkerRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortAsc, setSortAsc] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [reasonInput, setReasonInput] = useState('');

  useEffect(() => {
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch('http://localhost:5000/api/auth/getallwork', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(data)
      const formatted = data.data.map((item) => ({
        id: item._id, // use MongoDB _id
        name: `${item.customerFirstName} ${item.customerLastName}`,
        email: item.customerEmail,
        phone: item.customerPhoneNumber,
        location: item.customerLocation,
        work: item.serviceWanted,
        getDate: item.timestamp,
        scheduleDate:item.scheduleDate,
        timeSlot: item.timeSlot,
        status: item.workerStatus,
        reason: item.rejectReason,
      }));

      setRequests(formatted);
    } catch (error) {
      toast.error('Failed to fetch', {
        toastId: 'fetch-error',
        position: 'top-right',
        className: 'bg-gray-800 text-white uppercase font-semibold',
        bodyClassName: 'text-sm',
        progressClassName: 'bg-gray-800',
      });



    }
  };
  fetchRequests();
}, []);


  const handleAccept = async (id) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch('http://localhost:5000/api/auth/accept', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        requestId: id,
        workerStatus: 'accepted'
      })
    });

    const result = await res.json();
    if (res.ok) {
      setRequests(prev =>
        prev.map(r => r.id === id ? { ...r, status: 'accepted', reason: '' } : r)
      );
    } else {
      toast.error(result.message || 'Failed to accept request.');

    }
  } catch (error) {
    toast.error('Error while accepting request.');

  }
};


  const handleRejectClick = (id) => setRejectingId(id);

  const handleReasonSubmit = async (id) => {
  if (!reasonInput.trim()) return;
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch('http://localhost:5000/api/auth/accept', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        requestId: id,
        workerStatus: 'rejected',
        workerReason: reasonInput
      })
    });

    const result = await res.json();
    if (res.ok) {
      setRequests(prev =>
        prev.map(r => r.id === id ? { ...r, status: 'rejected', reason: reasonInput } : r)
      );
      setRejectingId(null);
      setReasonInput('');
    } else {
      toast.error(result.message || 'Failed to reject request.');

    }
  } catch (error) {
    toast.error('Error while rejecting request.');

  }
};
  const filtered = requests.filter(r =>
    filter === 'all' ? true : r.status === filter
  );

  const sorted = [...filtered].sort((a, b) => {
  const da = new Date(a.scheduleDate);
  const db = new Date(b.scheduleDate);
  return sortAsc ? da - db : db - da;
});

  console.log(sorted)
  const statusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gray-800 dark:bg-gray-900';
      case 'accepted': return 'bg-gray-800 dark:bg-gray-900';
      case 'completed': return 'bg-gray-800 dark:bg-gray-900';
      case 'rejected': return 'bg-gray-800 dark:bg-gray-900';
      case 'cancelled': return 'bg-gray-800 dark:bg-gray-900';
      default: return 'bg-gray-600';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-50 text-gray-900 px-8 py-14 md:px-20 lg:px-44">
        <h1 className="text-3xl font-bold mb-8 text-center">Customer Requests</h1>

        <div className="flex flex-wrap justify-between mb-6 gap-4">
          <div className="flex gap-4">
            {['all', 'pending', 'accepted', 'completed', 'cancelled', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-1 md:px-4 md:py-2 rounded-sm ${filter === f ? 'bg-gray-800 text-white dark:bg-gray-800 dark:text-gray-50' : 'bg-white dark:bg-gray-50 dark:text-gray-900'}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="px-2 py-1 md:px-4 md:py-2 bg-white dark:bg-gray-800 dark:text-gray-50 rounded-sm"
          >
            Sort by {sortAsc ? 'Oldest' : 'Newest'}
          </button>
        </div>

        <div className="space-y-6">
          {sorted.map(req => (
          <div
            key={req.id}
            className="bg-white dark:bg-gray-800 border-gray-500 dark:border-gray-700 rounded-sm p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-800 uppercase dark:text-white">
                  Service Wanted: <span className="text-gray-800 rounded-sm  dark:bg-gray-900 px-2 py-1">{req.work}</span>
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-base">
                  <strong>Customer Name:</strong> <span className="text-gray-600 dark:text-gray-400">{req.name}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Email:</strong> <span className="text-gray-600 dark:text-gray-400">{req.email}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Phone:</strong> <span className="text-gray-600 dark:text-gray-400">{req.phone}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  <strong>Location:</strong> <span className="text-gray-600 dark:text-gray-400">{req.location}</span>
                </p>
                <p className="text-gray-800 dark:bg-gray-900  dark:text-gray-300 text-sm bg-gray-200 p-1 text-center">
                    <strong>Schedule Date:</strong> <span className="text-gray-700 dark:text-gray-300">{dayjs(req.scheduleDate).format('dddd, MMMM D, YYYY')}</span>
                </p>
                <p className="text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-sm bg-gray-100 p-1 text-center">
                  <strong>Time Slot:</strong> <span className="text-gray-700 dark:text-gray-300">{req.timeSlot}</span>
                </p>

                {req.status==="cancelled" && (
                <div>
                  <span className='font-medium text-gray-500 text-sm italic'>Cancelled By Customer: {req.name}</span>
                </div>
              )}
              </div>
              
              <div className="flex flex-col items-end gap-4">
                <span
                  className={`text-xs text-white font-semibold px-3 py-2 rounded-sm ${statusColor(req.status)} shadow-sm`}
                >
                  Status: {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>

                {req.status === 'pending' && (
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="bg-gray-800 hover:bg-gray-700 text-base text-white px-5 py-1 rounded-sm duration-300"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectClick(req.id)}
                      className="border border-gray-100 dark:border-gray-500 text-base text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 px-5 py-1 rounded-sm duration-300"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>

            {rejectingId === req.id && (
              <div className="mt-4">
                <textarea
                  rows="2"
                  className="w-full p-3 rounded-sm border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-800"
                  placeholder="Enter reason for rejection..."
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                />
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleReasonSubmit(req.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-sm"
                  >
                    Submit Reason
                  </button>
                  <button
                    onClick={() => {
                      setRejectingId(null);
                      setReasonInput('');
                    }}
                    className="border border-gray-500 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {req.status === 'rejected' && req.reason && (
              <p className="text-sm text-red-500 mt-4 font-semibold italic">
                Reason: {req.reason}
              </p>
            )}
          </div>
))}

        </div>
      </div>
      <Footer />
    </>
  );
}
