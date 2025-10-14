const DirectorDeskHero = require('../models/DirectorDeskHero');

// Get all director desk hero sections
exports.getAllDirectorDeskHeroes = async (req, res) => {
  try {
    const heroes = await DirectorDeskHero.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: heroes.length,
      data: heroes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single director desk hero
exports.getDirectorDeskHero = async (req, res) => {
  try {
    const hero = await DirectorDeskHero.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        error: 'Director desk hero not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hero
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new director desk hero
exports.createDirectorDeskHero = async (req, res) => {
  try {
    // If file was uploaded, add the file path to the request body
    if (req.file) {
      req.body.mediaUrl = `${process.env.BASE_URL}/uploads/director-desk-hero/${req.file.filename}`;
      // Determine media type based on mimetype
      req.body.mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
    } else {
      return res.status(400).json({
        success: false,
        error: 'Please upload an image or video file'
      });
    }

    const hero = await DirectorDeskHero.create(req.body);

    res.status(201).json({
      success: true,
      data: hero
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// Update director desk hero
exports.updateDirectorDeskHero = async (req, res) => {
  try {
    // If file was uploaded, add the file path to the request body
    if (req.file) {
      req.body.mediaUrl = `${process.env.BASE_URL}/uploads/director-desk-hero/${req.file.filename}`;
      // Determine media type based on mimetype
      req.body.mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
    }

    // Update the updatedAt field
    req.body.updatedAt = Date.now();

    const hero = await DirectorDeskHero.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!hero) {
      return res.status(404).json({
        success: false,
        error: 'Director desk hero not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hero
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// Delete director desk hero
exports.deleteDirectorDeskHero = async (req, res) => {
  try {
    const hero = await DirectorDeskHero.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        error: 'Director desk hero not found'
      });
    }

    await hero.deleteOne();

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

// Get active director desk hero
exports.getActiveDirectorDeskHero = async (req, res) => {
  try {
    const hero = await DirectorDeskHero.findOne({ isActive: true }).sort({ updatedAt: -1 });

    if (!hero) {
      return res.status(404).json({
        success: false,
        error: 'No active director desk hero found'
      });
    }

    res.status(200).json({
      success: true,
      data: hero
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};