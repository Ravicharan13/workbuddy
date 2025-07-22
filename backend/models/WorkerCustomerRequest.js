const mongoose = require("mongoose");

const workerRequestSchema = new mongoose.Schema({
  customerAvatar: {
    type: String,
    default: function () {
      // `this` refers to the document being created
      if (this.gender === 'female') {
        return 'https://res.cloudinary.com/dquha58yu/image/upload/v1751697562/female_m1dwf1.png';
      } else {
        return 'https://res.cloudinary.com/dquha58yu/image/upload/v1751697248/307ce493-b254-4b2d-8ba4-d12c080d6651_pty54f.jpg';
      }
    }
  },
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
  workerLocation: {
    type: String,
    required: true,
  },
  workerAvatar: {
    type: String,
    default: function () {
      // `this` refers to the document being created
      if (this.gender === 'female') {
        return 'https://res.cloudinary.com/dquha58yu/image/upload/v1751697562/female_m1dwf1.png';
      } else {
        return 'https://res.cloudinary.com/dquha58yu/image/upload/v1751697248/307ce493-b254-4b2d-8ba4-d12c080d6651_pty54f.jpg';
      }
    }
  },
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
