// src/pages/ChatPage.js
import React, { useEffect, useState } from 'react';
import ChatBoxContainer from '../ChatBox/ChatBoxContainer';
import axios from 'axios';

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // 👤 Get logged-in user (customer or worker)
        const res1 = await axios.post("http://localhost:5000/api/auth/customer/getcustomer", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(res1.data);

        // 🎯 You can set the receiver manually or fetch based on request
        const res2 = await axios.get("http://localhost:5000/api/auth/getall"); // assuming one accepted request
        const accepted = res2.data.find(req => req.workerStatus === "accepted" && req.customerEmail === res1.data.email);

        if (accepted) {
          setReceiver({
            _id: accepted.workerId,
            role: "worker"
          });
        }

      } catch (err) {
        console.error("Error fetching chat data:", err.message);
      }
    };

    fetchChatInfo();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Messages</h2>
      {user && receiver ? (
        <ChatBoxContainer
          userId={user._id}
          userRole="customer"
          receiverId={receiver._id}
          receiverRole={receiver.role}
        />
      ) : (
        <p>Loading chat...</p>
      )}
    </div>
  );
}
