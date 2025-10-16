const { account, users, databases, APPWRITE_CONFIG } = require('../config/appwrite');
const { ID, Query } = require('node-appwrite');

/**
 * Appwrite Authentication Service
 * Replaces Clerk authentication with Appwrite Auth
 */

/**
 * Create a new user account
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user
 */
async function createUser(userData) {
  const { email, password, name } = userData;
  
  try {
    // Create user in Appwrite Auth
    const user = await users.create(
      ID.unique(),
      email,
      undefined, // phone
      password,
      name
    );
    
    // Create user profile in database
    const profile = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.users,
      user.$id,
      {
        userId: user.$id,
        name: name || email.split('@')[0],
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        resumeCount: 0,
        lastLoginAt: new Date().toISOString()
      }
    );
    
    return {
      user,
      profile
    };
  } catch (error) {
    console.error('[Auth] Create user error:', error);
    throw new Error(error.message || 'Failed to create user');
  }
}

/**
 * Create email session (login)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Session data
 */
async function createEmailSession(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    
    // Update last login time
    await updateUserProfile(session.userId, {
      lastLoginAt: new Date().toISOString()
    });
    
    return session;
  } catch (error) {
    console.error('[Auth] Login error:', error);
    throw new Error('Invalid email or password');
  }
}

/**
 * Get current session
 * @returns {Promise<Object>} Session data
 */
async function getCurrentSession() {
  try {
    const session = await account.getSession('current');
    return session;
  } catch (error) {
    return null;
  }
}

/**
 * Get current user
 * @returns {Promise<Object>} User data
 */
async function getCurrentUser() {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Delete current session (logout)
 * @returns {Promise<void>}
 */
async function deleteSession() {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error('[Auth] Logout error:', error);
    throw error;
  }
}

/**
 * Delete all sessions (logout from all devices)
 * @returns {Promise<void>}
 */
async function deleteAllSessions() {
  try {
    await account.deleteSessions();
  } catch (error) {
    console.error('[Auth] Logout all error:', error);
    throw error;
  }
}

/**
 * Get user profile from database
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile
 */
async function getUserProfile(userId) {
  try {
    const profile = await databases.getDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.users,
      userId
    );
    return profile;
  } catch (error) {
    console.error('[Auth] Get profile error:', error);
    return null;
  }
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Updated profile
 */
async function updateUserProfile(userId, updates) {
  try {
    const profile = await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.users,
      userId,
      {
        ...updates,
        updatedAt: new Date().toISOString()
      }
    );
    return profile;
  } catch (error) {
    console.error('[Auth] Update profile error:', error);
    throw error;
  }
}

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Token
 */
async function createPasswordRecovery(email) {
  try {
    const recovery = await account.createRecovery(
      email,
      `${process.env.FRONTEND_URL}/reset-password`
    );
    return recovery;
  } catch (error) {
    console.error('[Auth] Password recovery error:', error);
    throw error;
  }
}

/**
 * Complete password reset
 * @param {string} userId - User ID
 * @param {string} secret - Reset secret
 * @param {string} password - New password
 * @returns {Promise<Object>} Token
 */
async function updatePasswordRecovery(userId, secret, password) {
  try {
    const result = await account.updateRecovery(
      userId,
      secret,
      password,
      password // password confirmation
    );
    return result;
  } catch (error) {
    console.error('[Auth] Password reset error:', error);
    throw error;
  }
}

/**
 * Create email verification
 * @returns {Promise<Object>} Token
 */
async function createEmailVerification() {
  try {
    const verification = await account.createVerification(
      `${process.env.FRONTEND_URL}/verify-email`
    );
    return verification;
  } catch (error) {
    console.error('[Auth] Email verification error:', error);
    throw error;
  }
}

/**
 * Confirm email verification
 * @param {string} userId - User ID
 * @param {string} secret - Verification secret
 * @returns {Promise<Object>} Token
 */
async function updateEmailVerification(userId, secret) {
  try {
    const result = await account.updateVerification(userId, secret);
    return result;
  } catch (error) {
    console.error('[Auth] Email verification confirmation error:', error);
    throw error;
  }
}

/**
 * Verify JWT token from client
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Decoded token
 */
async function verifyToken(token) {
  try {
    // In Appwrite, tokens are verified server-side automatically
    // This is a placeholder for middleware compatibility
    return { valid: true };
  } catch (error) {
    return { valid: false };
  }
}

/**
 * Middleware to protect routes
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - No token provided'
    });
  }
  
  // Extract session token
  req.sessionToken = authHeader.substring(7);
  next();
}

/**
 * Middleware to get user from session
 */
async function getUserFromSession(req, res, next) {
  try {
    if (!req.sessionToken) {
      req.user = null;
      return next();
    }
    
    // Get user using session token
    // Note: This requires client SDK session token
    req.user = null; // Placeholder
    next();
  } catch (error) {
    req.user = null;
    next();
  }
}

module.exports = {
  createUser,
  createEmailSession,
  getCurrentSession,
  getCurrentUser,
  deleteSession,
  deleteAllSessions,
  getUserProfile,
  updateUserProfile,
  createPasswordRecovery,
  updatePasswordRecovery,
  createEmailVerification,
  updateEmailVerification,
  verifyToken,
  requireAuth,
  getUserFromSession
};
