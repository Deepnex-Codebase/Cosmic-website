const OfferCard = require('../models/OfferCard');
const asyncHandler = require('express-async-handler');

// @desc    Get all offer cards
// @route   GET /api/offer-cards
// @access  Public
const getOfferCards = asyncHandler(async (req, res) => {
  try {
    const { active, brochures } = req.query;
    
    let filter = {};
    
    // Filter by active status if specified
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }
    
    // Filter by brochures display if specified
    if (brochures !== undefined) {
      filter.showOnBrochures = brochures === 'true';
    }
    
    const offerCards = await OfferCard.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: offerCards.length,
      data: offerCards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Get single offer card
// @route   GET /api/offer-cards/:id
// @access  Public
const getOfferCard = asyncHandler(async (req, res) => {
  try {
    const offerCard = await OfferCard.findById(req.params.id);
    
    if (!offerCard) {
      return res.status(404).json({
        success: false,
        message: 'Offer card not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: offerCard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Create new offer card
// @route   POST /api/offer-cards
// @access  Private/Admin
const createOfferCard = asyncHandler(async (req, res) => {
  try {
    const offerCard = await OfferCard.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Offer card created successfully',
      data: offerCard
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Update offer card
// @route   PUT /api/offer-cards/:id
// @access  Private/Admin
const updateOfferCard = asyncHandler(async (req, res) => {
  try {
    let offerCard = await OfferCard.findById(req.params.id);
    
    if (!offerCard) {
      return res.status(404).json({
        success: false,
        message: 'Offer card not found'
      });
    }
    
    offerCard = await OfferCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      message: 'Offer card updated successfully',
      data: offerCard
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Delete offer card
// @route   DELETE /api/offer-cards/:id
// @access  Private/Admin
const deleteOfferCard = asyncHandler(async (req, res) => {
  try {
    const offerCard = await OfferCard.findById(req.params.id);
    
    if (!offerCard) {
      return res.status(404).json({
        success: false,
        message: 'Offer card not found'
      });
    }
    
    await OfferCard.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Offer card deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Toggle offer card active status
// @route   PATCH /api/offer-cards/:id/toggle-active
// @access  Private/Admin
const toggleOfferCardActive = asyncHandler(async (req, res) => {
  try {
    const offerCard = await OfferCard.findById(req.params.id);
    
    if (!offerCard) {
      return res.status(404).json({
        success: false,
        message: 'Offer card not found'
      });
    }
    
    offerCard.isActive = !offerCard.isActive;
    await offerCard.save();
    
    res.status(200).json({
      success: true,
      message: `Offer card ${offerCard.isActive ? 'activated' : 'deactivated'} successfully`,
      data: offerCard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Update offer card display order
// @route   PATCH /api/offer-cards/:id/order
// @access  Private/Admin
const updateOfferCardOrder = asyncHandler(async (req, res) => {
  try {
    const { displayOrder } = req.body;
    
    if (displayOrder === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Display order is required'
      });
    }
    
    const offerCard = await OfferCard.findByIdAndUpdate(
      req.params.id,
      { displayOrder },
      { new: true, runValidators: true }
    );
    
    if (!offerCard) {
      return res.status(404).json({
        success: false,
        message: 'Offer card not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Offer card order updated successfully',
      data: offerCard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = {
  getOfferCards,
  getOfferCard,
  createOfferCard,
  updateOfferCard,
  deleteOfferCard,
  toggleOfferCardActive,
  updateOfferCardOrder
};