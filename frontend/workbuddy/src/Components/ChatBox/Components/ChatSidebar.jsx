import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, isToday, isYesterday } from "date-fns";

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

  const formatLastMessageTime = (time) => {
    if (!time) return "";
    const date = new Date(time);
    if (isToday(date)) return format(date, "hh:mm a");
    if (isYesterday(date)) return "Yesterday";
    return format(date, "dd/MM/yyyy");
  };

  return (
    <div className="w-full md:w-[300px] bg-white dark:text-gray-50 dark:bg-gray-900 border dark:border-gray-800 overflow-y-auto">
      <div className="p-4 font-semibold text-lg">Chats</div>
      {conversations.map((chat) => (
        <div
          key={chat.chatRoomId}
          onClick={() => onSelectChat(chat)}
          className="p-3 cursor-pointer dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-y"
        >
          <div className="flex items-center gap-2">
            <img
              src={chat.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="font-medium">{chat.name}</div>
              <div className="text-sm text-gray-500 truncate">
                {chat.lastMessage
                ? chat.lastMessage.length > 20
                  ? chat.lastMessage.slice(0, 20) + "..."
                  : chat.lastMessage
                : "No messages yet"}
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {formatLastMessageTime(chat.lastMessageAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
