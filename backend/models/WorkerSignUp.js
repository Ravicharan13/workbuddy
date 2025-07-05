const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});


const workerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstname:    { type: String, required: true },
  lastname: { type: String, required: true },
  services: { type: [String],default: [] },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetCode: { type: String },
  resetCodeExpires: { type: Date },
  resetCodeVerified : {type: Boolean},
  dob: { type: Date },

  gender: {
    type: String,
    enum: ['male', 'female'],
    required: false
  },
  avatar: {
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



  // New fields
  skills:     { type: [String], default: [] },  // Optional, defaults to empty array
  phone:      { type: String },                 // Optional
  location:   { type: String },                 // Optional                // Optional, separate from `services` array
  description:{ type: String }                  // Optional, profile bio or about text

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model("WorkerSignUp", workerSchema);
