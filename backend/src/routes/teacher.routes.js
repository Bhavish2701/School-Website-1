/**
 * Teacher Module Routes
 *
 * Architecture:
 * Route → Middleware → Controller → Service → Model
 */
const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/rbac.middleware');
const {
  validateCreateTeacher,
  validateUpdateTeacher,
  validateApplyLeave,
  validateReviewLeave,
  validateCreateNotification,
} = require('../validators/teacher.validator');

// All teacher routes require authentication
router.use(authenticateUser);

// 1. Current Teacher Self-Service & Workspace Routes (Restricted to Faculty & Management)
router.get(
  '/me',
  authorizeRoles('TEACHER', 'PRINCIPAL', 'VICE_PRINCIPAL', 'SUPER_ADMIN'),
  teacherController.getMyProfile
);
router.get(
  '/me/timetable',
  authorizeRoles('TEACHER', 'PRINCIPAL', 'VICE_PRINCIPAL', 'SUPER_ADMIN'),
  teacherController.getTimetable
);
router.get(
  '/dashboard',
  authorizeRoles('TEACHER', 'PRINCIPAL', 'VICE_PRINCIPAL', 'SUPER_ADMIN'),
  teacherController.getDashboard
);

// 2. Leave Management Routes (Faculty & Management)
router
  .route('/leaves')
  .get(
    authorizeRoles('TEACHER', 'PRINCIPAL', 'VICE_PRINCIPAL', 'SUPER_ADMIN', 'OFFICE'),
    teacherController.getLeaves
  )
  .post(
    authorizeRoles('TEACHER'),
    validateApplyLeave,
    teacherController.applyLeave
  );

router.patch(
  '/leaves/:id/status',
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL'),
  validateReviewLeave,
  teacherController.reviewLeave
);

// 3. Notifications & Announcements Routes
router
  .route('/notifications')
  .get(
    authorizeRoles('TEACHER', 'PRINCIPAL', 'VICE_PRINCIPAL', 'SUPER_ADMIN'),
    teacherController.getNotifications
  )
  .post(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER'),
    validateCreateNotification,
    teacherController.createNotification
  );

router.patch(
  '/notifications/:id/read',
  authorizeRoles('TEACHER', 'PRINCIPAL', 'VICE_PRINCIPAL', 'SUPER_ADMIN'),
  teacherController.markNotificationRead
);

// 4. Timetable Management Routes
router
  .route('/:id/timetable')
  .get(
    authorizeRoles('TEACHER', 'PRINCIPAL', 'VICE_PRINCIPAL', 'SUPER_ADMIN', 'OFFICE'),
    teacherController.getTimetable
  )
  .put(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL'),
    teacherController.updateTimetable
  );

// 5. Teacher CRUD Routes
router
  .route('/')
  .get(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE', 'TEACHER'),
    teacherController.getTeachers
  )
  .post(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'),
    validateCreateTeacher,
    teacherController.createTeacher
  );

router
  .route('/:id')
  .get(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE', 'TEACHER'),
    teacherController.getTeacherById
  )
  .patch(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE', 'TEACHER'),
    validateUpdateTeacher,
    teacherController.updateTeacher
  )
  .delete(
    authorizeRoles('SUPER_ADMIN', 'PRINCIPAL'),
    teacherController.deleteTeacher
  );

module.exports = router;
