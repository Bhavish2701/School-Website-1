/**
 * Admission Express Router
 * Defines REST endpoints for:
 * - Public: Submit application, attach documents, check status
 * - Management: Search, filter, review, approve, reject, request documents, and auto-enroll
 */
const express = require('express');
const router = express.Router();

const { authenticateUser, authorizeRoles } = require('../middleware/rbac.middleware');
const {
  validateSubmitApplication,
  validateCheckStatus,
  validateUpdateStatus,
  validateUploadDocument,
} = require('../validators/admission.validator');
const admissionController = require('../controllers/admission.controller');

// ==========================================
// 1. PUBLIC ADMISSIONS ENDPOINTS
// ==========================================

// Public: Submit online admission application
router.post(
  '/apply',
  validateSubmitApplication,
  admissionController.submitApplication
);

// Public: Track application status (requires applicationNumber + phone)
router.get(
  '/status',
  validateCheckStatus,
  admissionController.checkStatus
);

// Public/Applicant: Upload / attach required documents to application
router.post(
  '/:id/documents',
  validateUploadDocument,
  admissionController.uploadDocument
);

// ==========================================
// 2. MANAGEMENT ADMINISTRATIVE ENDPOINTS
// ==========================================

// Management: Overview dashboard statistics & queue metrics
router.get(
  '/overview',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  admissionController.getStatsOverview
);

// Management: List applications with search, filter, and pagination
router.get(
  '/',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  admissionController.getApplications
);

// Management: Review full application details
router.get(
  '/:id',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  admissionController.getApplicationById
);

// Management: Update application status (SUBMITTED, UNDER_REVIEW, DOCUMENT_VERIFICATION, APPROVED, REJECTED, WAITLISTED)
router.patch(
  '/:id/status',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  validateUpdateStatus,
  admissionController.updateStatus
);

// Management: Convert approved application to enrolled Student record
router.post(
  '/:id/enroll',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  admissionController.enrollStudent
);

module.exports = router;
