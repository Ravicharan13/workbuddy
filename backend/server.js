const express=require("express")
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");


const port =5000
const app=express()
app.use(express.json())
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: 'http://localhost:3000' } });
dotenv.config()
connectDB();
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true                
}));

require('./socket')(io);


app.use("/api/auth", authRoutes);

app.listen(port,()=>{
    console.log("server is running on port ",port)
})

