// database.js - MongoDB connection configuration

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bugtracker';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('⚠️  WARNING: Server will start without database connection.');
    console.error('⚠️  Please ensure MongoDB is running on mongodb://localhost:27017');
    console.error('⚠️  API endpoints will fail until MongoDB is connected.');
    // Don't exit - allow server to start without DB for development
    // In production, you might want to exit
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    return null;
  }
};

module.exports = connectDB;






