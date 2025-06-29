const mongoose = require('mongoose');

const uri = "mongodb+srv://charan:CHARAN1201@workbuddy.m8yscot.mongodb.net/?retryWrites=true&w=majority&appName=WORKBUDDY";

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "workbuddy" // optional, explicit database name
        });
        console.log("✅ Connection successful..!");
    } catch (e) {
        console.error("❌ MongoDB connection error:", e.message);
        process.exit(1); // optional: exit process if connection fails
    }
};

module.exports = connectDB;
