// Vercel serverless entry point
const { app } = require('./server');

// Export the Express app as a serverless function
module.exports = app;
