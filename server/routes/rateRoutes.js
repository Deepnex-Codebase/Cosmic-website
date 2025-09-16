const express = require('express');
const {
  getRates,
  getRatesByCategory,
  getRate,
  createRate,
  updateRate,
  deleteRate,
  uploadRate
} = require('../controllers/rateController');

const router = express.Router();

// Public routes
router.get('/', getRates);
router.get('/category/:category', getRatesByCategory);
router.get('/:id', getRate);

// Private routes (require authentication)
router.post('/', uploadRate, createRate);
router.put('/:id', uploadRate, updateRate);
router.delete('/:id', deleteRate);

module.exports = router;