const express = require('express');
const router = express.Router();
const {
  getActiveCompanyIntro,
  getAllCompanyIntro,
  getCompanyIntroById,
  createOrUpdateCompanyIntro,
  deleteCompanyIntro,
  toggleCompanyIntroStatus,
  uploadVideo,
  initializeDefaultCompanyIntro
} = require('../controllers/companyIntroController');

// Initialize default Company Intro data on server start
initializeDefaultCompanyIntro();

// Public routes
router.get('/active', getActiveCompanyIntro);

// Admin routes
router.get('/', getAllCompanyIntro);
router.get('/:id', getCompanyIntroById);
router.post('/', uploadVideo, createOrUpdateCompanyIntro);
router.put('/:id', uploadVideo, createOrUpdateCompanyIntro);
router.delete('/:id', deleteCompanyIntro);
router.patch('/:id/toggle-status', toggleCompanyIntroStatus);

module.exports = router;