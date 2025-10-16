const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

/**
 * Middleware to verify JWT tokens
 */
exports.verifyToken = async (req, res, next) => {
  try {
    // Get token from header or cookies
    const bearerHeader = req.headers['authorization'];
    const cookieToken = req.cookies?.token;
    
    let token;
    if (bearerHeader) {
      // Format: "Bearer token"
      const bearer = bearerHeader.split(' ');
      token = bearer[1];
    } else if (cookieToken) {
      token = cookieToken;
    }
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user by ID
    const user = await userService.getUserById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Attach user to request object
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

/**
 * Middleware to get user from session if available (non-blocking)
 */
exports.getUser = async (req, res, next) => {
  try {
    // Get token from header or cookies
    const bearerHeader = req.headers['authorization'];
    const cookieToken = req.cookies?.token;
    
    let token;
    if (bearerHeader) {
      // Format: "Bearer token"
      const bearer = bearerHeader.split(' ');
      token = bearer[1];
    } else if (cookieToken) {
      token = cookieToken;
    }
    
    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user by ID
        const user = await userService.getUserById(decoded.id);
        
        if (user) {
          // Attach user to request object
          req.user = user;
        }
      } catch (tokenError) {
        // Invalid token, but we'll continue the request
        console.log('Token verification failed in getUser middleware');
      }
    }
    
    // Continue regardless of user auth status
    next();
  } catch (error) {
    // Continue even if there's an error
    next();
  }
};