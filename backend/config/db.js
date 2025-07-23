const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

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
