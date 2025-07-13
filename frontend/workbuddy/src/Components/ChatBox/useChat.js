import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

export default function useChat(chatRoomId, user) {
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null); // ✅ Typing user
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!chatRoomId || !user?.email) return;

    // 1. Join the chat room
    socket.emit("joinRoom", {
      chatRoomId,
      email: user.email,
    });

    // 2. Fetch chat history
    axios
      .get(`http://localhost:5000/api/auth/message/${chatRoomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to load chat history", err));

    // 3. Listen for new messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // 4. Listen for typing indicator
    socket.on("typing", (data) => {
      if (data.userEmail !== user.email) {
        setTypingUser(data.userEmail);
      }
    });

    socket.on("stopTyping", () => {
      setTypingUser(null);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [chatRoomId, user?.email]);

  // ✍️ Emit typing signal
  const emitTyping = () => {
    socket.emit("typing", {
      chatRoomId,
      userEmail: user.email,
    });

    // Optional: throttle with setTimeout on frontend
  };

  // 💬 Send message
  const sendMessage = (msg) => {
    if (!msg.trim()) return;

    socket.emit("sendMessage", {
      chatRoomId,
      message: msg,
      sender: user.role,
      senderEmail: user.email,
    });
  };

  return {
    messages,
    sendMessage,
    typingUser,
    emitTyping,
  };
}
