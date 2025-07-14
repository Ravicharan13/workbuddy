import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";



export default function TrackRequestPage() {
  const [requests, setRequests] = useState([]);
  const [cancelId, setCancelId] = useState(null); // stores the request ID to cancel
  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch('http://localhost:5000/api/auth/getallcust', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);

        const formatted = data.data.map((item) => ({
          id: item._id,
          name: `${item.customerFirstName} ${item.customerLastName}`,
          email: item.customerEmail,
          phone: item.customerPhoneNumber,
          location: item.customerLocation,
          work: item.serviceWanted,
          getDate: item.timestamp?.slice(0, 10),
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
      }
    };

    fetchRequests();
  }, []);



  const handleCancelConfirmed = async () => {
    try {
      console.log(cancelId)
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:5000/api/auth/customercancelrequest/${cancelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Request cancelled successfully");
        const updated = requests.map((req) =>
          req.id === cancelId ? { ...req, status: 'Cancelled' } : req
        );
        setRequests(updated);
      } else {
        throw new Error(result.message || "Failed to cancel request");
      }
    } catch (error) {
      toast.error(error.message || 'Error cancelling request.');
    } finally {
      setCancelId(null); // hide modal
    }
  };

  return (
    <div className="w-full h-full dark:bg-gray-900  p-6 md:px-36 md:py-16">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Track Your Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">You have no service requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="border p-4 rounded-sm shadow-sm bg-white dark:bg-gray-900 dark:border-gray-800 flex flex-col gap-2">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
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
                  </div>

                  <span
                    className={`mt-2 md:mt-0 px-3 py-1 rounded-sm text-sm font-medium w-fit ${
                      req.status === 'accepted'
                        ? 'bg-gray-50 text-green-700'
                        : req.status === 'rejected'
                        ? 'bg-gray-50 text-red-700'
                        : req.status === 'pending'
                        ? 'bg-gray-50 text-yellow-800'
                        : req.status === 'cancelled'
                        ? 'bg-gray-50 text-gray-500'
                        : ''
                    }`}
                  >
                    <span className='capitalize'>{req.status}</span>
                  </span>
                </div>

                {/* ✅ Worker Name — Always if present */}
                {req.workerName && (
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-0">
                    <strong>Worker:</strong> {req.workerName}
                  </p>
                )}

                {/* ✅ Full Worker Details — Only if Accepted */}
                {req.status === 'accepted' && req.workerEmail && (
                  <div className="text-sm text-gray-800 dark:text-gray-200">
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
                      className="px-4 py-2 bg-red-500 text-gray-100 duration-300 rounded-sm hover:bg-red-400 text-sm"
                    >
                      Cancel Request
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
  );
}
