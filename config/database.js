const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.warn('MongoDB connection failed - running in demo mode');
    // Không exit để cho app tiếp tục chạy cho demo
  }
};

module.exports = connectDB;
