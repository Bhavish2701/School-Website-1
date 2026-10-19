/**
 * Academic Module Routes
 *
 * Architecture:
 * Express routes → Middlewares (Auth & RBAC) → Controllers → Services → Mongoose models
 */
const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academic.controller');
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/rbac.middleware');
const {
  validateCreateAcademicYear,
  validateCreateClass,
  validateCreateSubject,
  validateAssignTeacher,
  validateCreateAssignment,
} = require('../validators/academic.validator');

// All academic routes require authentication
router.use(authenticateUser);

// 1. Academic Dashboard (Accessible to all authenticated staff & students/parents read overview)
router.get('/dashboard', academicController.getAcademicDashboard);

// 2. Academic Years
router
  .route('/years')
  .get(academicController.getAcademicYears)
  .post(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL'),
    validateCreateAcademicYear,
    academicController.createAcademicYear
  );

router.patch(
  '/years/:id/set-current',
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL'),
  academicController.setCurrentYear
);

// 3. Classes & Sections
router
  .route('/classes')
  .get(academicController.getClasses)
  .post(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
    validateCreateClass,
    academicController.createClass
  );

router
  .route('/classes/:id')
  .get(academicController.getClassById)
  .patch(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
    academicController.updateClass
  );

// 4. Teacher Allocations
router.post(
  '/classes/:id/assign-teacher',
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL'),
  validateAssignTeacher,
  academicController.assignTeacher
);

// 5. Subjects
router
  .route('/subjects')
  .get(academicController.getSubjects)
  .post(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
    validateCreateSubject,
    academicController.createSubject
  );

router
  .route('/subjects/:id')
  .patch(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL'),
    academicController.updateSubject
  )
  .delete(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL'),
    academicController.deleteSubject
  );

// 6. Class Assignments (Homework / Projects)
router
  .route('/assignments')
  .get(academicController.getAssignments)
  .post(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER'),
    validateCreateAssignment,
    academicController.createAssignment
  );

router
  .route('/assignments/:id')
  .get(academicController.getAssignmentById)
  .patch(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER'),
    academicController.updateAssignment
  )
  .delete(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'TEACHER'),
    academicController.deleteAssignment
  );

module.exports = router;
