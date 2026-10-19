/**
 * School Management Routes
 * Restricted to School Management Roles: PRINCIPAL, VICE_PRINCIPAL, SUPER_ADMIN
 */
const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/rbac.middleware');
const { User } = require('../models/user.model');
const StudentRecord = require('../models/studentRecord.model');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/v1/management/overview
 * @desc    School-level management summary and analytics
 * @access  Protected (SUPER_ADMIN, PRINCIPAL, VICE_PRINCIPAL only)
 */
router.get(
  '/overview',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL'),
  asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const studentsCount = await User.countDocuments({ role: 'STUDENT' });
    const teachersCount = await User.countDocuments({ role: 'TEACHER' });
    const parentsCount = await User.countDocuments({ role: 'PARENT' });
    const recordsCount = await StudentRecord.countDocuments();

    res.status(200).json({
      success: true,
      message: 'School management dashboard overview retrieved',
      data: {
        authorizedManager: {
          username: req.user.username,
          role: req.user.role,
          fullName: req.user.fullName,
        },
        metrics: {
          totalUsers,
          studentsCount,
          teachersCount,
          parentsCount,
          recordsCount,
          academicYear: '2025-2026',
        },
      },
    });
  })
);

module.exports = router;
