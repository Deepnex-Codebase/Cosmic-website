const Product = require('../models/product');
const { productUpload, productUploadFields } = require('../config/multerConfig');
const path = require('path');
const fs = require('fs');

// Get all products with filtering, sorting, and pagination
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }
    
    if (req.query.isFeatured !== undefined) {
      filter.isFeatured = req.query.isFeatured === 'true';
    }
    
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
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
    
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: products
    });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single product by ID
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error in getProduct:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    // Handle file uploads
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        req.body.image = `/uploads/products/${req.files.image[0].filename}`;
      }
      
      if (req.files.hoverImage && req.files.hoverImage[0]) {
        req.body.hoverImage = `/uploads/products/${req.files.hoverImage[0].filename}`;
      }
      
      if (req.files.images) {
        req.body.images = req.files.images.map(file => `/uploads/products/${file.filename}`);
      }
    }
    
    // Handle specifications sent with dot notation (e.g., specifications.brand)
    // Don't convert to nested object, keep them as individual fields for Mongoose
    console.log('CREATE - Raw req.body before processing:', req.body);
    
    // Fallback: Parse JSON strings for specifications and features
    if (req.body.specifications && typeof req.body.specifications === 'string') {
      try {
        const parsedSpecs = JSON.parse(req.body.specifications);
        delete req.body.specifications;
        // Add each specification field with dot notation
        Object.keys(parsedSpecs).forEach(key => {
          req.body[`specifications.${key}`] = parsedSpecs[key];
        });
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'Invalid specifications format'
        });
      }
    }
    
    console.log('CREATE - Final req.body before creating product:', req.body);
    
    if (req.body.features && typeof req.body.features === 'string') {
      try {
        req.body.features = JSON.parse(req.body.features);
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'Invalid features format'
        });
      }
    }
    
    // Status should be a simple string, no need to parse
    // Valid status values: 'active', 'inactive', 'draft'
    if (req.body.status && typeof req.body.status === 'string') {
      const validStatuses = ['active', 'inactive', 'draft'];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status value. Must be: active, inactive, or draft'
        });
      }
    }
    
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Handle file uploads
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        req.body.image = `/uploads/products/${req.files.image[0].filename}`;
      }
      
      if (req.files.hoverImage && req.files.hoverImage[0]) {
        req.body.hoverImage = `/uploads/products/${req.files.hoverImage[0].filename}`;
      }
      
      if (req.files.images) {
        req.body.images = req.files.images.map(file => `/uploads/products/${file.filename}`);
      }
    }
    
    // Handle specifications sent with dot notation (e.g., specifications.brand)
    // Don't convert to nested object, keep them as individual fields for Mongoose
    console.log('UPDATE - Raw req.body before processing:', req.body);
    
    // Fallback: Parse JSON strings for specifications and features
    if (req.body.specifications && typeof req.body.specifications === 'string') {
      try {
        const parsedSpecs = JSON.parse(req.body.specifications);
        delete req.body.specifications;
        // Add each specification field with dot notation
        Object.keys(parsedSpecs).forEach(key => {
          req.body[`specifications.${key}`] = parsedSpecs[key];
        });
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'Invalid specifications format'
        });
      }
    }
    
    console.log('UPDATE - Final req.body before updating product:', req.body);
    
    if (req.body.features && typeof req.body.features === 'string') {
      try {
        req.body.features = JSON.parse(req.body.features);
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'Invalid features format'
        });
      }
    }
    
    // Status should be a simple string, no need to parse
    // Valid status values: 'active', 'inactive', 'draft'
    if (req.body.status && typeof req.body.status === 'string') {
      const validStatuses = ['active', 'inactive', 'draft'];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status value. Must be: active, inactive, or draft'
        });
      }
    }
    
    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const products = await Product.find({ 
      category: category,
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments({ 
      category: category,
      isActive: true 
    });
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: products
    });
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const products = await Product.find({ 
      isFeatured: true,
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get related products
exports.getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 4;
    
    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    const relatedProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: id },
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      data: relatedProducts
    });
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get product statistics
exports.getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    
    const categoriesStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        featuredProducts,
        categories: categoriesStats.length,
        categoriesStats
      }
    });
  } catch (error) {
    console.error('Error in getProductStats:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};