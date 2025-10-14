const Service = require('../models/Service');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { serviceUpload } = require('../config/multerConfig');

/**
 * Get service page section titles and subtitles
 * @route GET /api/services/page-sections
 * @access Public
 */
exports.getPageSections = async (req, res) => {
  try {
    // Find the first service document to get page sections
    // If no document exists, create a new one with default values
    let servicePage = await Service.findOne({}, 'pageSections');
    
    if (!servicePage) {
      // Create with required fields to avoid validation errors
      servicePage = await Service.create({
        title: 'Default Service',
        description: 'Default service description',
        category: 'core'
      });
    }
    
    res.status(200).json({
      success: true,
      data: servicePage.pageSections || {}
    });
  } catch (error) {
    console.error('Error fetching service page sections:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service page sections',
      error: error.message
    });
  }
};

/**
 * Update service page section titles and subtitles
 * @route PUT /api/services/page-sections
 * @access Private (Admin)
 */
exports.updatePageSections = async (req, res) => {
  try {
    console.log('Received update request with body:', req.body);
    
    // Check if request body is empty or not an object
    if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is empty or invalid',
        error: 'Please provide at least one field to update'
      });
    }
    
    // Validate that at least one field has a non-empty value
    // Allow empty strings as valid values for clearing fields
    const hasValidField = Object.values(req.body).some(value => 
      value !== undefined && value !== null
    );
    
    if (!hasValidField) {
      return res.status(400).json({
        success: false,
        message: 'No valid field values provided',
        error: 'Please provide at least one field with a valid value'
      });
    }
    
    const { 
      coreServicesTitle, 
      coreServicesSubtitle,
      specializedSolutionsTitle,
      specializedSolutionsSubtitle,
      processTitle,
      processSubtitle,
      heroTitle
    } = req.body;
    
    // Find the first service document to update page sections
    // If no document exists, create a new one
    let servicePage = await Service.findOne({});
    
    if (!servicePage) {
      servicePage = new Service({});
    }
    
    // Update the page sections with new values if provided
    if (!servicePage.pageSections) {
      servicePage.pageSections = {};
    }
    
    // Only update fields that are explicitly provided (even if empty string)
    if (coreServicesTitle !== undefined) servicePage.pageSections.coreServicesTitle = coreServicesTitle;
    if (coreServicesSubtitle !== undefined) servicePage.pageSections.coreServicesSubtitle = coreServicesSubtitle;
    if (specializedSolutionsTitle !== undefined) servicePage.pageSections.specializedSolutionsTitle = specializedSolutionsTitle;
    if (specializedSolutionsSubtitle !== undefined) servicePage.pageSections.specializedSolutionsSubtitle = specializedSolutionsSubtitle;
    if (processTitle !== undefined) servicePage.pageSections.processTitle = processTitle;
    if (processSubtitle !== undefined) servicePage.pageSections.processSubtitle = processSubtitle;
    if (heroTitle !== undefined) servicePage.pageSections.heroTitle = heroTitle;
    
    try {
      await servicePage.save();
      
      res.status(200).json({
        success: true,
        data: servicePage.pageSections,
        message: 'Service page sections updated successfully'
      });
    } catch (saveError) {
      console.error('Error saving service page sections:', saveError);
      return res.status(400).json({
        success: false,
        message: 'Error saving service page sections',
        error: saveError.message
      });
    }
  } catch (error) {
    console.error('Error updating service page sections:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service page sections',
      error: error.message
    });
  }
};

/**
 * Get all services with pagination and filtering
 * @route GET /api/services
 * @access Public
 */
exports.getAllServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
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

/**
 * Get services by category
 * @route GET /api/services/category/:category
 * @access Public
 */
exports.getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!['core', 'specialized', 'process'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category',
        error: 'Category must be one of: core, specialized, process'
      });
    }
    
    const services = await Service.find({ 
      category,
      isActive: true 
    }).sort({ order: 1 });
    
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

/**
 * Get featured services
 * @route GET /api/services/featured
 * @access Public
 */
exports.getFeaturedServices = async (req, res) => {
  try {
    const services = await Service.find({ 
      featured: true,
      isActive: true 
    }).sort({ order: 1 });
    
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

/**
 * Get single service by ID
 * @route GET /api/services/:id
 * @access Public
 */
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID format'
      });
    }
    
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

/**
 * Create new service
 * @route POST /api/services
 * @access Private
 */
