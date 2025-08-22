const Review = require('../models/review');
const Product = require('../models/product');
const mongoose = require('mongoose');

// Get all reviews with filtering and pagination
exports.getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    if (req.query.product) {
      filter.product = req.query.product;
    }
    
    if (req.query.isApproved !== undefined) {
      filter.isApproved = req.query.isApproved === 'true';
    }
    
    if (req.query.rating) {
      filter.rating = parseInt(req.query.rating);
    }
    
    if (req.query.search) {
      filter.$or = [
        { customerName: { $regex: req.query.search, $options: 'i' } },
        { comment: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    let sort = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sort[sortField] = sortOrder;
    } else {
      sort = { createdAt: -1 }; // Default sort by newest
    }
    
    const reviews = await Review.find(filter)
      .populate('product', 'title image category')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Review.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: reviews
    });
  } catch (error) {
    console.error('Error in getAllReviews:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get reviews for a specific product
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Only show approved reviews for public view
    const filter = { 
      product: productId,
      isApproved: true 
    };
    
    if (req.query.rating) {
      filter.rating = parseInt(req.query.rating);
    }
    
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Review.countDocuments(filter);
    
    // Get rating distribution
    const ratingStats = await Review.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          isApproved: true
        }
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      ratingStats,
      data: reviews
    });
  } catch (error) {
    console.error('Error in getProductReviews:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single review
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('product', 'title image category');
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error in getReview:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new review
exports.createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      customerEmail: req.body.customerEmail
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this product'
      });
    }
    
    const reviewData = {
      ...req.body,
      product: productId
    };
    
    const review = await Review.create(reviewData);
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error in createReview:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error in updateReview:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Approve/Disapprove review
exports.updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    
    const review = await Review.findById(id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    review.isApproved = isApproved;
    await review.save();
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error in updateReviewStatus:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    await Review.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteReview:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get review statistics
exports.getReviewStats = async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const approvedReviews = await Review.countDocuments({ isApproved: true });
    const pendingReviews = await Review.countDocuments({ isApproved: false });
    
    const averageRating = await Review.aggregate([
      {
        $match: { isApproved: true }
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' }
        }
      }
    ]);
    
    const ratingDistribution = await Review.aggregate([
      {
        $match: { isApproved: true }
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        approvedReviews,
        pendingReviews,
        averageRating: averageRating.length > 0 ? Math.round(averageRating[0].avgRating * 10) / 10 : 0,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Error in getReviewStats:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Mark review as helpful
exports.markReviewHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    review.helpfulCount += 1;
    await review.save();
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error in markReviewHelpful:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};