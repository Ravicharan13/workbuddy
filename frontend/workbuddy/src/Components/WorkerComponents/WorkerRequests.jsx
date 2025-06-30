// import React, { useState } from 'react';
// import { Phone, Mail, MapPin, Clock } from 'lucide-react';
// import dayjs from 'dayjs';
// import Footer from '../WorkerHomePage/Footer';

// const initialRequests = [
//   {
//     id: 1,
//     name: 'John Anlworthe Staper',
//     title: 'Service Requester',
//     phone: '+1 202-555-0196',
//     email: 'john.staper@example.com',
//     location: 'Lautheren, MI',
//     work: 'Repair smith Caesbrok',
//     date: '2025-02-23T03:30:00',
//     status: 'pending',
//     reason: ''
//   },
//   {
//     id: 2,
//     name: 'John Blockaan Repair',
//     title: 'Wood Restorator',
//     phone: '+1 202-555-0177',
//     email: 'blockaan@example.com',
//     location: 'Foraresequille, FL',
//     work: 'Plumbing Cheek',
//     date: '2025-04-25T01:00:00',
//     status: 'completed',
//     reason: ''
//   },
//   {
//     id: 3,
//     name: 'John Watlaée Repair',
//     title: 'Plumbing Shower',
//     phone: '+1 202-555-0123',
//     email: 'watlaee@example.com',
//     location: '351 Las Laure, MD',
//     work: 'Kitchen Creek',
//     date: '2025-01-30T16:00:00',
//     status: 'accepted',
//     reason: ''
//   },
//   {
//     id: 4,
//     name: 'Dennis Hunt Request',
//     title: 'Repair Stonder',
//     phone: '+1 202-555-0188',
//     email: 'dennis.hunt@example.com',
//     location: 'Fauklin, OK',
//     work: 'Brookwoort Manolái´',
//     date: '2025-03-20T05:00:00',
//     status: 'rejected',
//     reason: 'Location too far'
//   }
// ];

// export default function WorkerRequests() {
//   const [requests, setRequests] = useState(initialRequests);
//   const [filter, setFilter] = useState('all');
//   const [sortAsc, setSortAsc] = useState(true);
//   const [rejectingId, setRejectingId] = useState(null);
//   const [reasonInput, setReasonInput] = useState('');

//   const handleAccept = (id) => {
//     setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted', reason: '' } : r));
//   };

//   const handleRejectClick = (id) => setRejectingId(id);

//   const handleReasonSubmit = (id) => {
//     if (!reasonInput.trim()) return;
//     setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected', reason: reasonInput } : r));
//     setRejectingId(null);
//     setReasonInput('');
//   };

//   const filtered = requests.filter(r =>
//     filter === 'all' ? true : r.status === filter
//   );

//   const sorted = [...filtered].sort((a, b) => {
//     const da = new Date(a.date);
//     const db = new Date(b.date);
//     return sortAsc ? da - db : db - da;
//   });

//   const statusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-primary bg-gray-900';
//       case 'accepted': return 'bg-primary bg-gray-900';
//       case 'completed': return 'bg-primary bg-gray-900';
//       case 'rejected': return 'bg-primary bg-gray-900';
//       default: return 'bg-gray-600';
//     }
//   };

//   return (
//     <>
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-50 text-gray-900 px-8 py-14 md:px-20 lg:px-44">
//       <h1 className="text-3xl font-bold mb-8 text-center">Customer Requests</h1>

//       <div className="flex flex-wrap justify-between mb-6 gap-4">
//         <div className="flex gap-4">
//           {['all', 'pending', 'accepted', 'rejected'].map(f => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-2 py-1 md:px-4 md:py-2 rounded ${filter === f ? 'bg-primary text-white dark:bg-gray-800 dark:text-gray-50' : 'bg-white dark:bg-gray-50 dark:text-gray-900'}`}
//             >
//               {f.charAt(0).toUpperCase() + f.slice(1)}
//             </button>
//           ))}
//         </div>
//         <button
//           onClick={() => setSortAsc(!sortAsc)}
//           className="px-2 py-1 md:px-4 md:py-2 bg-white dark:bg-gray-50 dark:text-gray-900 rounded"
//         >
//           Sort by {sortAsc ? 'Oldest' : 'Newest'}
//         </button>
//       </div>

//       <div className="space-y-6">
//         {sorted.map(req => (
//           <div key={req.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-semibold">{req.name}</h2>
//                 <p className="text-sm text-gray-800">{req.title}</p>
//                 <p className="text-gray-400">{req.work} • {req.location}</p>
//                 <p className="text-gray-400 flex items-center gap-1">
//                   <Clock className="w-4 h-4" /> {dayjs(req.date).format('dddd, MMMM D [at] h:mm A')}
//                 </p>
//               </div>
//               <span className={`text-sm text-white px-3 py-2 rounded ${statusColor(req.status)}`}>
//                 {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
//               </span>
//             </div>

