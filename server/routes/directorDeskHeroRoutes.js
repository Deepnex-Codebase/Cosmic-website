const express = require('express');
const router = express.Router();
const { directorDeskHeroUpload } = require('../config/multerConfig');
const {
  getAllDirectorDeskHeroes,
  getDirectorDeskHero,
  createDirectorDeskHero,
  updateDirectorDeskHero,
  deleteDirectorDeskHero,
  getActiveDirectorDeskHero
} = require('../controllers/directorDeskHeroController');

// Get all director desk heroes and create new one
router
  .route('/')
  .get(getAllDirectorDeskHeroes)
  .post(directorDeskHeroUpload.single('media'), createDirectorDeskHero);

// Get active director desk hero
router.route('/active').get(getActiveDirectorDeskHero);

// Get, update and delete director desk hero
router
  .route('/:id')
  .get(getDirectorDeskHero)
  .put(directorDeskHeroUpload.single('media'), updateDirectorDeskHero)
  .delete(deleteDirectorDeskHero);

module.exports = router;