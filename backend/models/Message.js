// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//   roomId: {
//     type: String,
//     required: true,
//   },
//   senderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     refPath: "senderRole", // Can be 'Worker' or 'Customer'
//   },
//   senderRole: {
//     type: String,
//     enum: ["Worker", "Customer"],
//     required: true,
//   },
//   text: {
//     type: String,
//     required: true,
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Message", messageSchema);

// models/Message.js

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

  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);

