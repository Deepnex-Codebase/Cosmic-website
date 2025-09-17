const express = require('express');
const router = express.Router();
const {
  getOfferCards,
  getOfferCard,
  createOfferCard,
  updateOfferCard,
  deleteOfferCard,
  toggleOfferCardActive,
  updateOfferCardOrder
} = require('../controllers/offerCardController');

// Import middleware (assuming you have auth middleware)
// const { protect, authorize } = require('../middleware/auth');

// Public routes
router.route('/')
  .get(getOfferCards)
  .post(createOfferCard); // Add auth middleware: .post(protect, authorize('admin'), createOfferCard);

router.route('/:id')
  .get(getOfferCard)
  .put(updateOfferCard) // Add auth middleware: .put(protect, authorize('admin'), updateOfferCard)
  .delete(deleteOfferCard); // Add auth middleware: .delete(protect, authorize('admin'), deleteOfferCard);

// Admin only routes
router.route('/:id/toggle-active')
  .patch(toggleOfferCardActive); // Add auth middleware: .patch(protect, authorize('admin'), toggleOfferCardActive);

router.route('/:id/order')
  .patch(updateOfferCardOrder); // Add auth middleware: .patch(protect, authorize('admin'), updateOfferCardOrder);

module.exports = router;