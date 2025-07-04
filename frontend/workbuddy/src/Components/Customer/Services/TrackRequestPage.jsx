import React, { useState } from 'react';

export default function TrackRequestPage() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      workerName: 'James Smith',
      service: 'Plumbing',
      date: '2025-07-03',
      status: 'Accepted',
    },
    {
      id: 2,
      workerName: 'Mary Johnson',
      service: 'Cleaning',
      date: '2025-07-04',
      status: 'Pending',
    },
    {
      id: 3,
      workerName: 'Robert Brown',
      service: 'Painting',
      date: '2025-07-02',
      status: 'Rejected',
    },
  ]);

  const handleCancel = (id) => {
    const confirmed = window.confirm('Are you sure you want to cancel this request?');
    if (confirmed) {
      const updatedRequests = requests.map((req) =>
        req.id === id ? { ...req, status: 'Cancelled' } : req
      );
      setRequests(updatedRequests);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Track Your Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">You have no service requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="border p-4 rounded-lg shadow-sm bg-white flex flex-col gap-2"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h2 className="font-semibold text-lg">{req.service}</h2>
                  <p className="text-sm text-gray-600">
                    Requested from <strong>{req.workerName}</strong> on {req.date}
                  </p>
                </div>
                <span
                  className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium w-fit ${
                    req.status === 'Accepted'
                      ? 'bg-green-100 text-green-700'
                      : req.status === 'Rejected'
                      ? 'bg-red-100 text-red-700'
                      : req.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : req.status === 'Cancelled'
                      ? 'bg-gray-200 text-gray-500'
                      : ''
                  }`}
                >
                  {req.status}
                </span>
              </div>

              {/* Warning or Cancel Button */}
              {req.status === 'Accepted' && (
                <p className="text-sm text-orange-600 mt-1">
                  ⚠️ If you want to cancel the request, please communicate with the worker by message or call.
                </p>
              )}

              {req.status === 'Pending' && (
                <div>
                  <button
                    onClick={() => handleCancel(req.id)}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Cancel Request
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
