import React, { useState, useRef, useEffect } from "react";
import { format, isToday, isYesterday } from "date-fns";
import useChat from "./useChat";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import {SendHorizontal} from "lucide-react"
 
export default function ChatRoom({ chatRoomId, user }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, typingUser, emitTyping } = useChat(chatRoomId, user);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef();

  // Format message time
  function formatTime(timestamp) {
    if (!timestamp || isNaN(new Date(timestamp))) {
      return "Unknown time";
    }
    return format(new Date(timestamp), "p");
  }

  // Scroll to latest message
  useEffect(() => {
  const el = messagesEndRef.current;
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);
useEffect(() => {
  console.log("🔄 Messages updated:", messages);
}, [messages]);



  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach((msg) => {
      const date = new Date(msg.timestamp || msg.createdAt);
      let label = isToday(date)
        ? "Today"
        : isYesterday(date)
        ? "Yesterday"
        : format(date, "MMMM dd, yyyy");
      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(msg);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);
  console.log("g",groupedMessages)

  // Send message
  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full border rounded-sm  p-4 bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
      <div className="overflow-y-auto scroll-smooth mb-4 space-y-4 pr-2">
        {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
          <div key={dateLabel}>
            <div className="text-center text-sm text-gray-800 dark:text-gray-50 mt-6 my-1">{dateLabel}</div>
            {msgs.map((msg, idx) => (
                <div
                  key={idx}
                  className={`break-words pl-2 py-1 rounded-sm my-2 w-fit max-w-[80%] ${
                    msg.senderEmail === user.email
                      ? "ml-auto bg-gray-800 text-white"
                      : "mr-auto bg-gray-200 text-black dark:bg-gray-300"
                  }`}
                >
                  <div className="text-xs">{msg.message}</div>
                  <div className="text-xs mt-1 opacity-80 flex justify-between items-center">
                    <span className="text-[10px]">{msg.sender}</span>
                    <span className="px-4 text-[10px]">
                      {formatTime(msg.timestamp || msg.createdAt)}{" "}
                      {msg.senderEmail === user.email &&
                        (msg.status === "seen"
                          ? <FontAwesomeIcon icon={faCheckDouble} className="pl-1" />
                          : msg.status === "delivered"
                          ? <FontAwesomeIcon icon={faCheck} />
                          : <FontAwesomeIcon icon={faCheck} />)}
                    </span>
                  </div>
                </div>
              ))}

          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {typingUser && typingUser !== user.email && (
        <div className="text-sm italic text-gray-500 mb-2">{typingUser} is typing...</div>
      )}

      {/* Typing input section */}
      <div className="flex gap-2 mt-auto">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Type your message..."
          className="w-full px-3 py-2 border-2 rounded-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-600 dark:bg-gray-900 border-gray-300 dark:border-gray-800 placeholder:text-sm placeholder:uppercase"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            emitTyping();
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-sm duration-300"
          onClick={handleSend}
        >
          <SendHorizontal />
        </button>
      </div>
    </div>
  );
}
