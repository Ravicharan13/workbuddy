const Message = require('./models/Message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', ({ userId, role }) => {
      socket.join(`${role}_${userId}`);
    });

    socket.on('send_message', async ({ senderId, senderRole, receiverId, receiverRole, content }) => {
      const newMessage = await Message.create({ senderId, senderRole, receiverId, receiverRole, content });
      io.to(`${receiverRole}_${receiverId}`).emit('receive_message', newMessage);
      io.to(`${senderRole}_${senderId}`).emit('receive_message', newMessage);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};