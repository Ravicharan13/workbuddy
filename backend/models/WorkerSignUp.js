const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstname:    { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("WorkerSignUp", workerSchema);
