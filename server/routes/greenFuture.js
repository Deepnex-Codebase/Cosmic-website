const express = require('express');
const router = express.Router();
const {
  getGreenFuture,
  updateGreenFuture,
  resetGreenFuture,
  upload
} = require('../controllers/greenFutureController');

// GET /api/cms/green-future - Get green future data
router.get('/', getGreenFuture);

// PUT /api/cms/green-future - Update green future data
router.put('/', upload.single('backgroundImage'), updateGreenFuture);

// POST /api/cms/green-future/reset - Reset green future data to default
router.post('/reset', resetGreenFuture);

module.exports = router;