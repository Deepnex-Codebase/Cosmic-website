const express = require('express');
const router = express.Router();
const {
  getActiveCompanyIntro,
  getAllCompanyIntro,
  getCompanyIntroById,
  createOrUpdateCompanyIntro,
  deleteCompanyIntro,
  toggleCompanyIntroStatus,
  videoUpload,
  imageUpload,
  handleVideoUpload,
  handleImageUpload,
  initializeDefaultCompanyIntro
} = require('../controllers/companyIntroController');

// Initialize default Company Intro data on server start
initializeDefaultCompanyIntro();

// Public routes
router.get('/active', getActiveCompanyIntro);

// Admin routes
router.get('/', getAllCompanyIntro);
router.get('/:id', getCompanyIntroById);
router.post('/', videoUpload.single('backgroundVideo'), createOrUpdateCompanyIntro);
router.put('/:id', videoUpload.single('backgroundVideo'), createOrUpdateCompanyIntro);
router.delete('/:id', deleteCompanyIntro);
router.patch('/:id/toggle-status', toggleCompanyIntroStatus);
router.post('/upload-video', videoUpload.single('backgroundVideo'), handleVideoUpload);
router.post('/upload-image', imageUpload.single('backgroundImage'), handleImageUpload);

module.exports = router;