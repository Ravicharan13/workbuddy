const Message = require("./models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 New client connected");

    socket.on("joinRoom", ({ roomId }) => {
      socket.join(roomId);
      console.log("Joined room:", roomId);
    });

    socket.on("sendMessage", async (msg) => {
      try {
        const newMsg = new Message(msg);
        await newMsg.save();
        io.to(msg.roomId).emit("receiveMessage", msg);
      } catch (err) {
        console.error("Message error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected");
    });
  });
};
