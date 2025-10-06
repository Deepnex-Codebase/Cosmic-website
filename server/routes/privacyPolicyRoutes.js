const express = require('express');
const router = express.Router();
const { 
  getPrivacyPolicy, 
  updatePrivacyPolicy, 
  createPrivacyPolicy, 
  deletePrivacyPolicy 
} = require('../controllers/privacyPolicyController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPrivacyPolicy);

// Protected routes (admin only)
router.post('/', protect, createPrivacyPolicy);
router.put('/', protect, updatePrivacyPolicy);
router.delete('/:id', protect, deletePrivacyPolicy);

module.exports = router;