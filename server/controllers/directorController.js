const Director = require('../models/Director');

// Get all directors
exports.getAllDirectors = async (req, res) => {
  try {
    const directors = await Director.find({}).sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: directors.length,
      data: directors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single director
exports.getDirector = async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);

    if (!director) {
      return res.status(404).json({
        success: false,
        error: 'Director not found'
      });
    }

    res.status(200).json({
      success: true,
      data: director
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new director
exports.createDirector = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file && !req.body.image) {
      return res.status(400).json({
        success: false,
        error: 'Director image is required'
      });
    }

    // If file was uploaded, add the file path to the request body
    if (req.file) {
      req.body.image = `/uploads/directors/${req.file.filename}`;
    }

    // Parse socialLinks if it's a string
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
      try {
        req.body.socialLinks = JSON.parse(req.body.socialLinks);
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: 'Invalid social links format'
        });
      }
    }

    const director = await Director.create(req.body);

    res.status(201).json({
      success: true,
      data: director
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      console.error('Error creating director:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// Update director
exports.updateDirector = async (req, res) => {
  try {
    // Check if director exists
    const existingDirector = await Director.findById(req.params.id);
    if (!existingDirector) {
      return res.status(404).json({
        success: false,
        error: 'Director not found'
      });
    }

    // If file was uploaded, add the file path to the request body
    if (req.file) {
      req.body.image = `/uploads/directors/${req.file.filename}`;
    } else if (!req.body.image) {
      // If no new image and no existing image in request, keep the existing one
      req.body.image = existingDirector.image;
    }

    // Parse socialLinks if it's a string
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
      try {
        req.body.socialLinks = JSON.parse(req.body.socialLinks);
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: 'Invalid social links format'
        });
      }
    }

    const director = await Director.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: director
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// Delete director
exports.deleteDirector = async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);

    if (!director) {
      return res.status(404).json({
        success: false,
        error: 'Director not found'
      });
    }

    await Director.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update director order
exports.updateDirectorOrder = async (req, res) => {
  try {
    const { directors } = req.body;

    if (!directors || !Array.isArray(directors)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid directors array'
      });
    }

    // Update each director's order
    const updatePromises = directors.map(async (item) => {
      return Director.findByIdAndUpdate(
        item.id,
        { order: item.order },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Director order updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};