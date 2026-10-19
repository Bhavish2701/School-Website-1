/**
 * Teacher Module HTTP Controller
 * Dispatches HTTP requests to TeacherService and formats uniform API responses.
 */
const teacherService = require('../services/teacher.service');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// 1. Teacher CRUD & Profiles
const getTeachers = asyncHandler(async (req, res) => {
  const result = await teacherService.getTeachers(req.query, req.user);
  sendSuccess(res, { teachers: result.records, pagination: result.pagination }, 'Teachers retrieved successfully', 200);
});

const getTeacherById = asyncHandler(async (req, res) => {
  const teacher = await teacherService.getTeacherById(req.params.id, req.user);
  sendSuccess(res, { teacher }, 'Teacher details retrieved successfully', 200);
});

const getMyProfile = asyncHandler(async (req, res) => {
  const teacher = await teacherService.getMyProfile(req.user);
  sendSuccess(res, { teacher }, 'Teacher profile retrieved successfully', 200);
});

const createTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.createTeacher(req.body, req.user);
  sendSuccess(res, { teacher }, 'Teacher profile created successfully', 201);
});

const updateTeacher = asyncHandler(async (req, res) => {
  const teacher = await teacherService.updateTeacher(req.params.id, req.body, req.user);
  sendSuccess(res, { teacher }, 'Teacher profile updated successfully', 200);
});

const deleteTeacher = asyncHandler(async (req, res) => {
  const result = await teacherService.deleteTeacher(req.params.id, req.user);
  sendSuccess(res, result, 'Teacher profile deleted successfully', 200);
});

// 2. Timetable Management
const getTimetable = asyncHandler(async (req, res) => {
  const timetableData = await teacherService.getTimetable(req.params.id || 'me', req.user);
  sendSuccess(res, timetableData, 'Teacher timetable retrieved successfully', 200);
});

const updateTimetable = asyncHandler(async (req, res) => {
  const timetableData = await teacherService.updateTimetable(req.params.id, req.body.timetable, req.user);
  sendSuccess(res, timetableData, 'Teacher timetable updated successfully', 200);
});

// 3. Dashboard Statistics
const getDashboard = asyncHandler(async (req, res) => {
  const dashboardData = await teacherService.getTeacherDashboard(req.user);
  sendSuccess(res, { dashboard: dashboardData }, 'Teacher dashboard overview retrieved successfully', 200);
});

// 4. Leave Management
const applyLeave = asyncHandler(async (req, res) => {
  const leave = await teacherService.applyLeave(req.user, req.body);
  sendSuccess(res, { leave }, 'Leave application submitted successfully', 201);
});

const getLeaves = asyncHandler(async (req, res) => {
  const leaves = await teacherService.getLeaves(req.user, req.query);
  sendSuccess(res, { leaves }, 'Leave records retrieved successfully', 200);
});

const reviewLeave = asyncHandler(async (req, res) => {
  const leave = await teacherService.reviewLeave(req.params.id, req.user, req.body);
  sendSuccess(res, { leave }, `Leave request ${req.body.status.toLowerCase()} successfully`, 200);
});

// 5. Notifications & Announcements
const getNotifications = asyncHandler(async (req, res) => {
  const data = await teacherService.getNotifications(req.user);
  sendSuccess(res, data, 'Notifications retrieved successfully', 200);
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await teacherService.markNotificationRead(req.params.id, req.user);
  sendSuccess(res, { notification }, 'Notification marked as read', 200);
});

const createNotification = asyncHandler(async (req, res) => {
  const notification = await teacherService.createNotification(req.user, req.body);
  sendSuccess(res, { notification }, 'Notification published successfully', 201);
});

module.exports = {
  getTeachers,
  getTeacherById,
  getMyProfile,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTimetable,
  updateTimetable,
  getDashboard,
  applyLeave,
  getLeaves,
  reviewLeave,
  getNotifications,
  markNotificationRead,
  createNotification,
};
