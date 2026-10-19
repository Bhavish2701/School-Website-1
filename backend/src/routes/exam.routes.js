/**
 * Examination Express Router
 * Defines REST endpoints for:
 * - Management: Exam creation, scheduling, rank calculation, result publishing
 * - Teachers: Subject marks entry and modification (strictly limited to assigned subjects/classes)
 * - Students: Secure report cards and marks memos viewing (only published results)
 * - Parents: Tamper-proof child report cards and marks memos viewing (only published results)
 */
const express = require('express');
const router = express.Router();

const { authenticateUser, authorizeRoles } = require('../middleware/rbac.middleware');
const { verifyParentChildAccess } = require('../middleware/parentChild.middleware');
const {
  validateCreateExam,
  validateCreateSchedule,
  validateEnterMarks,
} = require('../validators/exam.validator');
const examController = require('../controllers/exam.controller');

// ==========================================
// 1. STUDENT PORTAL ENDPOINTS (Read-Only)
// ==========================================

// Student: View own published report cards / exam results
router.get(
  '/student/me/results',
  authenticateUser,
  authorizeRoles('STUDENT'),
  examController.getStudentOwnResults
);

// Student: View own marks memo for specific exam
router.get(
  '/:id/student/me',
  authenticateUser,
  authorizeRoles('STUDENT'),
  examController.getStudentOwnExamResult
);

// ==========================================
// 2. PARENT PORTAL ENDPOINTS (Read-Only & Parent-Child Protected)
// ==========================================

// Parent: View child's published report cards
router.get(
  '/parent/child/:childId/results',
  authenticateUser,
  authorizeRoles('PARENT', 'SUPER_ADMIN', 'PRINCIPAL'),
  verifyParentChildAccess('childId'),
  examController.getChildResults
);

// Parent: View child's marks memo for specific exam
router.get(
  '/:id/parent/child/:childId',
  authenticateUser,
  authorizeRoles('PARENT', 'SUPER_ADMIN', 'PRINCIPAL'),
  verifyParentChildAccess('childId'),
  examController.getChildExamResult
);

// ==========================================
// 3. TEACHER & STAFF MARKS ENTRY ENDPOINTS
// ==========================================

// Teachers/Management: Enter subject marks (enforces teacher assigned class/subject check)
router.post(
  '/:id/marks',
  authenticateUser,
  authorizeRoles('TEACHER', 'SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  validateEnterMarks,
  examController.enterMarks
);

// Teachers/Management: Modify student subject mark (enforces teacher assigned class/subject check)
router.patch(
  '/marks/:markId/subject',
  authenticateUser,
  authorizeRoles('TEACHER', 'SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  examController.modifyMark
);

// Teachers/Management: View class results dossier
router.get(
  '/:id/class/:class/:section/dossier',
  authenticateUser,
  authorizeRoles('TEACHER', 'SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  examController.getClassMarksDossier
);

// ==========================================
// 4. MANAGEMENT ADMINISTRATIVE ENDPOINTS
// ==========================================

// Management: Create new examination
router.post(
  '/',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  validateCreateExam,
  examController.createExam
);

// Management: Schedule subject timetable for exam
router.post(
  '/:id/schedule',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  validateCreateSchedule,
  examController.createSchedule
);

// Management: Calculate class results and rankings
router.post(
  '/:id/calculate-results',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  examController.calculateResults
);

// Management: Publish exam results to Students & Parents
router.post(
  '/:id/publish',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
  examController.publishResults
);

// ==========================================
// 5. GENERAL AUTHENTICATED EXAM DIRECTORY
// ==========================================

// List exams (filtered by publication status for students/parents)
router.get('/', authenticateUser, examController.getExams);

// View exam schedule
router.get('/:id/schedule', authenticateUser, examController.getExamSchedule);

// View exam details
router.get('/:id', authenticateUser, examController.getExamById);

module.exports = router;
