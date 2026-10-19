/**
 * Parent Module HTTP Controller
 * Dispatches requests to ParentService and formats uniform responses.
 */
const parentService = require('../services/parent.service');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// 1. Parent Profile
const getProfile = asyncHandler(async (req, res) => {
  const profile = await parentService.getProfile(req.user);
  sendSuccess(res, profile, 'Parent profile retrieved successfully', 200);
});

const updateProfile = asyncHandler(async (req, res) => {
  const updated = await parentService.updateProfile(req.user, req.body);
  sendSuccess(res, { profile: updated }, 'Parent profile updated successfully', 200);
});

// 2. Children List (Child Switcher)
const getChildren = asyncHandler(async (req, res) => {
  const children = await parentService.getChildren(req.user);
  sendSuccess(res, { children }, 'Linked children retrieved successfully', 200);
});

// 3. Child Specific Modules (req.child is guaranteed and verified by verifyParentChildAccess)
const getChildOverview = asyncHandler(async (req, res) => {
  const overview = await parentService.getChildOverview(req.user, req.child);
  sendSuccess(res, overview, 'Child overview dashboard retrieved successfully', 200);
});

const getChildAttendance = asyncHandler(async (req, res) => {
  const attendance = await parentService.getChildAttendance(req.user, req.child);
  sendSuccess(res, attendance, 'Child attendance retrieved successfully', 200);
});

const getChildAssignments = asyncHandler(async (req, res) => {
  const assignments = await parentService.getChildAssignments(req.user, req.child);
  sendSuccess(res, assignments, 'Child assignments retrieved successfully', 200);
});

const getChildExamsAndResults = asyncHandler(async (req, res) => {
  const results = await parentService.getChildExamsAndResults(req.user, req.child);
  sendSuccess(res, results, 'Child exam results retrieved successfully', 200);
});

const getChildFees = asyncHandler(async (req, res) => {
  const fees = await parentService.getChildFees(req.user, req.child);
  sendSuccess(res, fees, 'Child fee invoices and payments retrieved successfully', 200);
});

const getChildNotices = asyncHandler(async (req, res) => {
  const notices = await parentService.getChildNotices(req.user, req.child);
  sendSuccess(res, notices, 'Child notices retrieved successfully', 200);
});

const applyChildLeave = asyncHandler(async (req, res) => {
  const leave = await parentService.applyChildLeave(req.user, req.child, req.body);
  sendSuccess(res, leave, 'Child leave request submitted successfully', 201);
});

// 4. Communication & Messages
const getMessages = asyncHandler(async (req, res) => {
  const messages = await parentService.getMessages(req.user);
  sendSuccess(res, { messages }, 'Messages retrieved successfully', 200);
});

const sendMessage = asyncHandler(async (req, res) => {
  const message = await parentService.sendMessage(req.user, req.child || null, req.body);
  sendSuccess(res, { message }, 'Message sent to teacher successfully', 201);
});

// 5. Notifications
const getNotifications = asyncHandler(async (req, res) => {
  const data = await parentService.getNotifications(req.user);
  sendSuccess(res, data, 'Parent notifications retrieved successfully', 200);
});

module.exports = {
  getProfile,
  updateProfile,
  getChildren,
  getChildOverview,
  getChildAttendance,
  getChildAssignments,
  getChildExamsAndResults,
  getChildFees,
  getChildNotices,
  applyChildLeave,
  getMessages,
  sendMessage,
  getNotifications,
};
