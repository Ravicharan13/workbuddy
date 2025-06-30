const mongoose = require("mongoose");

const workerRequestSchema = new mongoose.Schema({
  customerEmail: {
    type: String,
    required: true,
  },
  customerFirstName: {
    type: String,
    required: true,
  },
  customerLastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  serviceWanted: {
    type: String,
    required: true,
  },
  workerStatus: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending",
  },
  workerEmail: { type: String, requird:true },
  workerFirstName: { type: String, required:true },
  workerLastName: { type: String, required:true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", default: null },
  rejectReason: { type: String, default:null },
  chatRoomId: {
    type: String, 
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("WorkerCustomerRequest", workerRequestSchema);
