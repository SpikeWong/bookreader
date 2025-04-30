// src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authenticateUser, authController.getCurrentUser);
router.put('/profile', authenticateUser, authController.updateProfile);

module.exports = router;