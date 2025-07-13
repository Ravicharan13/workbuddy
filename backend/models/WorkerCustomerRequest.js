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
  customerPhoneNumber: {
    type: String,
    required: true,
  },
  customerLocation: {
    type: String,
    required: true,
  },
  serviceWanted: {
    type: String,
    required: true,
  },
  workerPhoneNumber: {
    type: String,
    required: true,
  },
  scheduleDate: { type: Date, required: true }, // only the day (from DatePicker)
  timeSlot: { type: String, required: true },
  workerStatus: {
    type: String,
    enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
    default: "pending"
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
  requestSentAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("WorkerCustomerRequest", workerRequestSchema);
