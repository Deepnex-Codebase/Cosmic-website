const express = require('express');
const router = express.Router();
const { teamUpload } = require('../config/multerConfig');
const {
  getAllTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  updateTeamMemberOrder
} = require('../controllers/teamMemberController');

// Get all team members and create new team member
router
  .route('/')
  .get(getAllTeamMembers)
  .post(teamUpload.single('image'), createTeamMember);

// Get, update and delete team member
router
  .route('/:id')
  .get(getTeamMember)
  .put(teamUpload.single('image'), updateTeamMember)
  .delete(deleteTeamMember);

// Update team member order
router.route('/order/:id/:direction').put(updateTeamMemberOrder);

module.exports = router;