/**
 * Attendance Express Router
 * Defines REST endpoints for:
 * - Teacher: class roster, marking, permitted updates, registers history
 * - Student: self attendance metrics, daily logs, monthly calendar
 * - Parent: child attendance tracking with tamper-proof parent-child authorization
 * - Management: school overview, class breakdown, low-attendance reports
 */
const express = require('express');
const router = express.Router();

const { authenticateUser, authorizeRoles } = require('../middleware/rbac.middleware');
const { verifyParentChildAccess } = require('../middleware/parentChild.middleware');
const {
  validateMarkAttendance,
  validateUpdateRecord,
} = require('../validators/attendance.validator');
const attendanceController = require('../controllers/attendance.controller');

// ==========================================
// 1. TEACHER ATTENDANCE ENDPOINTS
// ==========================================

// Teacher: View assigned classes with today's status
router.get(
  '/teacher/classes',
  authenticateUser,
  authorizeRoles('TEACHER'),
  attendanceController.getTeacherClasses
);

// Teacher/Management: Get class student roster for marking attendance
router.get(
  '/classes/:class/:section/students',
  authenticateUser,
  authorizeRoles('TEACHER', 'SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  attendanceController.getClassStudents
);

// Teacher/Management: Mark and submit attendance (with backend validation and duplicate prevention)
router.post(
  '/mark',
  authenticateUser,
  authorizeRoles('TEACHER', 'SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  validateMarkAttendance,
  attendanceController.markAttendance
);

// Teacher/Management: Update permitted attendance record
router.patch(
  '/records/:id',
  authenticateUser,
  authorizeRoles('TEACHER', 'SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  validateUpdateRecord,
  attendanceController.updateRecord
);

// Teacher/Management: View attendance registers history
router.get(
  '/history',
  authenticateUser,
  authorizeRoles('TEACHER', 'SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  attendanceController.getHistory
);

// ==========================================
// 2. STUDENT ATTENDANCE ENDPOINTS
// ==========================================

// Student: View own attendance summary (percentage, days present/absent)
router.get(
  '/student/me',
  authenticateUser,
  authorizeRoles('STUDENT'),
  attendanceController.getStudentSummary
);

// Student: View own daily attendance log
router.get(
  '/student/me/daily',
  authenticateUser,
  authorizeRoles('STUDENT'),
  attendanceController.getStudentDaily
);

// Student: View own monthly attendance calendar
router.get(
  '/student/me/monthly',
  authenticateUser,
  authorizeRoles('STUDENT'),
  attendanceController.getStudentMonthly
);

// ==========================================
// 3. PARENT ATTENDANCE ENDPOINTS (Strict Parent-Child Authorization)
// ==========================================

// Parent: View child's attendance summary
router.get(
  '/parent/child/:childId',
  authenticateUser,
  authorizeRoles('PARENT', 'SUPER_ADMIN', 'PRINCIPAL'),
  verifyParentChildAccess('childId'),
  attendanceController.getChildSummary
);

// Parent: View child's daily attendance log
router.get(
  '/parent/child/:childId/daily',
  authenticateUser,
  authorizeRoles('PARENT', 'SUPER_ADMIN', 'PRINCIPAL'),
  verifyParentChildAccess('childId'),
  attendanceController.getChildDaily
);

// Parent: View child's monthly attendance calendar
router.get(
  '/parent/child/:childId/monthly',
  authenticateUser,
  authorizeRoles('PARENT', 'SUPER_ADMIN', 'PRINCIPAL'),
  verifyParentChildAccess('childId'),
  attendanceController.getChildMonthly
);

// ==========================================
// 4. MANAGEMENT ATTENDANCE ENDPOINTS
// ==========================================

// Management: School-wide daily attendance overview
router.get(
  '/management/overview',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  attendanceController.getManagementOverview
);

// Management: View specific class attendance details
router.get(
  '/management/class/:class/:section',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  attendanceController.getManagementClassAttendance
);

// Management: Analytical attendance reports and low-attendance alerts
router.get(
  '/management/reports',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  attendanceController.getManagementReports
);

// ==========================================
// 5. ABSENTEE NOTIFICATION ENDPOINTS
// ==========================================
router.post(
  '/absentees/dispatch',
  attendanceController.dispatchAbsenteeNotifications
);

router.post(
  '/absentees/:admNo/resend',
  attendanceController.resendAbsenteeNotification
);

module.exports = router;
