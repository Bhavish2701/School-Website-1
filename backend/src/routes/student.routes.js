/**
 * Student Module Routes
 *
 * Architecture Flow:
 * Route → Middleware → Controller → Service → Model
 */
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/rbac.middleware');
const {
  validateCreateStudent,
  validateUpdateStudent,
} = require('../validators/student.validator');

// 1. Dashboard Statistics Route (Must precede /:id parameter route)
router.get(
  '/dashboard/stats',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE', 'TEACHER'),
  studentController.getDashboardStats
);

// 2. Student Collection Routes
router
  .route('/')
  .get(authenticateUser, studentController.getStudents)
  .post(
    authenticateUser,
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
    validateCreateStudent,
    studentController.createStudent
  );

// 3. Individual Student Member Routes
router
  .route('/:id')
  .get(authenticateUser, studentController.getStudentById)
  .patch(
    authenticateUser,
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE', 'TEACHER'),
    validateUpdateStudent,
    studentController.updateStudent
  )
  .delete(
    authenticateUser,
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL'),
    studentController.deleteStudent
  );

module.exports = router;
