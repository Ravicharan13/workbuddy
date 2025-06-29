const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstname:    { type: String, required: true },
  lastname: { type: String, required: true },
  service: { type: String },
  username: { type: String, required: true },
  password: { type: String, required: true },
  // New fields
  skills: { type: [String], default: [] },           // Optional, defaults to empty array
  phone: { type: String },                           // Optional
  location: { type: String } 
}, { timestamps: true, toJSON: { virtuals: true },
  toObject: { virtuals: true } });

module.exports = mongoose.model("WorkerSignUp", workerSchema);
