const mongoose = require("mongoose");

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
  skills: { type: [String], default: [] },           // Optional, defaults to empty array
  phone: { type: String },                           // Optional
  location: { type: String } 
}, { timestamps: true, toJSON: { virtuals: true },
  toObject: { virtuals: true } });

module.exports = mongoose.model("WorkerSignUp", workerSchema);
