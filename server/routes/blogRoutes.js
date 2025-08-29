const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

/**
 * @route   GET /api/blogs
 * @desc    Get all blogs with pagination, filtering, and search
 * @access  Public
 * @params  page, limit, category, status, search, sortBy, sortOrder
 */
router.get('/', blogController.getAllBlogs);

/**
 * @route   GET /api/blogs/categories
 * @desc    Get all blog categories
 * @access  Public
 */
router.get('/categories', blogController.getBlogCategories);

/**
 * @route   GET /api/blogs/stats
 * @desc    Get blog statistics
 * @access  Private (Admin)
 */
router.get('/stats', blogController.getBlogStats);

/**
 * @route   POST /api/blogs/upload
 * @desc    Upload blog image
 * @access  Private (Admin)
 */
router.post('/upload', blogController.uploadBlogImage);

/**
 * @route   POST /api/blogs
 * @desc    Create new blog
 * @access  Private (Admin)
 */
router.post('/', blogController.uploadMiddleware.single('featuredImage'), blogController.createBlog);

/**
 * @route   GET /api/blogs/:id
 * @desc    Get single blog by ID or slug
 * @access  Public
 */
router.get('/:id', blogController.getBlog);

/**
 * @route   PUT /api/blogs/:id
 * @desc    Update blog by ID
 * @access  Private (Admin)
 */
router.put('/:id', blogController.uploadMiddleware.single('featuredImage'), blogController.updateBlog);

/**
 * @route   DELETE /api/blogs/:id
 * @desc    Delete blog by ID
 * @access  Private (Admin)
 */
router.delete('/:id', blogController.deleteBlog);

module.exports = router;