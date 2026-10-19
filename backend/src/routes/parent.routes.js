/**
 * Parent Module Routes
 *
 * Architecture:
 * Route → Middleware → Controller → Service → Model
 * Enforces secure parent-child authorization so that a parent
 * can never access another parent's child.
 */
const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parent.controller');
const {
  authenticateUser,
  authorizeRoles,
} = require('../middleware/rbac.middleware');
const { verifyParentChildAccess } = require('../middleware/parentChild.middleware');
const {
  validateUpdateProfile,
  validateChildLeave,
  validateParentMessage,
} = require('../validators/parent.validator');

// All parent routes require authentication and role authorization
router.use(authenticateUser);
router.use(authorizeRoles('PARENT', 'SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL'));

// 1. Parent Profile Routes
router
  .route('/profile')
  .get(parentController.getProfile)
  .patch(validateUpdateProfile, parentController.updateProfile);

// 2. Multiple Children (Child Switcher) Route
router.get('/children', parentController.getChildren);

// 3. Secure Child-Specific Routes (Protected by verifyParentChildAccess)
router.get(
  '/children/:childId/overview',
  verifyParentChildAccess('childId'),
  parentController.getChildOverview
);

router.get(
  '/children/:childId/attendance',
  verifyParentChildAccess('childId'),
  parentController.getChildAttendance
);

router.get(
  '/children/:childId/assignments',
  verifyParentChildAccess('childId'),
  parentController.getChildAssignments
);

router.get(
  '/children/:childId/results',
  verifyParentChildAccess('childId'),
  parentController.getChildExamsAndResults
);

router.get(
  '/children/:childId/fees',
  verifyParentChildAccess('childId'),
  parentController.getChildFees
);

router.get(
  '/children/:childId/notices',
  verifyParentChildAccess('childId'),
  parentController.getChildNotices
);

router.post(
  '/children/:childId/leaves',
  verifyParentChildAccess('childId'),
  validateChildLeave,
  parentController.applyChildLeave
);

// 4. Communication & Messages
router
  .route('/messages')
  .get(parentController.getMessages)
  .post(validateParentMessage, parentController.sendMessage);

// 5. Notifications
router.get('/notifications', parentController.getNotifications);

module.exports = router;
