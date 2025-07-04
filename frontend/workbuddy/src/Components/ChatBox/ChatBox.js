// src/components/ChatBox.js
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io("http://localhost:5000");

export default function ChatBox({ userId, userRole, receiverId, receiverRole, roomId }) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Join the room
    socket.emit('joinRoom', { roomId });

    // Fetch previous messages
    axios.get(`http://localhost:5000/api/messages/${roomId}`)
      .then(res => setMessages(res.data))
      .catch(err => console.log("Failed to load messages", err));

    // Receive new messages
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off('receiveMessage');
  }, [roomId]);

  const sendMessage = () => {
    if (text.trim() === '') return;

    const message = {
      roomId,
      senderId: userId,
      senderRole: userRole === "customer" ? "Customer" : "Worker",
      text,
    };

    socket.emit('sendMessage', message);
    setText('');
  };

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc' }}>
      <h3>Chat Room</h3>
      <div style={{ height: '250px', overflowY: 'auto', border: '1px solid #eee', marginBottom: '10px' }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.senderId === userId ? "You" : msg.senderRole}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={text}
        placeholder="Type message..."
        onChange={(e) => setText(e.target.value)}
        style={{ width: '80%', marginRight: '5px' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
