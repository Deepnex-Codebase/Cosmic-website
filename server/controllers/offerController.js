const Offer = require('../models/Offer');

/**
 * Get all offers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find({}).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    console.error('Error in getAllOffers controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching offers',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get active offer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getActiveOffer = async (req, res) => {
  try {
    // Get current date
    const currentDate = new Date();
    
    // Find active offer that is within the date range
    const offer = await Offer.findOne({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    });
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'No active offer found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: offer
    });
  } catch (error) {
    console.error('Error in getActiveOffer controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching active offer',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Get offer by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const offer = await Offer.findById(id);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: `Offer with ID ${id} not found`
      });
    }
    
    return res.status(200).json({
      success: true,
      data: offer
    });
  } catch (error) {
    console.error(`Error in getOfferById controller for ID ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching offer',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Create a new offer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createOffer = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      discountPercentage,
      discountCode,
      expiryDays,
      startDate,
      endDate,
      isActive,
      backgroundColor,
      buttonColor,
      termsAndConditions
    } = req.body;
    
    // Validate required fields
    if (!title || !subtitle || !description || !discountPercentage || !discountCode || !expiryDays || !startDate || !endDate || !termsAndConditions) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // If this is an active offer, deactivate all other offers
    if (isActive) {
      await Offer.updateMany({}, { isActive: false });
    }
    
    const offer = await Offer.create({
      title,
      subtitle,
      description,
      discountPercentage,
      discountCode,
      expiryDays,
      startDate,
      endDate,
      isActive: isActive !== undefined ? isActive : true,
      backgroundColor: backgroundColor || '#cae28e',
      buttonColor: buttonColor || '#4CAF50',
      termsAndConditions
    });
    
    return res.status(201).json({
      success: true,
      data: offer
    });
  } catch (error) {
    console.error('Error in createOffer controller:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error creating offer',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Update an offer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // If this is being set to active, deactivate all other offers
    if (updateData.isActive) {
      await Offer.updateMany({ _id: { $ne: id } }, { isActive: false });
    }
    
    const offer = await Offer.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: `Offer with ID ${id} not found`
      });
    }
    
    return res.status(200).json({
      success: true,
      data: offer
    });
  } catch (error) {
    console.error(`Error in updateOffer controller for ID ${req.params.id}:`, error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error updating offer',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

/**
 * Delete an offer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    
    const offer = await Offer.findByIdAndDelete(id);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: `Offer with ID ${id} not found`
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(`Error in deleteOffer controller for ID ${req.params.id}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting offer',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};