const Message = require("./models/Message");

module.exports = (io) => {
  const userSockets = {}; // Maps email to socket.id
  const typingTimers = {}; // Helps throttle typing status

  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    // User joins a specific chat room
    socket.on("joinRoom", ({ email, chatRoomId }) => {
      socket.join(chatRoomId);
      userSockets[email] = socket.id;
      console.log(`👤 ${email} joined room ${chatRoomId}`);
    });

    // Handle user typing
    socket.on("typing", ({ chatRoomId, userEmail }) => {
      // Broadcast to others in room
      socket.to(chatRoomId).emit("typing", { userEmail });

      // Clear old timeout if exists
      if (typingTimers[userEmail]) clearTimeout(typingTimers[userEmail]);

      // Emit stopTyping after 2 seconds of inactivity
      typingTimers[userEmail] = setTimeout(() => {
        socket.to(chatRoomId).emit("stopTyping");
        delete typingTimers[userEmail];
      }, 2000);
    });

    // Handle incoming message
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
        });

        await newMessage.save();
        console.log(`💾 Message saved from ${senderEmail} to room ${chatRoomId}`);

        // Send to all clients in room
        io.to(chatRoomId).emit("receiveMessage", newMessage);
      } catch (err) {
        console.error("❌ Message saving failed:", err.message);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
};
