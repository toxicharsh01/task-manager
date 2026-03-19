const mongoose = require("mongoose");

// Function to connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection error:", error);
  }
}

module.exports = connectDB;