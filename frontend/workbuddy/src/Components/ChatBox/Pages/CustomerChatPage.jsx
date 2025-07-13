import React, { useState } from "react";
import ChatSidebar from "../Components/ChatSidebar";
import ChatWindow from "../Components/ChatWindow";

export default function WorkerChatPage() {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
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
  );
}
