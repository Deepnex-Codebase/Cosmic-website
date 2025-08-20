const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      status, 
      featured, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (featured !== undefined) filter.isFeatured = featured === 'true';
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const projects = await Project.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      data: projects,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
};

// Get featured projects
const getFeaturedProjects = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const projects = await Project.find({ 
      isActive: true, 
      isFeatured: true 
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured projects',
      error: error.message
    });
  }
};

// Get project by ID or slug
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by MongoDB ObjectId first, then by slug
    let project;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findOne({ _id: id, isActive: true });
    } else {
      project = await Project.findOne({ slug: id, isActive: true });
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
};

// Create new project
const createProject = async (req, res) => {
  try {
    const projectData = req.body;
    
    // Handle file uploads if present
    if (req.files) {
      if (req.files.featuredImage) {
        projectData.featuredImage = `/uploads/projects/${req.files.featuredImage[0].filename}`;
      }
      if (req.files.images) {
        projectData.images = req.files.images.map(file => `/uploads/projects/${file.filename}`);
      }
    }

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Project with this title already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle file uploads if present
    if (req.files) {
      if (req.files.featuredImage) {
        updateData.featuredImage = `/uploads/projects/${req.files.featuredImage[0].filename}`;
      }
      if (req.files.images) {
        updateData.images = req.files.images.map(file => `/uploads/projects/${file.filename}`);
      }
    }

    const project = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
};

// Delete project (soft delete)
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
};

// Get project statistics
const getProjectStats = async (req, res) => {
  try {
    const stats = await Project.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          completedProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          inProgressProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          },
          featuredProjects: {
            $sum: { $cond: ['$isFeatured', 1, 0] }
          }
        }
      }
    ]);

    const categoryStats = await Project.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalProjects: 0,
          completedProjects: 0,
          inProgressProjects: 0,
          featuredProjects: 0
        },
        categoryBreakdown: categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllProjects,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats
};