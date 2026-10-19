/**
 * Dashboard Express Router
 *
 * Implements:
 * GET /api/v1/dashboard/management
 * GET /api/v1/dashboard/teacher
 * GET /api/v1/dashboard/student
 * GET /api/v1/dashboard/parent
 *
 * Enforces strict authentication and role-based / object-level authorization.
 */
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/rbac.middleware');

// 1. Management Dashboard
router.get(
  '/management',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  dashboardController.getManagementDashboard
);

// 2. Teacher Dashboard
router.get(
  '/teacher',
  authenticateUser,
  authorizeRoles('TEACHER', 'SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL'),
  dashboardController.getTeacherDashboard
);

// 3. Student Dashboard
router.get(
  '/student',
  authenticateUser,
  authorizeRoles('STUDENT', 'PARENT', 'SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE', 'TEACHER'),
  dashboardController.getStudentDashboard
);

// 4. Parent Dashboard
router.get(
  '/parent',
  authenticateUser,
  authorizeRoles('PARENT', 'SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL'),
  dashboardController.getParentDashboard
);

module.exports = router;
