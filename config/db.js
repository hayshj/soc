require('dotenv').config();

const mongoose = require('mongoose');
const db = process.env.MONGO_URI;

mongoose.set("strictQuery", true, "userNewUrlParser", true);

const connectDB = async () => {
    try{
        await mongoose.connect(db);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;