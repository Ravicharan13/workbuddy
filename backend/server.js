const express=require("express")
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");

const port =5000
const app=express()
app.use(express.json())
dotenv.config()
connectDB();
app.use(cors());


app.use("/api/auth", authRoutes);

app.listen(port,()=>{
    console.log("server is running on port ",port)
})

