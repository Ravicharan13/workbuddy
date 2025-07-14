
import React, { useState,useEffect } from "react";
import ChatSidebar from "../Components/ChatSidebar";
import ChatWindow from "../Components/ChatWindow";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function WorkerChatPage() {
  const [activeChat, setActiveChat] = useState(null);
  const { chatRoomId } = useParams();
  useEffect(() => {
    if (chatRoomId) {
      const token = localStorage.getItem("accessToken");
      axios
        .get("http://localhost:5000/api/auth/chats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const found = res.data.find((chat) => chat.chatRoomId === chatRoomId);
          if (found) {
            setActiveChat(found);
          }
        });
    }
  }, [chatRoomId]);

  return (
    <div className="h-[91vh] md:h-[95vh] lg:h-[92vh] bg-gray-100 dark:bg-gray-900">
      {/* Desktop layout */}
      <div className="hidden md:flex h-full">
        <ChatSidebar onSelectChat={setActiveChat} userRole="worker" />
        <div className="flex-1">
          {activeChat ? (
            <ChatWindow chatRoom={activeChat} userRole="worker" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden h-full">
        {!activeChat ? (
          <ChatSidebar onSelectChat={setActiveChat} userRole="worker" />
        ) : (
          <ChatWindow chatRoom={activeChat} userRole="worker" onBack={() => setActiveChat(null)} />
        )}
      </div>
    </div>
  );
}
