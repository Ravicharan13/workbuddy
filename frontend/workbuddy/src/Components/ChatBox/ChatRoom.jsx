import React, { useState, useRef, useEffect } from "react";
import { format, isToday, isYesterday } from 'date-fns';
import useChat from "./useChat";

export default function ChatRoom({ chatRoomId, user }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, typingUser, emitTyping } = useChat(chatRoomId, user);
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach((msg) => {
      const date = new Date(msg.timestamp);
      let label = "";
      if (isToday(date)) label = "Today";
      else if (isYesterday(date)) label = "Yesterday";
      else label = format(date, "MMMM dd, yyyy");
      if (!grouped[label]) grouped[label] = [];
      grouped[label].push(msg);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full border rounded-sm shadow-lg p-4 bg-gray-50 dark:bg-gray-800">
      <div className="flex-1 overflow-y-auto scroll-smooth mb-4 space-y-4">
        {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
          <div key={dateLabel}>
            <div className="text-center text-sm text-gray-500 my-2">{dateLabel}</div>
            {msgs.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[15%] px-2 py-1 rounded-sm my-2 ${
                  msg.senderEmail === user.email
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-gray-300 text-black"
                }`}
              >
                <div>{msg.message}</div>
                <div className="text-xs mt-0 opacity-70 flex justify-between items-center">
                  <span>{msg.sender}</span>
                  <span className="ml-0 text-right">
                    {format(new Date(msg.timestamp), "hh:mm a")}{" "}
                    {msg.senderEmail === user.email && (
                      <>
                        {" "}
                        {/* Add message status (mock for now) */}
                        {msg.status === "seen"
                          ? "✅✅"
                          : msg.status === "delivered"
                          ? "✅"
                          : "🕓"}
                      </>
                    )}
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

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            emitTyping(); // emit typing signal
          }}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
