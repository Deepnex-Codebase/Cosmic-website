const express = require('express');
const router = express.Router();
const {
  getAllTimeline,
  getTimelineById,
  createTimeline,
  updateTimeline,
  deleteTimeline,
  getAllTimelineAdmin,
  upload
} = require('../controllers/timelineController');

// Public routes
router.get('/', getAllTimeline);
router.get('/:id', getTimelineById);

// Admin routes
router.get('/admin/all', getAllTimelineAdmin);
router.post('/', upload.single('file'), createTimeline);
router.put('/:id', upload.single('file'), updateTimeline);
router.delete('/:id', deleteTimeline);

module.exports = router;