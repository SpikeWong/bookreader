// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const config = require('../config');

/**
 * Register a new user
 * @route POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.username === username 
          ? 'Username already exists' 
          : 'Email already exists' 
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      profile: {
        displayName: username,
      }
    });

    await user.save();

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
};

/**
 * Login a user
 * @route POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username or email
    const user = await User.findByUsernameOrEmail(username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id }, 
      config.jwtSecret, 
      { expiresIn: config.jwtExpire }
    );
    
    res.json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Login failed' });
  }
};

/**
 * Get the current authenticated user
 * @route GET /api/auth/me
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        googleTranslateApiKey: user.googleTranslateApiKey
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message || 'Failed to get user' });
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { displayName, preferences, googleTranslateApiKey } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update profile fields if provided
    if (displayName) {
      user.profile.displayName = displayName;
    }

    // Update preferences if provided
    if (preferences) {
      if (preferences.language) {
        user.profile.preferences.language = preferences.language;
      }
      if (typeof preferences.darkMode === 'boolean') {
        user.profile.preferences.darkMode = preferences.darkMode;
      }
    }

    // Update Google Translate API key if provided
    if (googleTranslateApiKey !== undefined) {
      user.googleTranslateApiKey = googleTranslateApiKey;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        googleTranslateApiKey: user.googleTranslateApiKey
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
};