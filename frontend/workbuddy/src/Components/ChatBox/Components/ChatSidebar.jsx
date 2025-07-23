import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../axiosInstance";
import { format, isToday, isYesterday } from "date-fns";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../../../constants/constant";

export default function ChatSidebar({ onSelectChat, userRole }) {
  const [conversations, setConversations] = useState([]);
  const socketRef = useRef(null);

  const fetchChats = async () => {
    try {
      const res = await axiosInstance.get("/auth/chats");
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to fetch chats", err);
    }
  };

  useEffect(() => {
    fetchChats(); // initial fetch

    // Initialize socket only once
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    // ✅ Listener for new messages
    socket.on("receiveMessage", (newMessage) => {
      setConversations((prev) => {
        const updated = prev.map((chat) => {
          if (chat.chatRoomId === newMessage.chatRoomId) {
            return {
              ...chat,
              lastMessage: newMessage.message,
              lastMessageAt: newMessage.createdAt,
            };
          }
          return chat;
        });

        // ⚠️ If chat is not found, refetch all
        const exists = updated.find(
          (c) => c.chatRoomId === newMessage.chatRoomId
        );
        if (!exists) {
          fetchChats(); // fallback
        }

        return updated;
      });
    });
    socket.on("chatListNeedsRefresh", fetchChats);


    return () => {
      socket.disconnect();
    };
  }, []);

  const formatLastMessageTime = (time) => {
    if (!time) return "";
    const date = new Date(time);
    if (isToday(date)) return format(date, "hh:mm a");
    if (isYesterday(date)) return "Yesterday";
    return format(date, "dd/MM/yyyy");
  };

  return (
    <div className="w-full h-full md:w-[350px] bg-white dark:text-gray-50 dark:bg-gray-900 border dark:border-gray-800 overflow-y-auto">
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
