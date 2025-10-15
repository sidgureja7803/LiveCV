const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const OTP = require('../models/otpModel');

// Helper function to log with timestamp
const logWithTimestamp = (message, data = null) => {
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[${timestamp}] ${message}`, data);
  } else {
    console.log(`[${timestamp}] ${message}`);
  }
};

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // This should be an App Password for Gmail
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  }
});

/**
 * Generate OTP for email verification
 * @param {String} email - User email
 * @returns {String} OTP
 */
const generateOTP = async (email) => {
  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
  
  // Log current time and expiry time for debugging
  logWithTimestamp(`Generating new OTP for ${email}`, {
    currentTime: new Date().toISOString(),
    expiryTime: expiryTime.toISOString(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  
  try {
    // Store OTP in MongoDB (upsert - update if exists, insert if not)
    const result = await OTP.findOneAndUpdate(
      { email },
      { 
        email, 
        code: otp, 
        expiry: expiryTime 
      },
      { upsert: true, new: true }
    );
    
    logWithTimestamp(`Generated new OTP for ${email}`, {
      otp: `${otp.substring(0, 1)}****${otp.substring(5)}`, // Mask most of the OTP in logs
      expiryTime: expiryTime.toISOString(),
      dbRecordId: result._id.toString()
    });
    
    return otp;
  } catch (error) {
    console.error(`Error generating OTP for ${email}:`, error);
    throw new Error('Failed to generate verification code');
  }
};

/**
 * Verify OTP for email verification
 * @param {String} email - User email
 * @param {String} otp - OTP to verify
 * @returns {Promise<{isValid: Boolean, reason: String|null}>} Verification result with reason if invalid
 */
const verifyOTP = async (email, otp) => {
  try {
    if (!email || !otp) {
      logWithTimestamp('Missing email or OTP in verification request', { email: !!email, otp: !!otp });
      return { isValid: false, reason: 'invalid_request' };
    }

    // Normalize the OTP input to ensure consistent comparison
    const normalizedOtp = otp.toString().trim();
    
    // Find OTP document in MongoDB
    logWithTimestamp(`Finding OTP in database for ${email}`);
    const storedOTP = await OTP.findOne({ email }).catch(err => {
      logWithTimestamp(`Database error when finding OTP for ${email}`, { error: err.message });
      return null;
    });
    
    // Log verification attempt
    logWithTimestamp(`Verifying OTP for ${email}`, { 
      attempt: normalizedOtp, 
      hasRecord: !!storedOTP, 
      recordId: storedOTP?._id?.toString() 
    });
    
    if (!storedOTP) {
      logWithTimestamp(`No OTP record found for ${email}`);
      return { isValid: false, reason: 'no_record' };
    }
    
    // Check if OTP is expired
    if (Date.now() > new Date(storedOTP.expiry).getTime()) {
      logWithTimestamp(`Expired OTP for ${email}`, { 
        expiredAt: new Date(storedOTP.expiry).toISOString(),
        currentTime: new Date().toISOString(),
        timeDiffMs: Date.now() - new Date(storedOTP.expiry).getTime()
      });
      await OTP.deleteOne({ email });
      return { isValid: false, reason: 'expired' };
    }
    
    // Normalize stored OTP for consistent comparison
    const normalizedStoredOtp = storedOTP.code.toString().trim();
    
    // Verify OTP with additional logging
    logWithTimestamp(`Comparing OTPs for ${email}`, { 
      stored: normalizedStoredOtp, 
      storedType: typeof normalizedStoredOtp, 
      received: normalizedOtp, 
      receivedType: typeof normalizedOtp,
      storedLength: normalizedStoredOtp.length,
      receivedLength: normalizedOtp.length
    });
    
    const isValid = normalizedStoredOtp === normalizedOtp;
    
    if (!isValid) {
      logWithTimestamp(`Invalid OTP for ${email}`, {
        expected: normalizedStoredOtp,
        received: normalizedOtp,
        match: normalizedStoredOtp === normalizedOtp,
        charComparison: [...normalizedStoredOtp].map((char, i) => ({
          index: i,
          storedChar: char,
          storedCharCode: char.charCodeAt(0),
          receivedChar: normalizedOtp[i] || '',
          receivedCharCode: (normalizedOtp[i] || '').charCodeAt(0) || 'N/A',
          matches: char === normalizedOtp[i]
        }))
      });
      return { isValid: false, reason: 'invalid' };
    }
    
    // Remove OTP after verification
    await OTP.deleteOne({ email });
    logWithTimestamp(`Valid OTP for ${email}, OTP record removed`);
    
    return { isValid: true, reason: null };
  } catch (error) {
    console.error(`Error verifying OTP for ${email}:`, error);
    return { isValid: false, reason: 'server_error' };
  }
};

/**
 * Send OTP email
 * @param {String} email - User email
 * @param {String} otp - OTP to send
 * @returns {Promise<Boolean>} Email sent successfully
 */
const sendOTPEmail = async (email, otp, fullName) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'LiveCV - Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5;">LiveCV</h1>
            <p style="color: #6b7280;">Professional Resume Builder</p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #111827; margin-top: 0;">Hello ${fullName || 'there'},</h2>
            <p style="color: #374151; margin-bottom: 20px;">Thank you for signing up with LiveCV. To verify your email address, please use the following verification code:</p>
            <div style="background-color: #e0e7ff; color: #4f46e5; font-size: 24px; font-weight: bold; text-align: center; padding: 15px; border-radius: 5px; letter-spacing: 8px;">${otp}</div>
            <p style="color: #6b7280; margin-top: 20px; font-size: 14px;">This code will expire in 5 minutes.</p>
          </div>
          <p style="color: #374151;">If you did not request this verification, please ignore this email.</p>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e4e4e4;">
            <p style="color: #6b7280; font-size: 12px;">&copy; ${new Date().getFullYear()} LiveCV. All rights reserved.</p>
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

/**
 * User signup
 * @route POST /api/auth/signup
 */
exports.signup = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password and full name'
      });
    }
    
    // Check if user already exists
    const existingUser = await userService.getUserByEmail(email);
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered'
      });
    }
    
    console.log(`Starting signup process for ${email} (${fullName})`);
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Store user data temporarily
    req.session = req.session || {};
    req.session.pendingUser = {
      email,
      password: hashedPassword,
      fullName,
      verified: false,
      createdAt: new Date().toISOString() // Add timestamp to track session age
    };
    
    console.log(`Stored pendingUser in session for ${email}`);
    
    // Generate OTP for email verification
    const otp = await generateOTP(email);
    
    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, fullName);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Verification code sent to your email',
      requireVerification: true,
      email
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating user account',
      error: error.message
    });
  }
};

/**
 * Verify OTP
 * @route POST /api/auth/verify-otp
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    logWithTimestamp(`OTP verification request received`, { 
      email, 
      otpLength: otp ? otp.length : 0,
      otpValue: otp ? `${otp.substring(0, 2)}...${otp.substring(otp.length - 2)}` : 'empty'
    });
    
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }
    
    logWithTimestamp(`Processing OTP verification for ${email}`);
    
    try {
      if (!email) {
        logWithTimestamp('Missing email in verification request');
        return res.status(400).json({
          success: false,
          message: 'Email is required for verification'
        });
      }

      if (!otp) {
        logWithTimestamp(`Missing OTP in verification request for ${email}`);
        return res.status(400).json({
          success: false,
          message: 'OTP is required for verification'
        });
      }

      // Check otp is valid format
      if (!/^\d{6}$/.test(otp.toString().trim())) {
        logWithTimestamp(`Invalid OTP format in verification request for ${email}: ${otp}`);
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP format. Please enter a 6-digit code.',
          reason: 'invalid_format'
        });
      }

      // Verify the OTP
      const { isValid, reason } = await verifyOTP(email, otp);
      
      if (!isValid) {
        let errorMessage = 'Invalid or expired OTP';
        
        // Provide more specific error messages for better debugging
        switch (reason) {
          case 'no_record':
            errorMessage = 'No verification code found. Request a new code.';
            break;
          case 'expired':
            errorMessage = 'Verification code has expired. Request a new code.';
            break;
          case 'invalid':
            errorMessage = 'Invalid verification code. Please check and try again.';
            break;
          case 'invalid_request':
            errorMessage = 'Invalid verification request. Please try again.';
            break;
          case 'server_error':
            errorMessage = 'Server error occurred. Please try again later.';
            break;
        }
        
        logWithTimestamp(`OTP verification failed for ${email}`, { reason, errorMessage });
        
        return res.status(400).json({
          success: false,
          message: errorMessage,
          reason
        });
      }
    } catch (verifyError) {
      logWithTimestamp(`Unexpected error during OTP verification for ${email}`, { error: verifyError.message, stack: verifyError.stack });
      return res.status(500).json({
        success: false,
        message: 'An unexpected error occurred during verification. Please try again.',
        reason: 'server_error'
      });
    }
    
    // Get pending user data
    req.session = req.session || {};
    const pendingUser = req.session.pendingUser;
    
    // Log session data for debugging
    logWithTimestamp(`Session check for ${email}`, { 
      hasSession: !!req.session, 
      hasPendingUser: !!pendingUser,
      pendingUserEmail: pendingUser?.email,
      sessionMatch: pendingUser?.email === email
    });
    
    if (!pendingUser) {
      console.log(`No pendingUser in session for ${email}, checking if user already exists...`);
      
      // Check if this is an unverified user trying to complete their registration
      const existingUser = await userService.getUserByEmail(email);
      
      if (existingUser && existingUser.verified) {
        // User is already verified
        return res.status(400).json({
          success: false,
          message: 'This email is already registered and verified'
        });
      }
      
      if (existingUser && !existingUser.verified) {
        // User exists but is not verified - verify them now since OTP is valid
        console.log(`Found unverified user for ${email}, completing verification`);
        
        // Update user to verified status
        existingUser.verified = true;
        await existingUser.save();
        
        // Generate JWT token
        const token = jwt.sign(
          { id: existingUser._id },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        return res.status(200).json({
          success: true,
          message: 'Account verified successfully',
          token,
          user: {
            id: existingUser._id,
            email: existingUser.email,
            fullName: existingUser.fullName
          }
        });
      }
      
      // If we get here, we need to recover the session but still allow registration
      console.log(`Creating recovery flow for ${email} with valid OTP but no session`);
      
      // Create a temp registration with minimal data since OTP is valid
      const tempUser = {
        email,
        fullName: email.split('@')[0], // Use part of email as name
        password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10) // Random secure password
      };
      
      // Create the user directly since OTP is valid
      const user = await userService.createUser({
        email: tempUser.email,
        password: tempUser.password,
        fullName: tempUser.fullName,
        verified: true
      });
      
      console.log(`Created recovery user for ${email} after valid OTP`);
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return res.status(201).json({
        success: true,
        message: 'Account created successfully via OTP recovery',
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          requirePasswordReset: true // Flag that user should set a password
        }
      });
    }
    
    if (pendingUser.email !== email) {
      console.log(`Session email mismatch: expected=${email}, found=${pendingUser.email}`);
      return res.status(400).json({
        success: false,
        message: 'Email does not match registration session'
      });
    }
    
    // Create user in database
    const user = await userService.createUser({
      email: pendingUser.email,
      password: pendingUser.password, // Already hashed
      fullName: pendingUser.fullName,
      verified: true
    });
    
    console.log(`User created successfully for ${email}`);
    
    // Clear pending user data
    delete req.session.pendingUser;
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

/**
 * Resend OTP
 * @route POST /api/auth/resend-otp
 */
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    console.log(`Processing OTP resend request for ${email}`);
    
    // Get pending user data
    req.session = req.session || {};
    const pendingUser = req.session.pendingUser;
    
    // Check if there's an existing OTP record in the database
    const existingOTP = await OTP.findOne({ email });
    
    // Allow resending OTP even if session is lost but email has pending OTP
    if ((!pendingUser || pendingUser.email !== email) && !existingOTP) {
      // Check if user exists but is not verified
      const existingUser = await userService.getUserByEmail(email);
      if (existingUser && !existingUser.verified) {
        // Allow resending for unverified users
        console.log(`Allowing OTP resend for existing unverified user: ${email}`);
      } else {
        console.log(`No pending registration found for ${email}`);
        return res.status(400).json({
          success: false,
          message: 'No pending registration found for this email'
        });
      }
    }
    
    // If session exists but OTP doesn't, or vice versa, log the discrepancy
    if ((pendingUser && !existingOTP) || (!pendingUser && existingOTP)) {
      console.log(`State discrepancy for ${email}: hasSession=${!!pendingUser}, hasOTP=${!!existingOTP}`);
    }
    
    // Get name from session or use email as fallback
    const fullName = pendingUser ? pendingUser.fullName : email.split('@')[0];
    
    // Generate new OTP
    const otp = await generateOTP(email);
    
    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, fullName);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Verification code resent to your email'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error resending OTP',
      error: error.message
    });
  }
};

/**
 * User login
 * @route POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    console.log(`Login attempt for ${email}`);
    
    // Get user with password included
    const user = await userService.getUserByEmailWithPassword(email);
    
    // Check if user exists
    if (!user) {
      console.log(`Login failed: email not found ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Email not registered',
        errorCode: 'EMAIL_NOT_FOUND'
      });
    }
    
    // Check if email is verified
    if (!user.verified) {
      console.log(`Login attempt for unverified email ${email}`);
      
      // Generate new OTP
      const otp = await generateOTP(email);
      
      // Send OTP email
      await sendOTPEmail(email, otp, user.fullName);
      
      return res.status(401).json({
        success: false,
        message: 'Email not verified',
        requireVerification: true,
        email
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log(`Login failed: invalid password for ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Incorrect password',
        errorCode: 'INVALID_PASSWORD'
      });
    }
    
    console.log(`Login successful for ${email}`);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        profileImageUrl: user.profileImageUrl
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

/**
 * Get current user data
 * @route GET /api/auth/me
 */
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        fullName: req.user.fullName,
        profileImageUrl: req.user.profileImageUrl,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error getting user data',
      error: error.message 
    });
  }
};

/**
 * Forgot password
 * @route POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Check if user exists
    const user = await userService.getUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with that email'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1 hour
    
    // Save token to user
    await userService.updateUserResetToken(user._id, resetToken, resetExpires);
    
    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'LiveCV - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5;">LiveCV</h1>
            <p style="color: #6b7280;">Professional Resume Builder</p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #111827; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #374151;">You requested a password reset for your LiveCV account. Please click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Reset Password</a>
            </div>
            <p style="color: #6b7280; margin-top: 20px; font-size: 14px;">This link will expire in 1 hour.</p>
          </div>
          <p style="color: #374151;">If you did not request a password reset, please ignore this email.</p>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e4e4e4;">
            <p style="color: #6b7280; font-size: 12px;">&copy; ${new Date().getFullYear()} LiveCV. All rights reserved.</p>
          </div>
        </div>
      `
    });
    
    return res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing password reset request',
      error: error.message
    });
  }
};

/**
 * Reset password
 * @route POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required'
      });
    }
    
    // Find user by reset token
    const user = await userService.getUserByResetToken(token);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token'
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update user password and clear reset token
    await userService.updateUserPassword(user._id, hashedPassword);
    
    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
};