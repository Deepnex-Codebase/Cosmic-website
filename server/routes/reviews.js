const express = require('express');
const {
  getAllReviews,
  getProductReviews,
  getReview,
  createReview,
  updateReview,
  updateReviewStatus,
  deleteReview,
  getReviewStats,
  markReviewHelpful
} = require('../controllers/reviewcontroller');

const router = express.Router();

// Review routes
router.route('/')
  .get(getAllReviews);

router.route('/stats')
  .get(getReviewStats);

router.route('/product/:productId')
  .get(getProductReviews)
  .post(createReview);

router.route('/:id')
  .get(getReview)
  .put(updateReview)
  .delete(deleteReview);

router.route('/:id/status')
  .put(updateReviewStatus);

router.route('/:id/helpful')
  .put(markReviewHelpful);

module.exports = router;