const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set!');
      console.error('Please set MONGODB_URI in your environment variables or .env file');
      // Don't exit immediately in production to allow logs to be seen
      if (process.env.NODE_ENV === 'production') {
        return Promise.reject(new Error('Missing MONGODB_URI environment variable'));
      } else {
        process.exit(1);
      }
    }
    
    console.debug('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of default 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Add connection error handler
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    // Add disconnection handler
    mongoose.connection.on('disconnected', () => {
      console.error('MongoDB disconnected. Attempting to reconnect...');
    });
    
    // Add reconnection handler
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit immediately in production to allow logs to be seen
    if (process.env.NODE_ENV === 'production') {
      throw error; // Let the calling code handle this
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
