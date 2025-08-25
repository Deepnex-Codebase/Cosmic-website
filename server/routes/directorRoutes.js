const express = require('express');
const router = express.Router();
const { directorUpload } = require('../config/multerConfig');
const {
  getAllDirectors,
  getDirector,
  createDirector,
  updateDirector,
  deleteDirector,
  updateDirectorOrder
} = require('../controllers/directorController');

// Get all directors and create new director
router
  .route('/')
  .get(getAllDirectors)
  .post(directorUpload.single('image'), createDirector);

// Get, update and delete director
router
  .route('/:id')
  .get(getDirector)
  .put(directorUpload.single('image'), updateDirector)
  .delete(deleteDirector);

// Update director order
router.route('/order/update').put(updateDirectorOrder);

module.exports = router;