exports.createService = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const serviceData = { ...req.body };

    // Validate required fields - icon and image are now optional
    const requiredFields = ['title', 'description', 'category'];
    const missingFields = requiredFields.filter(field => !serviceData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Icon is optional, set default if not provided
    if (!serviceData.icon) {
      serviceData.icon = '';
    }
    
    // Image is now optional
    if (!req.file) {
      console.log('No image file provided - continuing with service creation');
      // Continue without image
    }

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

    // Format image URL if file is provided
    if (req.file) {
      const imagePath = req.file.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes
      const relativePath = imagePath.split('uploads')[1]; // Get path relative to uploads directory
      serviceData.image = `${process.env.BASE_URL}/uploads${relativePath}`;
    } else {
      // No image provided, set to empty or default image
      serviceData.image = '';
    }

    // Create service
    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      data: service,
      message: 'Service created successfully'
    });
  } catch (error) {
    console.error('Error creating service:', error);
    
    // If there was an uploaded file, delete it
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('Deleted uploaded file after error:', req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

/**
 * Update service
 * @route PUT /api/services/:id
 * @access Private
 */
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceData = { ...req.body };
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID format'
      });
    }
    
    // Check if service exists
    const existingService = await Service.findById(id);
    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
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
    
    // Handle image update
    if (req.file) {
      // Format new image URL
      const imagePath = req.file.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes
      const relativePath = imagePath.split('uploads')[1]; // Get path relative to uploads directory
      serviceData.image = `${process.env.BASE_URL}/uploads${relativePath}`;
      
      // Delete old image if it exists and is not a remote URL
      if (existingService.image && !existingService.image.startsWith('http')) {
        try {
          const oldImagePath = path.join(__dirname, '..', existingService.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log('Deleted old image:', oldImagePath);
          }
        } catch (unlinkError) {
          console.error('Error deleting old image:', unlinkError);
        }
      }
    } else if (!serviceData.image) {
      // If no new image and no image field in request, keep existing image
      serviceData.image = existingService.image;
    }
    
    // Update service
    const updatedService = await Service.findByIdAndUpdate(
      id,
      serviceData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedService,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Error updating service:', error);
    
    // If there was an uploaded file, delete it
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('Deleted uploaded file after error:', req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

/**
 * Delete service
 * @route DELETE /api/services/:id
 * @access Private
 */
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID format'
      });
    }
    
    // Find service to get image path before deletion
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    // Delete service
    await Service.findByIdAndDelete(id);
    
    // Delete image file if it exists and is not a remote URL
    if (service.image && !service.image.startsWith('http')) {
      try {
        // Remove BASE_URL from the image path if it exists
        let imagePath = service.image;
        if (process.env.BASE_URL && imagePath.startsWith(process.env.BASE_URL)) {
          imagePath = imagePath.replace(process.env.BASE_URL, '');
        }
        const fullImagePath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullImagePath)) {
          fs.unlinkSync(fullImagePath);
          console.log('Deleted service image:', imagePath);
        }
      } catch (unlinkError) {
        console.error('Error deleting service image:', unlinkError);
      }
    }
    
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

/**
 * Get service statistics
 * @route GET /api/services/stats
 * @access Private
 */
exports.getServiceStats = async (req, res) => {
  try {
    // Check if the request has a valid token (this is a simplified check)
    // In a production environment, you would use proper authentication middleware
    
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ isActive: true });
    const featuredServices = await Service.countDocuments({ featured: true });
    
    // Handle potential errors in the aggregation pipeline
    let servicesByCategory = [];
    try {
      servicesByCategory = await Service.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            category: '$_id',
            count: 1,
            _id: 0
          }
        }
      ]);
    } catch (aggregateError) {
      console.error('Error in aggregation:', aggregateError);
      // Continue with empty array if aggregation fails
    }

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

/**
 * Upload middleware
 */
exports.uploadServiceImage = serviceUpload.single('file');

/**
 * Bulk update service order
 * @route PATCH /api/services/order
 * @access Private
 */
exports.updateServiceOrder = async (req, res) => {
  try {
    const { services } = req.body; // Array of { id, order }
    
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request format',
        error: 'Services array is required and must not be empty'
      });
    }
    
    // Validate all IDs before updating
    const invalidIds = services.filter(s => !mongoose.Types.ObjectId.isValid(s.id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service ID format',
        error: `Invalid IDs: ${invalidIds.map(s => s.id).join(', ')}`
      });
    }

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