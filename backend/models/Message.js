

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatRoomId: { type: String, required: true }, // Link to workerCustomerRequest
  sender: {
    type: String, // "customer" or "worker"
    required: true,
  },
  senderEmail: { type: String, required: true },
  message: { type: String, required: true },
  status: {
  type: String,
  enum: ['sent', 'delivered', 'seen'],
  default: 'sent'
},
},{
  timestamps:true
});

module.exports = mongoose.model("Message", messageSchema);

