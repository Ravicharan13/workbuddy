import React, { useState, useEffect } from "react";
import ChatSidebar from "../Components/ChatSidebar";
import ChatWindow from "../Components/ChatWindow";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";

export default function WorkerChatPage() {
  const [activeChat, setActiveChat] = useState(null);
  const { chatRoomId } = useParams();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect mobile resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchChat = async () => {
      if (!chatRoomId) return;

      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/auth/chats");
        const found = res.data.find(chat => chat.chatRoomId === chatRoomId);
        setActiveChat(found || null);
      } catch (err) {
        console.error("Failed to fetch chat:", err);
        setActiveChat(null);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [chatRoomId]);



  return (
    <>
    {loading &&  <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
        <span className="ml-3">Loading...</span>
      </div>}

    <div className="h-[91vh] md:h-[95vh] lg:h-[92vh] bg-gray-100 dark:bg-gray-900">
      <div className="flex h-full">
        {/* Sidebar */}
        {(!isMobile || !activeChat) && (
          <div className="w-full md:w-[300px] lg:w-[350px]">
            <ChatSidebar onSelectChat={setActiveChat} userRole="worker" />
          </div>
        )}

        {/* Chat window */}
        <div className="flex-1">
          {activeChat ? (
            <ChatWindow
              chatRoom={activeChat}
              userRole="worker"
              onBack={isMobile ? () => setActiveChat(null) : undefined}
            />
          ) : (
            !isMobile && (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a chat to start messaging
              </div>
            )
          )}
        </div>
      </div>
    </div>
    </>
    
  );
}
