import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatBox from './ChatBox';

function ChatBoxContainer({ userId, userRole, receiverId, receiverRole }) {
  const [canChat, setCanChat] = useState(false);

  useEffect(() => {
    const checkChat = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/messages/chat-status/${userRole === 'customer' ? userId : receiverId}/${userRole === 'customer' ? receiverId : userId}`
      );
      setCanChat(res.data.canChat);
    };
    checkChat();
  }, [userId, receiverId]);

  return canChat ? (
    <ChatBox
      userId={userId}
      userRole={userRole}
      receiverId={receiverId}
      receiverRole={receiverRole}
    />
  ) : (
    <p>Chat will be available after request is accepted.</p>
  );
}

export default ChatBoxContainer;