//             {req.status === 'pending' && (
//               <div className="flex gap-3 mt-4">
//                 <button
//                   onClick={() => handleAccept(req.id)}
//                   className="bg-primary dark:bg-gray-900 text-white px-4 py-2 rounded duration-300 hover:bg-[#1c394755] dark:hover:bg-primary"
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => handleRejectClick(req.id)}
//                   className="border border-gray-200 dark:border-gray-700 px-4 py-2 rounded duration-300 hover:bg-gray-700 hover:text-white"
//                 >
//                   Reject
//                 </button>
//               </div>
//             )}

//             {rejectingId === req.id && (
//               <div className="mt-4">
//                 <textarea
//                   rows="2"
//                   className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
//                   placeholder="Enter reason for rejection..."
//                   value={reasonInput}
//                   onChange={(e) => setReasonInput(e.target.value)}
//                 />
//                 <div className="flex gap-2 mt-2">
//                   <button
//                     onClick={() => handleReasonSubmit(req.id)}
//                     className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                   >
//                     Submit Reason
//                   </button>
//                   <button
//                     onClick={() => { setRejectingId(null); setReasonInput(''); }}
//                     className="px-3 py-1 rounded border border-gray-500 hover:bg-gray-700"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}

//             {req.status === 'rejected' && req.reason && (
//               <p className="text-sm text-red-400 mt-3">Reason: {req.reason}</p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//     <Footer/>
//     </>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import dayjs from 'dayjs';
import Footer from '../WorkerHomePage/Footer';

export default function WorkerRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortAsc, setSortAsc] = useState(true);
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
          Authorization: `Bearer ${token}`, // ✅ send token in header
        },
      });
      const data = await res.json();
      console.log(data)
      const formatted = data.data.map((item) => ({
        id: item._id, // use MongoDB _id
        name: `${item.customerFirstName} ${item.customerLastName}`,
        email: item.customerEmail,
        phone: item.phoneNumber,
        location: item.location,
        work: item.serviceWanted,
        date: item.timestamp,
        status: item.workerStatus,
        reason: '',
      }));

      setRequests(formatted);
    } catch (error) {
      console.error('Fetch error:', error);
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
      console.error('Accept failed:', result);
    }
  } catch (error) {
    console.error('Accept error:', error);
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
      console.error('Reject failed:', result);
    }
  } catch (error) {
    console.error('Reject error:', error);
  }
};
  const filtered = requests.filter(r =>
    filter === 'all' ? true : r.status === filter
  );

  const sorted = [...filtered].sort((a, b) => {
    const da = new Date(a.date);
    const db = new Date(b.date);
    return sortAsc ? da - db : db - da;
  });

  const statusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-primary bg-gray-900';
      case 'accepted': return 'bg-primary bg-gray-900';
      case 'completed': return 'bg-primary bg-gray-900';
      case 'rejected': return 'bg-primary bg-gray-900';
      default: return 'bg-gray-600';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-50 text-gray-900 px-8 py-14 md:px-20 lg:px-44">
        <h1 className="text-3xl font-bold mb-8 text-center">Customer Requests</h1>

        <div className="flex flex-wrap justify-between mb-6 gap-4">
          <div className="flex gap-4">
            {['all', 'pending', 'accepted', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-1 md:px-4 md:py-2 rounded ${filter === f ? 'bg-primary text-white dark:bg-gray-800 dark:text-gray-50' : 'bg-white dark:bg-gray-50 dark:text-gray-900'}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="px-2 py-1 md:px-4 md:py-2 bg-white dark:bg-gray-50 dark:text-gray-900 rounded"
          >
            Sort by {sortAsc ? 'Oldest' : 'Newest'}
          </button>
        </div>

        <div className="space-y-6">
          {sorted.map(req => (
            <div key={req.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{req.name}</h2>
                  <p className="text-sm text-gray-800">{req.email}</p>
                  <p className="text-gray-400">{req.work} • {req.location}</p>
                  <p className="text-gray-400 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {dayjs(req.date).format('dddd, MMMM D [at] h:mm A')}
                  </p>
                </div>
                <span className={`text-sm text-white px-3 py-2 rounded ${statusColor(req.status)}`}>
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>

              {req.status === 'pending' && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="bg-primary dark:bg-gray-900 text-white px-4 py-2 rounded duration-300 hover:bg-[#1c394755] dark:hover:bg-primary"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectClick(req.id)}
                    className="border border-gray-200 dark:border-gray-700 px-4 py-2 rounded duration-300 hover:bg-gray-700 hover:text-white"
                  >
                    Reject
                  </button>
                </div>
              )}

              {rejectingId === req.id && (
                <div className="mt-4">
                  <textarea
                    rows="2"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    placeholder="Enter reason for rejection..."
                    value={reasonInput}
                    onChange={(e) => setReasonInput(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleReasonSubmit(req.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Submit Reason
                    </button>
                    <button
                      onClick={() => { setRejectingId(null); setReasonInput(''); }}
                      className="px-3 py-1 rounded border border-gray-500 hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {req.status === 'rejected' && req.reason && (
                <p className="text-sm text-red-400 mt-3">Reason: {req.reason}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
