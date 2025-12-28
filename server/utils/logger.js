/**
 * Structured Logging Utility
 * Provides consistent logging format with timestamps, request IDs, and log levels
 */

const crypto = require('crypto');

// Log levels
const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

// ANSI color codes for console output
const COLORS = {
  DEBUG: '\x1b[36m', // Cyan
  INFO: '\x1b[32m',  // Green
  WARN: '\x1b[33m',  // Yellow
  ERROR: '\x1b[31m', // Red
  RESET: '\x1b[0m'
};

/**
 * Generate a unique request ID
 */
function generateRequestId() {
  return crypto.randomBytes(8).toString('hex');
}

/**
 * Sanitize data to remove sensitive information
 */
function sanitizeData(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  const sensitiveKeys = [
    'password',
    'token',
    'apiKey',
    'api_key',
    'secret',
    'authorization',
    'cookie',
    'session'
  ];
  
  const sanitized = Array.isArray(data) ? [...data] : { ...data };
  
  for (const key in sanitized) {
    const lowerKey = key.toLowerCase();
    
    // Check if key contains sensitive information
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  }
  
  return sanitized;
}

/**
 * Format log message with timestamp and metadata
 */
function formatLogMessage(level, message, metadata = {}) {
  const timestamp = new Date().toISOString();
  const color = COLORS[level] || COLORS.RESET;
  const reset = COLORS.RESET;
  
  // Sanitize metadata
  const sanitizedMetadata = sanitizeData(metadata);
  
  // Build log object
  const logObject = {
    timestamp,
    level,
    message,
    ...sanitizedMetadata
  };
  
  // Console output with colors
  const metadataStr = Object.keys(sanitizedMetadata).length > 0 
    ? `\n${JSON.stringify(sanitizedMetadata, null, 2)}`
    : '';
  
  const consoleMessage = `${color}[${timestamp}] [${level}]${reset} ${message}${metadataStr}`;
  
  return {
    consoleMessage,
    logObject
  };
}

/**
 * Log at DEBUG level
 */
function debug(message, metadata = {}) {
  if (process.env.NODE_ENV === 'production') {
    return; // Skip debug logs in production
  }
  
  const { consoleMessage } = formatLogMessage(LOG_LEVELS.DEBUG, message, metadata);
  console.log(consoleMessage);
}

/**
 * Log at INFO level
 */
function info(message, metadata = {}) {
  const { consoleMessage } = formatLogMessage(LOG_LEVELS.INFO, message, metadata);
  console.log(consoleMessage);
}

/**
 * Log at WARN level
 */
function warn(message, metadata = {}) {
  const { consoleMessage } = formatLogMessage(LOG_LEVELS.WARN, message, metadata);
  console.warn(consoleMessage);
}

/**
 * Log at ERROR level
 */
function error(message, metadata = {}) {
  const { consoleMessage, logObject } = formatLogMessage(LOG_LEVELS.ERROR, message, metadata);
  console.error(consoleMessage);
  
  // In production, you might want to send errors to a logging service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to external logging service (e.g., Sentry, LogRocket)
  }
}

/**
 * Log HTTP request
 */
function logRequest(req, metadata = {}) {
  const requestId = req.requestId || generateRequestId();
  
  info('HTTP Request', {
    requestId,
    method: req.method,
    path: req.path,
    userId: req.user?.id || req.clerkId || 'anonymous',
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    ...metadata
  });
  
  return requestId;
}

/**
 * Log HTTP response
 */
function logResponse(req, res, duration, metadata = {}) {
  const level = res.statusCode >= 400 ? LOG_LEVELS.WARN : LOG_LEVELS.INFO;
  const message = `HTTP Response - ${res.statusCode}`;
  
  const logData = {
    requestId: req.requestId,
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    userId: req.user?.id || req.clerkId || 'anonymous',
    ...metadata
  };
  
  if (level === LOG_LEVELS.WARN) {
    warn(message, logData);
  } else {
    info(message, logData);
  }
}

/**
 * Log resume limit enforcement action
 */
function logResumeLimitEnforcement(userId, action, metadata = {}) {
  info('Resume Limit Enforcement', {
    userId,
    action,
    timestamp: new Date().toISOString(),
    ...metadata
  });
}

/**
 * Log authentication event
 */
function logAuthEvent(event, userId, metadata = {}) {
  info('Authentication Event', {
    event,
    userId,
    timestamp: new Date().toISOString(),
    ...metadata
  });
}

/**
 * Log PDF generation event
 */
function logPDFGeneration(resumeId, theme, duration, metadata = {}) {
  info('PDF Generation', {
    resumeId,
    theme,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
    ...metadata
  });
}

/**
 * Middleware to add request ID and logging to Express
 */
function requestLoggingMiddleware(req, res, next) {
  // Generate and attach request ID
  req.requestId = generateRequestId();
  
  // Log incoming request
  const startTime = Date.now();
  logRequest(req);
  
  // Capture response
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    logResponse(req, res, duration);
    originalSend.call(this, data);
  };
  
  next();
}

module.exports = {
  LOG_LEVELS,
  debug,
  info,
  warn,
  error,
  logRequest,
  logResponse,
  logResumeLimitEnforcement,
  logAuthEvent,
  logPDFGeneration,
  requestLoggingMiddleware,
  generateRequestId,
  sanitizeData
};
