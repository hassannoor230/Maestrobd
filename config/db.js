const mongoose = require('mongoose');

let cachedConn = null;

const connectDB = async () => {
  if (cachedConn && mongoose.connection.readyState === 1) {
    return cachedConn;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI || mongoURI.includes('<') || mongoURI.includes('<password>') || mongoURI.includes('<username>')) {
    console.warn('MONGODB_URI not configured. Using in-memory storage.');
    return null;
  }

  try {
    await mongoose.connect(mongoURI);
    cachedConn = mongoose.connection;
    console.log('MongoDB connected');
    return cachedConn;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    return null;
  }
};

module.exports = connectDB;
