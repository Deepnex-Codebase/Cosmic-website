const express = require('express');
const router = express.Router();
const blogHeroController = require('../controllers/blogHeroController');
const { protect } = require('../middleware/authMiddleware');

// Get blog hero configuration
router.get('/', blogHeroController.getBlogHero);

// Update blog hero route
router.put('/', protect, blogHeroController.updateBlogHero);

module.exports = router;