/**
 * Admission Controller
 * Handles HTTP requests for public online admission registrations, document uploads,
 * application status inquiries, and administrative application review workflows.
 */
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const admissionService = require('../services/admission.service');

/**
 * 1. Submit Online Admission Application (Public)
 */
const submitApplication = asyncHandler(async (req, res) => {
  const application = await admissionService.submitApplication(req.body);
  return sendSuccess(
    res,
    {
      applicationNumber: application.applicationNumber,
      studentName: application.studentName,
      applyingClass: application.applyingClass,
      status: application.status,
      application,
    },
    `Application submitted successfully. Your reference number is ${application.applicationNumber}`,
    201
  );
});

/**
 * 2. Check Application Status (Public)
 */
const checkStatus = asyncHandler(async (req, res) => {
  const { applicationNumber, phone } = req.query;
  const result = await admissionService.checkApplicationStatus(applicationNumber, phone);
  return sendSuccess(res, result, 'Application status retrieved successfully', 200);
});

/**
 * 3. Upload / Attach Document to Application
 */
const uploadDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const application = await admissionService.uploadDocument(id, req.body);
  return sendSuccess(res, { application }, 'Document attached to application successfully', 200);
});

/**
 * 4. Get Applications List (Management: Search, Filter, Pagination)
 */
const getApplications = asyncHandler(async (req, res) => {
  const result = await admissionService.getApplications(req.query);
  return sendSuccess(res, result, 'Admissions applications retrieved successfully', 200);
});

/**
 * 5. Get Application Details by ID (Management Review)
 */
const getApplicationById = asyncHandler(async (req, res) => {
  const application = await admissionService.getApplicationById(req.params.id);
  return sendSuccess(res, { application }, 'Application details retrieved successfully', 200);
});

/**
 * 6. Update Application Status (Management Action)
 */
const updateStatus = asyncHandler(async (req, res) => {
  const application = await admissionService.updateApplicationStatus(req.params.id, req.body, req.user);
  return sendSuccess(
    res,
    { application },
    `Application ${application.applicationNumber} updated to '${application.status}'`,
    200
  );
});

/**
 * 7. Get Admissions Dashboard Overview & Queue Metrics (Management)
 */
const getStatsOverview = asyncHandler(async (req, res) => {
  const result = await admissionService.getAdmissionStatsOverview();
  return sendSuccess(res, result, 'Admissions dashboard statistics retrieved successfully', 200);
});

/**
 * 8. Convert Approved Application to Enrolled Student (Management)
 */
const enrollStudent = asyncHandler(async (req, res) => {
  const result = await admissionService.convertToStudent(req.params.id, req.body, req.user);
  return sendSuccess(res, result, result.message, 201);
});

module.exports = {
  submitApplication,
  checkStatus,
  uploadDocument,
  getApplications,
  getApplicationById,
  updateStatus,
  getStatsOverview,
  enrollStudent,
};
