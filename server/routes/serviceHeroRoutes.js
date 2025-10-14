const express = require('express');
const router = express.Router();
const serviceHeroController = require('../controllers/serviceHeroController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', serviceHeroController.getAllServiceHeroes);
router.get('/active', serviceHeroController.getActiveServiceHero);

// Protected routes (require authentication)
router.post('/', protect, (req, res) => {
  serviceHeroController.upload.fields([
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'backgroundVideo', maxCount: 1 }
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    serviceHeroController.createServiceHero(req, res);
  });
});

router.put('/:id', (req, res) => {
  serviceHeroController.upload.fields([
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'backgroundVideo', maxCount: 1 }
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    serviceHeroController.updateServiceHero(req, res);
  });
});

router.delete('/:id', serviceHeroController.deleteServiceHero);
router.patch('/:id/activate', protect, serviceHeroController.setActiveHero);

module.exports = router;