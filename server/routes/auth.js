const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

/**
 * Authentication Routes using Appwrite
 * Replaces Clerk authentication
 */

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long'
      });
    }
    
    const result = await authService.createUser({ email, password, name });
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: result.user.$id,
        email: result.user.email,
        name: result.user.name
      }
    });
  } catch (error) {
    console.error('[Auth Route] Register error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create user'
    });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    const session = await authService.createEmailSession(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      session: {
        userId: session.userId,
        sessionId: session.$id,
        expire: session.expire
      }
    });
  } catch (error) {
    console.error('[Auth Route] Login error:', error);
    res.status(401).json({
      success: false,
      error: error.message || 'Invalid credentials'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout current session
 */
router.post('/logout', async (req, res) => {
  try {
    await authService.deleteSession();
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('[Auth Route] Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to logout'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', authService.requireAuth, async (req, res) => {
  try {
    const user = await authService.getCurrentUser();
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }
    
    const profile = await authService.getUserProfile(user.$id);
    
    res.status(200).json({
      success: true,
      user: {
        id: user.$id,
        email: user.email,
        name: user.name,
        profile
      }
    });
  } catch (error) {
    console.error('[Auth Route] Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user'
    });
  }
});

/**
 * PUT /api/auth/profile
 * Update user profile
 */
router.put('/profile', authService.requireAuth, async (req, res) => {
  try {
    const user = await authService.getCurrentUser();
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }
    
    const updates = req.body;
    const profile = await authService.updateUserProfile(user.$id, updates);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('[Auth Route] Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }
    
    await authService.createPasswordRecovery(email);
    
    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('[Auth Route] Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send reset email'
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { userId, secret, password } = req.body;
    
    if (!userId || !secret || !password) {
      return res.status(400).json({
        success: false,
        error: 'userId, secret, and password are required'
      });
    }
    
    await authService.updatePasswordRecovery(userId, secret, password);
    
    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('[Auth Route] Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password'
    });
  }
});

/**
 * POST /api/auth/verify-email
 * Send email verification
 */
router.post('/verify-email', authService.requireAuth, async (req, res) => {
  try {
    await authService.createEmailVerification();
    
    res.status(200).json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    console.error('[Auth Route] Verify email error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send verification email'
    });
  }
});

/**
 * PUT /api/auth/verify-email
 * Confirm email verification
 */
router.put('/verify-email', async (req, res) => {
  try {
    const { userId, secret } = req.body;
    
    if (!userId || !secret) {
      return res.status(400).json({
        success: false,
        error: 'userId and secret are required'
      });
    }
    
    await authService.updateEmailVerification(userId, secret);
    
    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('[Auth Route] Confirm verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify email'
    });
  }
});

module.exports = router;
