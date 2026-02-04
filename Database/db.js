const mongoose = require("mongoose");

require("dotenv").config();

const dbConnectionString = process.env.DBSTRING;

const connectDB = async () => {
    try {
        console.log("Connecting to db......")
        await mongoose.connect(dbConnectionString)
        console.log("MongoDB connected Successfully");

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
}; 

module.exports = connectDB;
