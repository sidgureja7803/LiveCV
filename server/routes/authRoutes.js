const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Auth routes
router.post('/signup', authController.signup);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/login', authController.login);
router.get('/me', verifyToken, authController.getCurrentUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Legacy Clerk routes - can be removed later
router.post('/clerk-webhook', async (req, res) => {
  try {
    // Respond with success but don't do anything
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Clerk webhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing error' });
  }
});

module.exports = router;