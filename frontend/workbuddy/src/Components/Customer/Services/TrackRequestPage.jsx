import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosInstance"



export default function TrackRequestPage() {
  const [requests, setRequests] = useState([]);
  const [cancelId, setCancelId] = useState(null); // stores the request ID to cancel
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"


  

  useEffect(() => {
  const fetchRequests = async () => {
    setLoading(true); // ✅ Show loading spinner before fetching

    try {
      const res = await axiosInstance.get("/api/auth/getallcust");
      const data = res.data;

      console.log(data);

      const formatted = data.data.map((item) => ({
      id: item._id,
      avatar: item.workerAvatar,
      name: `${item.customerFirstName} ${item.customerLastName}`,
      email: item.customerEmail,
      phone: item.customerPhoneNumber,
      location: item.customerLocation,
      work: item.serviceWanted,
      getDate: item.timestamp?.slice(0, 10),  // for display
      timestamp: item.requestSentAt,              // ✅ use this for sorting
      scheduleDate: item.scheduleDate,
      timeSlot: item.timeSlot,
      status: item.workerStatus,
      reason: item.rejectReason,
      workerName: `${item.workerFirstName} ${item.workerLastName}`,
      workerEmail: item.workerEmail,
      workerPhone: item.workerPhoneNumber,
      chatRoomId: item.chatRoomId
    }));


      setRequests(formatted);
    } catch (error) {
      toast.error('Failed to fetch requests.', {
        toastId: 'fetch-error',
        position: 'top-right',
        className: 'bg-gray-800 text-white uppercase font-semibold',
        bodyClassName: 'text-sm',
        progressClassName: 'bg-gray-800',
      });
    } finally {
      setLoading(false); // ✅ Always stop loading
    }
  };

  fetchRequests();
}, []);


const handleCancelConfirmed = async () => {
  const loadingId = toast.loading("Request Cancelling...");
  try {
    const res = await axiosInstance.put(`/api/auth/customercancelrequest/${cancelId}`);

    if (res?.data?.success) {
      try {
        // ✅ This inner try block prevents errors from falling into the outer catch
        const updated = requests.map((req) =>
          req.id === cancelId ? { ...req, status: 'cancelled' } : req
        );
        setRequests(updated);

        toast.dismiss(loadingId);
        toast.success("Request cancelled successfully");
      } catch (innerError) {
        toast.dismiss(loadingId);
        console.error("UI update error:", innerError);
        toast.error("Cancelled, but something went wrong updating the UI.");
      }
    } else {
      throw new Error(res?.data?.message || "Failed to cancel request");
    }
  } catch (error) {
    toast.dismiss(loadingId);
    console.error("API error:", error);
    toast.error(error?.response?.data?.message || error.message || 'Error cancelling request.');
  } finally {
    setCancelId(null); // Close the modal
  }
};


  return (
    <>
    {loading && <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
        <span className="ml-3">Loading...</span>
      </div>}
       <div className="w-full h-full md:h-[95vh] lg:h-full dark:bg-gray-900  p-6 md:px-20 lg:px-36 md:py-16">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Track Your Requests</h1>
      <div className="flex justify-end mb-4">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-[200px] px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 
                        dark:focus:ring-gray-500 dark:focus:border-gray-500 
                        border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
        >
          <option value="newest">Sort by: New to Old</option>
          <option value="oldest">Sort by: Old to New</option>
        </select>
      </div>

      {requests.length === 0 ? (
        <p className="text-gray-500">You have no service requests yet.</p>
      ) : (
        <div className="space-y-4">
          {[...requests]
            .sort((a, b) => {
              const timeA = new Date(a.timestamp);
              const timeB = new Date(b.timestamp);
              return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
            })
            .map((req) => (
            <div key={req.id} className="border p-4 rounded-sm shadow-sm bg-white dark:bg-gray-900 dark:border-gray-800 flex flex-col gap-2">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className='flex gap-5'>
                    <img
                    src={req.avatar || 'https://via.placeholder.com/48'}
                    alt={`${req.name}`}
                    className="w-12 h-12 rounded-full mt-2"
                  />
                  <div>
                    <h2 className="font-bold uppercase py-2 text-2xl text-gray-800 dark:text-white">{req.work}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Requested by <strong>{req.name}</strong> on {req.getDate}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Scheduled on <strong>Scheduled on:{" "}
                        {new Date(req.scheduleDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}</strong> at <strong>{req.timeSlot}</strong>
                    </p>

                    {/* ✅ Worker Name — Always if present */}
                {req.workerName && (
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-0 pt-3">
                    <strong>Worker:</strong> {req.workerName}
                  </p>
                )}

                {/* ✅ Full Worker Details — Only if Accepted */}
                {(req.status === 'accepted' || 'completed') && req.workerEmail && (
                  <div className="text-sm text-gray-800 dark:text-gray-200 py-1">
                    <p><strong>Email:</strong> {req.workerEmail}</p>
                    <p><strong>Phone:</strong> {req.workerPhone}</p>
                  </div>
                )}

                {/* ✅ Rejection Reason */}
                {req.status === 'rejected' && req.reason && (
                  <p className="text-sm text-red-600 font-bold mt-2">Reason: {req.reason}</p>
                )}

                {/* ✅ Accepted Info */}
                {req.status === 'accepted' && (
                  <p className="text-sm text-gray-400 mt-0">
                    ⚠️ If you want to cancel the request, please communicate with the worker.
                  </p>
                )}
                {/* ✅ Buttons */}
                <div className="flex gap-3 mt-3 flex-wrap">
                  {/* Cancel Button for Pending */}
                  {req.status === 'pending' && (
                    <button
                      onClick={() => setCancelId(req.id)}
                      className=" bg-red-600 text-gray-100 hover:bg-red-400 px-4 py-2 rounded-sm duration-300 text-sm"
                    >
                      Cancel
                    </button>
                  )}

                  {/* Message Button for Accepted */}
                  {(req.status === 'accepted' || req.status === 'completed') && req.workerEmail && (
                    <button
                       onClick={() => navigate(`/customer/chat/${req.chatRoomId}`)}
                      className="px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700 duration-300 text-sm"
                    >
                      Message
                    </button>
                  )}
                </div>
                  </div>
                  </div>

                  <span
                    className={`mt-6 md:mt-0 px-3 py-1 rounded-sm text-sm font-medium w-fit ${
                      req.status === 'accepted'
                        ? 'bg-gray-50 text-green-900'
                        : req.status === 'rejected'
                        ? 'bg-gray-50 text-red-700'
                        : req.status === 'pending'
                        ? 'bg-gray-50 text-yellow-900'
                        : req.status === 'cancelled'
                        ? 'bg-gray-50 text-gray-900'
                        : req.status === 'completed'
                        ? 'bg-gray-50 text-gray-900'
                        : ''
                    }`}
                  >
                    <span className='capitalize'>{req.status}</span>
                  </span>
                </div>
              </div>
          ))}
        </div>
      )}

      {/* ✅ Confirmation Modal */}
      {cancelId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Confirm Cancellation</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to cancel this request?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
              >
                No
              </button>
              <button
                onClick={handleCancelConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
      </>
   
  );
}
