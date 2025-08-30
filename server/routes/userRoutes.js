const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Since we don't have a User model yet, we'll create a simple authentication mechanism
// In a real application, you would use the User model to validate credentials

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // For demonstration purposes, we'll use hardcoded credentials
    // In a real application, you would validate against the database
    if (email === 'admin@cosmic.com' && password === 'cosmic@123') {
      // Create JWT payload
      const payload = {
        user: {
          id: '1',
          email: email,
          role: 'admin'
        }
      };

      // Sign token
      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'cosmic-secret-key',
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            token,
            user: {
              id: '1',
              email: email,
              role: 'admin'
            }
          });
        }
      );
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', (req, res) => {
  // This would normally use authentication middleware to verify the token
  // For now, we'll just return a mock profile
  res.json({
    success: true,
    user: {
      id: '1',
      email: 'admin@cosmic.com',
      role: 'admin',
      name: 'Admin User'
    }
  });
});

module.exports = router;