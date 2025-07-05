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
  // New fields
  skills:     { type: [String], default: [] },  // Optional, defaults to empty array
  phone:      { type: String },                 // Optional
  location:   { type: String },                 // Optional
  name:       { type: String },                 // Optional, can be set later
  service:    { type: String },                 // Optional, separate from `services` array
  description:{ type: String }                  // Optional, profile bio or about text

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model("WorkerSignUp", workerSchema);
