require("./time")
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes")
const http = require('http');
const socketIO = require('socket.io');
const cookieParser = require("cookie-parser");

const allowedOrigins = [
  "http://localhost:3000", // for local dev
  "https://workbuddy-frontend.onrender.com" // replace with actual frontend Render domain
];

// Config
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(cookieParser());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

// Attach socket handlers
require('./socket')(io);

// Routes
app.use("/api/auth", authRoutes)

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("✅ Server is running on port", PORT);
});
