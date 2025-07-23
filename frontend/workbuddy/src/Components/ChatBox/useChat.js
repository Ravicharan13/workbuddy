import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axiosInstance from "../../axiosInstance";
import { SOCKET_URL } from "../../constants/constant";
 // Adjust as needed
// Global socket instance
const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});


export default function useChat(chatRoomId, user) {
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const messagesRef = useRef([]);

  

useEffect(() => {
  if (!chatRoomId || !user?.email) return;

  socket.emit("joinRoom", {
    chatRoomId,
    email: user.email,
  });

  axiosInstance.get(`/auth/message/${chatRoomId}`)
    .then((res) => {
      const sorted = res.data.sort((a, b) =>
        new Date(a.timestamp || a.createdAt) - new Date(b.timestamp || b.createdAt)
      );
      messagesRef.current = sorted;
      setMessages(sorted);

      socket.emit("messageSeen", { chatRoomId, userEmail: user.email });

      sorted.forEach((msg) => {
        if (msg.senderEmail !== user.email && msg.status === "sent") {
          socket.emit("messageDelivered", { messageId: msg._id });
        }
      });
    })
    .catch((err) => console.error("❌ Failed to load chat history", err));

  // 🧹 Clean existing listeners before binding
  socket.off("receiveMessage");
  socket.off("typing");
  socket.off("stopTyping");

  // 🧲 Bind
  socket.on("receiveMessage", (message) => {
    const updated = [...messagesRef.current, message].sort((a, b) =>
      new Date(a.timestamp || a.createdAt) - new Date(b.timestamp || b.createdAt)
    );
    messagesRef.current = updated;
    setMessages(updated);

    if (message.senderEmail !== user.email) {
      socket.emit("messageDelivered", { messageId: message._id });
      socket.emit("messageSeen", { chatRoomId, userEmail: user.email });
    }
  });

  socket.on("typing", (data) => {
    if (data.userEmail !== user.email) {
      setTypingUser(data.userEmail);
    }
  });

  socket.on("stopTyping", () => setTypingUser(null));

  return () => {
    socket.off("receiveMessage");
    socket.off("typing");
    socket.off("stopTyping");
  };
}, [chatRoomId, user?.email]);


  // Emit typing event
  const emitTyping = () => {
    socket.emit("typing", {
      chatRoomId,
      userEmail: user.email,
    });
  };

  // Send message
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
