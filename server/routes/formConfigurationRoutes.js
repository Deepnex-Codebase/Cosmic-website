const express = require('express');
const router = express.Router();
const {
  getFormConfiguration,
  updateFormConfiguration,
  addFormType,
  updateFormType,
  deleteFormType,
  submitForm
} = require('../controllers/formConfigurationController');

// Get form configuration
router.get('/', getFormConfiguration);

// Update form configuration
router.put('/:id', updateFormConfiguration);

// Add new form type
router.post('/:configId/form-types', addFormType);

// Update form type
router.put('/:configId/form-types/:typeId', updateFormType);

// Delete form type
router.delete('/:configId/form-types/:typeId', deleteFormType);

// Submit form data
router.post('/submit', submitForm);

module.exports = router;