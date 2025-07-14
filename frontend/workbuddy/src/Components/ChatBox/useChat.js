import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

export default function useChat(chatRoomId, user) {
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!chatRoomId || !user?.email) return;

    // 1. Join the room
    socket.emit("joinRoom", {
      chatRoomId,
      email: user.email,
    });

    // 2. Fetch previous messages
    axios
      .get(`http://localhost:5000/api/auth/message/${chatRoomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const sorted = res.data.sort((a, b) => new Date(a.timestamp || a.createdAt) - new Date(b.timestamp || b.createdAt));
        setMessages(sorted);

        socket.emit("messageSeen", {
          chatRoomId,
          userEmail: user.email,
        });

        sorted.forEach((msg) => {
          if (msg.senderEmail !== user.email && msg.status === "sent") {
            socket.emit("messageDelivered", { messageId: msg._id });
          }
        });
      })
      .catch((err) => console.error("❌ Failed to load chat history", err));

    // 5. Listen for new messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message].sort((a, b) => new Date(a.timestamp || a.createdAt) - new Date(b.timestamp || b.createdAt)));


      // Auto-acknowledge delivery if not sent by self
      if (message.senderEmail !== user.email) {
        socket.emit("messageDelivered", { messageId: message._id });

        // Optionally emit seen again (to handle new messages)
        socket.emit("messageSeen", {
          chatRoomId,
          userEmail: user.email,
        });
      }
    });

    // 6. Typing status
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

  // ✍️ Emit typing status
  const emitTyping = () => {
    socket.emit("typing", {
      chatRoomId,
      userEmail: user.email,
    });
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
