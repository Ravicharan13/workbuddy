const Message = require("./models/Message");

module.exports = (io) => {
  const userSockets = {}; // Maps email to socket.id
  const typingTimers = {}; // Helps throttle typing indicators

  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    // Join chat room
    socket.on("joinRoom", ({ email, chatRoomId }) => {
      socket.join(chatRoomId);
      userSockets[email] = socket.id;
      console.log(`👤 ${email} joined room ${chatRoomId}`);
    });

    // Typing event
    socket.on("typing", ({ chatRoomId, userEmail }) => {
      socket.to(chatRoomId).emit("typing", { userEmail });

      if (typingTimers[userEmail]) {
        clearTimeout(typingTimers[userEmail]);
      }

      typingTimers[userEmail] = setTimeout(() => {
        socket.to(chatRoomId).emit("stopTyping");
        delete typingTimers[userEmail];
      }, 2000);
    });

    // Send message
    socket.on("sendMessage", async (data) => {
      try {
        const { chatRoomId, message, sender, senderEmail } = data;

        if (!chatRoomId || !message || !sender || !senderEmail) {
          console.warn("❌ Missing fields:", { chatRoomId, message, sender, senderEmail });
          return;
        }

        const newMessage = new Message({
          chatRoomId,
          message: message.trim(),
          sender,
          senderEmail,
          status: "sent",
        });

        await newMessage.save();
        console.log(`💾 Message saved from ${senderEmail} to room ${chatRoomId}`);

        // Emit the full saved message to all participants in the room
        io.to(chatRoomId).emit("receiveMessage", newMessage);
        io.emit("chatListNeedsRefresh");


      } catch (err) {
        console.error("❌ Message saving failed:", err.message);
      }
    });

    // Message delivered
    socket.on("messageDelivered", async ({ messageId }) => {
      try {
        await Message.findByIdAndUpdate(messageId, { status: "delivered" });
        console.log("📦 Message marked as delivered:", messageId);
      } catch (err) {
        console.error("❌ Delivery status update failed:", err.message);
      }
    });

    // Message seen
    socket.on("messageSeen", async ({ chatRoomId, userEmail }) => {
      try {
        const result = await Message.updateMany(
          {
            chatRoomId,
            senderEmail: { $ne: userEmail }, // only messages from other users
            status: { $ne: "seen" },
          },
          { $set: { status: "seen" } }
        );

        console.log(`👁️ Seen ${result.modifiedCount} messages in room ${chatRoomId}`);
      } catch (err) {
        console.error("❌ Seen status update failed:", err.message);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
};
