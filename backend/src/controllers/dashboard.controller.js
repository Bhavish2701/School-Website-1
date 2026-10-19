/**
 * Dashboard HTTP Controller
 *
 * Exposes optimized endpoints:
 * 1. GET /api/v1/dashboard/management
 * 2. GET /api/v1/dashboard/teacher
 * 3. GET /api/v1/dashboard/student
 * 4. GET /api/v1/dashboard/parent
 */
const dashboardService = require('../services/dashboard.service');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/v1/dashboard/management
 * @desc    Get executive school management dashboard data (students, teachers, attendance, admissions, academic, activities)
 * @access  Protected (SUPER_ADMIN, PRINCIPAL, VICE_PRINCIPAL, OFFICE)
 */
const getManagementDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getManagementDashboard(req.user);
  return sendSuccess(
    res,
    dashboard,
    'School executive management dashboard retrieved successfully',
    200
  );
});

/**
 * @route   GET /api/v1/dashboard/teacher
 * @desc    Get teacher operational dashboard (classes, today's timetable, attendance tracker, assignments, notifications)
 * @access  Protected (TEACHER, SUPER_ADMIN, PRINCIPAL, VICE_PRINCIPAL)
 */
const getTeacherDashboard = asyncHandler(async (req, res) => {
  const requestedTeacherId = req.query.teacherId || null;
  const dashboard = await dashboardService.getTeacherDashboard(req.user, requestedTeacherId);
  return sendSuccess(
    res,
    dashboard,
    'Teacher operational dashboard retrieved successfully',
    200
  );
});

/**
 * @route   GET /api/v1/dashboard/student
 * @desc    Get student academic dashboard (attendance percentage & history, timetable, assignments, exams, results, notices)
 * @access  Protected (STUDENT, PARENT, SUPER_ADMIN, PRINCIPAL, VICE_PRINCIPAL, OFFICE, TEACHER)
 */
const getStudentDashboard = asyncHandler(async (req, res) => {
  const requestedStudentId = req.query.studentId || null;
  const dashboard = await dashboardService.getStudentDashboard(req.user, requestedStudentId);
  return sendSuccess(
    res,
    dashboard,
    'Student academic dashboard retrieved successfully',
    200
  );
});

/**
 * @route   GET /api/v1/dashboard/parent
 * @desc    Get parent overview dashboard (children, child attendance, assignments, exams, fees, notices, notifications)
 * @access  Protected (PARENT, SUPER_ADMIN, PRINCIPAL, VICE_PRINCIPAL)
 */
const getParentDashboard = asyncHandler(async (req, res) => {
  const requestedChildId = req.query.childId || null;
  const dashboard = await dashboardService.getParentDashboard(req.user, requestedChildId);
  return sendSuccess(
    res,
    dashboard,
    'Parent overview dashboard retrieved successfully',
    200
  );
});

module.exports = {
  getManagementDashboard,
  getTeacherDashboard,
  getStudentDashboard,
  getParentDashboard,
};
