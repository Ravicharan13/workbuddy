import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ChatSidebar({ onSelectChat, userRole }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("http://localhost:5000/api/auth/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data);
    };
    fetchChats();
  }, []);

  return (
    <div className="w-[300px] bg-gray-50 dark:bg-gray-800 border-r overflow-y-auto">
      <div className="p-4 font-semibold text-lg">Chats</div>
      {conversations.map((chat) => (
        <div
          key={chat.chatRoomId}
          onClick={() => onSelectChat(chat)}
          className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border"
        >
          <div className="flex items-center gap-2">
            <img
              src={chat.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="font-medium">{chat.name}</div>
              <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
            </div>
            <div className="text-xs text-gray-400">{chat.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
