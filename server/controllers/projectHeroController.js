const ProjectHero = require('../models/ProjectHero');
const fs = require('fs');
const path = require('path');

// Get all project heroes
exports.getAllProjectHeroes = async (req, res) => {
  try {
    const projectHeroes = await ProjectHero.find().sort({ createdAt: -1 });
    res.status(200).json(projectHeroes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active project hero
exports.getActiveProjectHero = async (req, res) => {
  try {
    const projectHero = await ProjectHero.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!projectHero) {
      return res.status(404).json({ message: 'No active project hero found' });
    }
    res.status(200).json(projectHero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get project hero by ID
exports.getProjectHeroById = async (req, res) => {
  try {
    const projectHero = await ProjectHero.findById(req.params.id);
    if (!projectHero) {
      return res.status(404).json({ message: 'Project hero not found' });
    }
    res.status(200).json(projectHero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new project hero
exports.createProjectHero = async (req, res) => {
  try {
    const { title, subtitle, buttonText, buttonLink, mediaType } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required' });
    }

    const media = `/uploads/projects/${req.file.filename}`;
    
    const newProjectHero = new ProjectHero({
      title,
      subtitle,
      buttonText,
      buttonLink,
      mediaType,
      media
    });

    // If this is set as active, deactivate all others
    if (req.body.isActive === 'true') {
      await ProjectHero.updateMany({}, { isActive: false });
      newProjectHero.isActive = true;
    }

    const savedProjectHero = await newProjectHero.save();
    res.status(201).json(savedProjectHero);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update project hero
exports.updateProjectHero = async (req, res) => {
  try {
    const { title, subtitle, buttonText, buttonLink, mediaType, isActive } = req.body;
    const updateData = { title, subtitle, buttonText, buttonLink, mediaType };
    
    // If there's a new file, update the media path
    if (req.file) {
      // Get the old hero to delete its media file
      const oldHero = await ProjectHero.findById(req.params.id);
      if (oldHero && oldHero.media) {
        const oldMediaPath = path.join(__dirname, '..', oldHero.media);
        if (fs.existsSync(oldMediaPath)) {
          fs.unlinkSync(oldMediaPath);
        }
      }
      
      updateData.media = `/uploads/projects/${req.file.filename}`;
    }

    // If this is set as active, deactivate all others
    if (isActive === 'true') {
      await ProjectHero.updateMany({}, { isActive: false });
      updateData.isActive = true;
    }

    const updatedProjectHero = await ProjectHero.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProjectHero) {
      return res.status(404).json({ message: 'Project hero not found' });
    }

    res.status(200).json(updatedProjectHero);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete project hero
exports.deleteProjectHero = async (req, res) => {
  try {
    const projectHero = await ProjectHero.findById(req.params.id);
    
    if (!projectHero) {
      return res.status(404).json({ message: 'Project hero not found' });
    }
    
    // Delete the media file
    if (projectHero.media) {
      const mediaPath = path.join(__dirname, '..', projectHero.media);
      if (fs.existsSync(mediaPath)) {
        fs.unlinkSync(mediaPath);
      }
    }
    
    await ProjectHero.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Project hero deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set project hero as active
exports.setActiveProjectHero = async (req, res) => {
  try {
    // Deactivate all project heroes
    await ProjectHero.updateMany({}, { isActive: false });
    
    // Activate the selected one
    const updatedProjectHero = await ProjectHero.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    if (!updatedProjectHero) {
      return res.status(404).json({ message: 'Project hero not found' });
    }
    
    res.status(200).json(updatedProjectHero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};