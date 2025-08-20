const Service = require('../models/Service');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Configure multer storage for service images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/services');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'service-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get all services with pagination and filtering
exports.getAllServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;
    const isActive = req.query.isActive;
    const featured = req.query.featured;

    // Build query object
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await Service.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

// Get services by category
exports.getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const services = await Service.find({ 
      category, 
      isActive: true 
    }).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services by category',
      error: error.message
    });
  }
};

// Get featured services
exports.getFeaturedServices = async (req, res) => {
  try {
    const services = await Service.find({ 
      featured: true, 
      isActive: true 
    }).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching featured services:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured services',
      error: error.message
    });
  }
};

// Get single service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

// Create new service
exports.createService = async (req, res) => {
  try {
    const serviceData = { ...req.body };

    // Handle features array
    if (typeof serviceData.features === 'string') {
      try {
        serviceData.features = JSON.parse(serviceData.features);
      } catch (e) {
        serviceData.features = serviceData.features.split(',').map(f => f.trim());
      }
    }

    // Handle SEO data
    if (typeof serviceData.seo === 'string') {
      try {
        serviceData.seo = JSON.parse(serviceData.seo);
      } catch (e) {
        serviceData.seo = {};
      }
    }

    // Handle image upload
    if (req.file) {
      serviceData.image = `/uploads/services/${req.file.filename}`;
    }

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle features array
    if (typeof updateData.features === 'string') {
      try {
        updateData.features = JSON.parse(updateData.features);
      } catch (e) {
        updateData.features = updateData.features.split(',').map(f => f.trim());
      }
    }

    // Handle SEO data
    if (typeof updateData.seo === 'string') {
      try {
        updateData.seo = JSON.parse(updateData.seo);
      } catch (e) {
        updateData.seo = {};
      }
    }

    // Handle image upload
    if (req.file) {
      // Get existing service to delete old image
      const existingService = await Service.findById(id);
      if (existingService && existingService.image && existingService.image.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', existingService.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/services/${req.file.filename}`;
    }

    const service = await Service.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Delete associated image file
    if (service.image && service.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', service.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Service.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
};

// Get service statistics
exports.getServiceStats = async (req, res) => {
  try {
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ isActive: true });
    const featuredServices = await Service.countDocuments({ featured: true });
    const servicesByCategory = await Service.aggregate([
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
        total: totalServices,
        active: activeServices,
        featured: featuredServices,
        byCategory: servicesByCategory
      }
    });
  } catch (error) {
    console.error('Error fetching service stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service statistics',
      error: error.message
    });
  }
};

// Upload middleware
exports.uploadServiceImage = upload.single('image');

// Bulk update service order
exports.updateServiceOrder = async (req, res) => {
  try {
    const { services } = req.body; // Array of { id, order }

    const updatePromises = services.map(service => 
      Service.findByIdAndUpdate(service.id, { order: service.order })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Service order updated successfully'
    });
  } catch (error) {
    console.error('Error updating service order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service order',
      error: error.message
    });
  }
};