import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Footer from '../WorkerHomePage/Footer';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../axiosInstance"


export default function WorkerRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortAsc, setSortAsc] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [reasonInput, setReasonInput] = useState('');
  const [loading, setLoading] =useState(false);

  useEffect(() => {
  const fetchRequests = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get("/api/auth/getallwork");
      const data = res.data;

      console.log(data);

      const formatted = data.data.map((item) => ({
        id: item._id,
        avatar: item.customerAvatar,
        name: `${item.customerFirstName} ${item.customerLastName}`,
        email: item.customerEmail,
        phone: item.customerPhoneNumber,
        location: item.customerLocation,
        work: item.serviceWanted,
        getDate: item.timestamp,
        sort:item.requestSentAt,
        scheduleDate: item.scheduleDate,
        timeSlot: item.timeSlot,
        status: item.workerStatus,
        reason: item.rejectReason,
        chatRoomId: item.chatRoomId,
      }));

      setRequests(formatted);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch requests", {
        toastId: "fetch-error",
        position: "top-right",
        className: "bg-gray-800 text-white uppercase font-semibold",
        bodyClassName: "text-sm",
        progressClassName: "bg-gray-800",
      });
    }finally {
      setLoading(false); // ✅ Always stop loading
    }
  };

  fetchRequests();
}, []);


 const handleAccept = async (id) => {
  try {
    const res = await axiosInstance.put("/api/auth/accept", {
        requestId: id,
        workerStatus: "accepted",
      });

      if (res.data.success) {
        toast.success("Request accepted successfully!");
        setRequests(prev =>
          prev.map(r => r.id === id ? { ...r, status: 'accepted', reason: '' } : r)
        );
      } else {
        toast.error(res.data.message || 'Failed to accept request.');
      }
  } catch (error) {
    toast.error('Error while accepting request.');

  }
};

  const handleRejectClick = (id) => setRejectingId(id);

  const handleReasonSubmit = async (id) => {
  if (!reasonInput.trim()) return;

  try {
    const res = await axiosInstance.put("/api/auth/accept", {
      requestId: id,
      workerStatus: 'rejected',
      workerReason: reasonInput
    });

    if (res.data.success) {
      toast.success("Request rejected successfully!");
      setRequests(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status: 'rejected', reason: reasonInput } : r
        )
      );
      setRejectingId(null);
      setReasonInput('');
    } else {
      toast.error(res.data.message || 'Failed to reject request.');
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error while rejecting request.');
  }
};
  const filtered = requests.filter(r =>
    filter === 'all' ? true : r.status === filter
  );

  const sorted = [...filtered].sort((a, b) => {
  const da = new Date(a.sort);
  const db = new Date(b.sort);
  return sortAsc ? da - db : db - da;
});

  console.log(sorted)
  const statusColor = (status) => {
    switch (status) {
      case 'pending': return ' text-gray-800';
      case 'accepted': return 'text-green-900 ';
      case 'completed': return ' text-green-900';
      case 'rejected': return ' text-red-900';
      case 'cancelled': return 'text-gray-700';
      default: return 'text-gray-800';
    }
  };

  return (
    <>
    {loading && <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
        <span className="ml-3">Loading...</span>
      </div>}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-50 text-gray-900 px-8 py-14 md:px-20 lg:px-44">
        <h1 className="text-3xl font-bold mb-8 text-center">Customer Requests</h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          {/* Filter Buttons - scrollable on mobile */}
          <div className="w-full overflow-x-auto">
            <div className="flex gap-2 w-max sm:w-full">
              {['all', 'pending', 'accepted', 'completed', 'cancelled', 'rejected'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`whitespace-nowrap text-sm px-3 py-1 md:px-4 md:py-2 rounded-sm transition-colors duration-200 ${
                    filter === f
                      ? 'bg-gray-800 text-white dark:bg-gray-800 dark:text-gray-50'
                      : 'bg-white text-gray-800 dark:bg-gray-50 dark:text-gray-900'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Button */}
          <div className="w-full md:w-36">
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="w-full md:w-auto px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-50 rounded-sm border dark:border-gray-700"
            >
              Sort by {sortAsc ? 'Oldest' : 'Newest'}
            </button>
          </div>
        </div>


        <div className="space-y-6">
          {sorted.map(req => (
          <div
            key={req.id}
            className="bg-white dark:bg-gray-800 border-gray-500 dark:border-gray-700 rounded-sm p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-gray-800 uppercase dark:text-white">
                  Service Wanted: <span className="text-gray-800 test rounded-sm  dark:text-gray-50 px-2 py-1">{req.work}</span>
                </h2>
                <div className='flex gap-5'>
                  <img
                    src={req.avatar || 'https://via.placeholder.com/48'}
                    alt={`${req.name}`}
                    className="w-16 h-16 rounded-sm mt-1"
                  />
                <div>
                  <p className="text-gray-700 dark:text-gray-300 text-base">
                  <strong>Customer Name:</strong> <span className="text-gray-600 dark:text-gray-400">{req.name}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm pt-1">
                  <strong>Email:</strong> <span className="text-gray-600 dark:text-gray-400">{req.email}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm pt-1">
                  <strong>Phone:</strong> <span className="text-gray-600 dark:text-gray-400">{req.phone}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm pt-1">
                  <strong>Location:</strong> <span className="text-gray-600 dark:text-gray-400">{req.location}</span>
                </p>
                </div>
                
                </div>
                <p className="text-gray-800 dark:bg-gray-900  dark:text-gray-300 text-sm bg-gray-200 p-1 text-center mt-10">
                    <strong>Schedule Date:</strong> <span className="text-gray-700 dark:text-gray-300">{dayjs(req.scheduleDate).format('dddd, MMMM D, YYYY')}</span>
                </p>
                <p className="text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-sm bg-gray-100 p-1 text-center mt-3">
                  <strong>Time Slot:</strong> <span className="text-gray-700 dark:text-gray-300">{req.timeSlot}</span>
                </p>
                {(req.status === 'accepted' || req.status === 'completed') && (
                    <button
                       onClick={() => navigate(`/worker/chat/${req.chatRoomId}`)}
                      className="px-4 py-2 bg-gray-800 dark:bg-gray-900 text-white rounded-sm hover:bg-gray-700 duration-300 text-sm mt-10"
                    >
                      Message
                    </button>
                  )}

                {req.status==="cancelled" && (
                <div>
                  <span className='font-medium text-gray-500 text-sm italic'>Cancelled By Customer: {req.name}</span>
                </div>
              )}
              </div>
              
              <div className="flex flex-col items-end gap-4">
                <span
                  className={`text-sm text-gray-900 dark:text-gray-100 font-semibold px-3 py-2`}
                >
                  Status: <span className={`${statusColor(req.status)} uppercase font-bold`}>{req.status.charAt(0).toUpperCase() + req.status.slice(1)}</span>
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
                  className="w-full px-3 py-2 border-2 rounded-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-600 dark:bg-gray-900 border-gray-300 dark:border-gray-800 placeholder:text-sm placeholder:uppercase"
                  placeholder="Enter reason for rejection..."
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                />
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleReasonSubmit(req.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-sm text-sm"
                  >
                    Submit Reason
                  </button>
                  <button
                    onClick={() => {
                      setRejectingId(null);
                      setReasonInput('');
                    }}
                    className="border border-gray-500 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-sm text-sm"
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
