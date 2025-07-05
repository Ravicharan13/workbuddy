// ChatBoxContainer.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatBox from './ChatBox';

export default function ChatBoxContainer({ userId, userRole, receiverId, receiverRole }) {
  const [canChat, setCanChat] = useState(false);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const checkChat = async () => {
      const customerId = userRole === 'customer' ? userId : receiverId;
      const workerId = userRole === 'customer' ? receiverId : userId;

      try {
        const res = await axios.get(`http://localhost:5000/api/auth/messages/chat-status/${customerId}/${workerId}`);
        if (res.data.canChat) {
          setCanChat(true);
          setRoomId(res.data.chatRoomId);
        }
      } catch (error) {
        console.log("Chat not allowed:", error.message);
      }
    };

    checkChat();
  }, [userId, receiverId]);

  return canChat ? (
    <ChatBox
      userId={userId}
      userRole={userRole}
      receiverId={receiverId}
      receiverRole={receiverRole}
      roomId={roomId}
    />
  ) : (
    <p>Chat will be available after request is accepted.</p>
  );
}
