const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

// Get all offers
router.get('/', offerController.getAllOffers);

// Get active offer
router.get('/active', offerController.getActiveOffer);

// Get offer by ID
router.get('/:id', offerController.getOfferById);

// Create a new offer
router.post('/', offerController.createOffer);

// Update an offer
router.put('/:id', offerController.updateOffer);

// Delete an offer
router.delete('/:id', offerController.deleteOffer);

module.exports = router;