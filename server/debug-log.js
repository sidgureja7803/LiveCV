/**
 * Enhanced debugging utilities for LiveCV server
 */

// Store the original console.debug
const originalDebug = console.debug;

// Enhance console.debug with timestamp and formatting
console.debug = function(...args) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [DEBUG]`;
  originalDebug(prefix, ...args);
};

// Add more detailed logging for errors
const originalError = console.error;
console.error = function(...args) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [ERROR]`;
  originalError(prefix, ...args);
  
  // Add stack trace for non-Error objects
  if (args.length > 0 && !(args[0] instanceof Error)) {
    const stack = new Error().stack.split('\n').slice(2).join('\n');
    originalError('Stack trace:', stack);
  }
};

// Export enhanced debugging functions
module.exports = {
  debug: console.debug,
  enhancedError: console.error
};
