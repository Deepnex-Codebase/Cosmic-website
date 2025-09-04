const express = require('express');
const router = express.Router();
const {
  getCareer,
  updateCareer,
  uploadImage,
  upload,
  getCultureValues,
  getCultureValueById,
  addCultureValue,
  updateCultureValue,
  deleteCultureValue,
  getBenefitCategories,
  getBenefitCategoryById,
  addBenefitCategory,
  updateBenefitCategory,
  deleteBenefitCategory,
  getJobPositions,
  getJobPositionById,
  addJobPosition,
  updateJobPosition,
  deleteJobPosition,
  getDepartments,
  getDepartmentById,
  addDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/careerController');

// Get career data
router.get('/', getCareer);

// Update career data
router.put('/', updateCareer);

// Upload image
router.post('/upload', upload.single('image'), uploadImage);

// Culture Values CRUD routes
router.get('/culture-values', getCultureValues);
router.get('/culture-values/:valueId', getCultureValueById);
router.post('/culture-values', addCultureValue);
router.put('/culture-values/:valueId', updateCultureValue);
router.delete('/culture-values/:valueId', deleteCultureValue);

// Benefit Categories CRUD routes
router.get('/benefit-categories', getBenefitCategories);
router.get('/benefit-categories/:categoryId', getBenefitCategoryById);
router.post('/benefit-categories', addBenefitCategory);
router.put('/benefit-categories/:categoryId', updateBenefitCategory);
router.delete('/benefit-categories/:categoryId', deleteBenefitCategory);

// Job Positions routes
router.get('/job-positions', getJobPositions);
router.get('/job-positions/:jobId', getJobPositionById);
router.post('/job-positions', addJobPosition);
router.put('/job-positions/:jobId', updateJobPosition);
router.delete('/job-positions/:jobId', deleteJobPosition);

// Departments routes
router.get('/departments', getDepartments);
router.get('/departments/:departmentId', getDepartmentById);
router.post('/departments', addDepartment);
router.put('/departments/:departmentId', updateDepartment);
router.delete('/departments/:departmentId', deleteDepartment);

module.exports = router;