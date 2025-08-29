const express = require('express');
const router = express.Router();
const {
  getAchievementPage,
  updateAchievementPage,
  addAchievement,
  updateAchievement,
  deleteAchievement,
  addCertificate,
  updateCertificate,
  deleteCertificate,
  addPartner,
  deletePartner,
  getAchievementStats,
  upload
} = require('../controllers/achievementController');

// Get achievement page data (for frontend)
router.get('/', getAchievementPage);

// Get achievement statistics
router.get('/stats', getAchievementStats);

// Update achievement page data
router.put('/', updateAchievementPage);

// Achievement management routes
router.post('/achievement', upload.single('image'), addAchievement);
router.put('/achievement/:achievementId', upload.single('image'), updateAchievement);
router.delete('/achievement/:achievementId', deleteAchievement);

// Certificate management routes
router.post('/certificate', addCertificate);
router.put('/certificate/:certificateId', updateCertificate);
router.delete('/certificate/:certificateId', deleteCertificate);

// Partner management routes
router.post('/partner', upload.single('logo'), addPartner);
router.delete('/partner/:partnerId', deletePartner);

module.exports = router;