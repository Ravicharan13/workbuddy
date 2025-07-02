import React, { useState, useEffect } from 'react';
import socket from '../socket';

function ChatBox({ userId, userRole, receiverId, receiverRole }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.emit('join_room', { userId, role: userRole });
    socket.on('receive_message', (msg) => {
      if (
        (msg.senderId === userId && msg.receiverId === receiverId) ||
        (msg.senderId === receiverId && msg.receiverId === userId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off('receive_message');
  }, [userId, receiverId]);

  const handleSend = () => {
    if (message.trim() === '') return;
    socket.emit('send_message', {
      senderId: userId,
      senderRole: userRole,
      receiverId,
      receiverRole,
      content: message
    });
    setMessage('');
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.senderId === userId ? 'me' : 'them'}>
            {msg.content}
          </div>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default ChatBox;
