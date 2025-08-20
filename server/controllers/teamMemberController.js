const TeamMember = require('../models/TeamMember');

// Get all team members
exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({}).sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: teamMembers.length,
      data: teamMembers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single team member
exports.getTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new team member
exports.createTeamMember = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file && !req.body.image) {
      return res.status(400).json({
        success: false,
        error: 'Team member image is required'
      });
    }

    // If file was uploaded, add the file path to the request body
    if (req.file) {
      req.body.image = `/uploads/team/${req.file.filename}`;
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

    const teamMember = await TeamMember.create(req.body);

    res.status(201).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      console.error('Error creating team member:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// Update team member
exports.updateTeamMember = async (req, res) => {
  try {
    // Check if team member exists
    const existingTeamMember = await TeamMember.findById(req.params.id);
    
    if (!existingTeamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }

    // If file was uploaded, add the file path to the request body
    if (req.file) {
      req.body.image = `/uploads/team/${req.file.filename}`;
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

    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: teamMember
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

// Delete team member
exports.deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }

    await teamMember.remove();

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

// Update team member order
exports.updateTeamMemberOrder = async (req, res) => {
  try {
    const { id, direction } = req.params;
    
    // Find the current team member
    const currentTeamMember = await TeamMember.findById(id);
    if (!currentTeamMember) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found'
      });
    }
    
    // Find adjacent team member based on direction
    let adjacentTeamMember;
    if (direction === 'up') {
      adjacentTeamMember = await TeamMember.findOne({
        order: { $lt: currentTeamMember.order }
      }).sort({ order: -1 });
    } else if (direction === 'down') {
      adjacentTeamMember = await TeamMember.findOne({
        order: { $gt: currentTeamMember.order }
      }).sort({ order: 1 });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid direction. Use "up" or "down"'
      });
    }
    
    // If no adjacent team member found, return error
    if (!adjacentTeamMember) {
      return res.status(400).json({
        success: false,
        error: `Cannot move ${direction} any further`
      });
    }
    
    // Swap orders
    const tempOrder = currentTeamMember.order;
    currentTeamMember.order = adjacentTeamMember.order;
    adjacentTeamMember.order = tempOrder;
    
    // Save both team members
    await currentTeamMember.save();
    await adjacentTeamMember.save();
    
    res.status(200).json({
      success: true,
      message: `Team member moved ${direction} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};