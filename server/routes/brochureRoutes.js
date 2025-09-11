const express = require('express');
const {
  getBrochures,
  getBrochure,
  getActiveBrochure,
  createBrochure,
  updateBrochure,
  deleteBrochure,
  uploadBrochure
} = require('../controllers/brochureController');

const router = express.Router();

// All routes are public
router.get('/', getBrochures);
router.get('/active', getActiveBrochure);
router.get('/:id', getBrochure);
router.post('/', uploadBrochure, createBrochure);
router.put('/:id', uploadBrochure, updateBrochure);
router.delete('/:id', deleteBrochure);

module.exports = router;