const express = require('express');
const router = express.Router();
const {
  getFooterConfiguration,
  updateFooterConfiguration,
  addFooterSection,
  updateFooterSection,
  deleteFooterSection,
  addLinkToSection,
  updateLinkInSection,
  deleteLinkFromSection,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink
} = require('../controllers/footerConfigurationController');

// Get active footer configuration
router.get('/', getFooterConfiguration);

// Update footer configuration
router.put('/:id', updateFooterConfiguration);

// Footer sections routes
router.post('/:id/sections', addFooterSection);
router.put('/:id/sections/:sectionId', updateFooterSection);
router.delete('/:id/sections/:sectionId', deleteFooterSection);

// Footer section links routes
router.post('/:id/sections/:sectionId/links', addLinkToSection);
router.put('/:id/sections/:sectionId/links/:linkId', updateLinkInSection);
router.delete('/:id/sections/:sectionId/links/:linkId', deleteLinkFromSection);

// Social links routes
router.post('/:id/social-links', addSocialLink);
router.put('/:id/social-links/:socialId', updateSocialLink);
router.delete('/:id/social-links/:socialId', deleteSocialLink);

module.exports = router;