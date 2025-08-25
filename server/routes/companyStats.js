const express = require('express');
const router = express.Router();
const {
  getCompanyStats,
  getCompanyStatById,
  createCompanyStat,
  updateCompanyStat,
  deleteCompanyStat,
  resetCompanyStats
} = require('../controllers/companyStatsController');

// GET /api/cms/company-stats - Get all company stats
router.get('/', getCompanyStats);

// GET /api/cms/company-stats/:id - Get single company stat
router.get('/:id', getCompanyStatById);

// POST /api/cms/company-stats - Create new company stat
router.post('/', createCompanyStat);

// PUT /api/cms/company-stats/:id - Update company stat
router.put('/:id', updateCompanyStat);

// DELETE /api/cms/company-stats/:id - Delete company stat
router.delete('/:id', deleteCompanyStat);

// POST /api/cms/company-stats/reset - Reset to default stats
router.post('/reset', resetCompanyStats);

module.exports = router;