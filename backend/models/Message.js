const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: mongoose.Schema.Types.ObjectId,
  senderRole: { type: String, enum: ['customer', 'worker'] },
  receiverId: mongoose.Schema.Types.ObjectId,
  receiverRole: { type: String, enum: ['customer', 'worker'] },
  content: String,
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Message', messageSchema);