/**
 * Timetable Routes
 */
const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetable.controller');
const { authenticateUser, authorizeRoles } = require('../middleware/rbac.middleware');

// Public read or authenticated read
router.get('/class/:className', timetableController.getClassTimetable);

// Conflict validation check (for frontend interactive form checks)
router.post('/validate-conflict', timetableController.validateConflict);

// Assignment creation/update (Authorized staff)
router.post(
  '/assign',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL'),
  timetableController.assignPeriod
);

module.exports = router;
