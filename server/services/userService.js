const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Mongoose user object
 */
exports.createUser = async (userData) => {
  try {
    const user = new User({
      email: userData.email,
      password: userData.password, // Should be already hashed
      fullName: userData.fullName,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      verified: userData.verified || false
    });

    await user.save();
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object>} Mongoose user object
 */
exports.getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

/**
 * Get user by email with password included
 * @param {string} email - User email
 * @returns {Promise<Object>} Mongoose user object with password
 */
exports.getUserByEmailWithPassword = async (email) => {
  try {
    return await User.findOne({ email }).select('+password');
  } catch (error) {
    console.error('Error getting user by email with password:', error);
    throw error;
  }
};

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} Mongoose user object
 */
exports.getUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

/**
 * Get user by Clerk ID
 * @param {string} clerkId - The Clerk user ID
 * @returns {Promise<Object>} Mongoose user object
 */
exports.getUserByClerkId = async (clerkId) => {
  try {
    return await User.findOne({ clerkId });
  } catch (error) {
    console.error('Error getting user by Clerk ID:', error);
    throw error;
  }
};

/**
 * Update user reset token for password reset
 * @param {string} userId - User ID
 * @param {string} token - Reset token
 * @param {number} expires - Token expiry timestamp
 * @returns {Promise<Object>} Updated user
 */
exports.updateUserResetToken = async (userId, token, expires) => {
  try {
    return await User.findByIdAndUpdate(
      userId,
      {
        resetPasswordToken: token,
        resetPasswordExpires: expires
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating user reset token:', error);
    throw error;
  }
};

/**
 * Get user by reset token
 * @param {string} token - Reset token
 * @returns {Promise<Object>} User with valid reset token
 */
exports.getUserByResetToken = async (token) => {
  try {
    return await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
  } catch (error) {
    console.error('Error getting user by reset token:', error);
    throw error;
  }
};

/**
 * Update user password and clear reset token
 * @param {string} userId - User ID
 * @param {string} password - New hashed password
 * @returns {Promise<Object>} Updated user
 */
exports.updateUserPassword = async (userId, password) => {
  try {
    return await User.findByIdAndUpdate(
      userId,
      {
        password: password,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
};

/**
 * Delete user by ID
 * @param {string} id - User ID
 * @returns {Promise<boolean>} Success status
 */
exports.deleteUser = async (id) => {
  try {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Delete user by Clerk ID
 * @param {string} clerkId - The Clerk user ID
 * @returns {Promise<boolean>} Success status
 */
exports.deleteUserByClerkId = async (clerkId) => {
  try {
    const result = await User.deleteOne({ clerkId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting user by Clerk ID:', error);
    throw error;
  }
};