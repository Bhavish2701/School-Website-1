/**
 * Role-Based Access Control (RBAC) & Object-Level Authorization Middleware
 *
 * Provides:
 * 1. authenticateUser - Validates JWT and attaches user to req.user
 * 2. authorizeRoles - Restricts routes by user role
 * 3. authorizeResource - Enforces object-level authorization (ID tampering protection)
 */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { User } = require('../models/user.model');

/**
 * 1. Authenticate User Middleware
 * Verifies JWT token and loads user profile into req.user
 */
const authenticateUser = asyncHandler(async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Authentication token missing or invalid');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);

    // Fetch user with role, profile, and relationship fields
    const user = await User.findById(decoded.id);
    if (!user) {
      throw ApiError.unauthorized('User associated with this token no longer exists');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated. Please contact administration.');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    if (err.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Authentication token has expired. Please refresh your session.');
    }
    throw ApiError.unauthorized('Invalid authentication token');
  }
});

/**
 * 2. Authorize Roles Middleware
 * Checks if the authenticated user's role is in the permitted list
 *
 * @param  {...string} roles - Permitted roles (e.g. 'SUPER_ADMIN', 'PRINCIPAL')
 */
const authorizeRoles = (...roles) => {
  const allowedRoles = roles.flat();

  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required before role authorization');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Access denied: Role '${req.user.role}' is not authorized to access this resource. Allowed roles: [${allowedRoles.join(', ')}]`
      );
    }

    next();
  };
};

/**
 * 3. Authorize Resource Middleware (Object-Level Authorization)
 * Enforces ownership and relationship rules so that users cannot access
 * unauthorized records simply by manipulating IDs in the URL.
 *
 * Rules enforced:
 * - SUPER_ADMIN: Unrestricted access across all resources.
 * - PRINCIPAL & VICE_PRINCIPAL: School-level management access across all resources.
 * - OFFICE: Administrative access when allowed for the resource type.
 * - STUDENT: Can access ONLY records where student === req.user._id.
 * - PARENT: Can access ONLY records where student belongs to parent's registered children.
 * - TEACHER: Can access ONLY records for classes and sections assigned to that teacher.
 *
 * @param {Object} options
 * @param {mongoose.Model} options.model - The Mongoose model to query
 * @param {string} [options.paramKey='id'] - The request param containing the record ID (e.g. :id)
 * @param {string} [options.studentField='student'] - Field on the document identifying the student
 * @param {string} [options.classField='class'] - Field on the document identifying class
 * @param {string} [options.sectionField='section'] - Field on the document identifying section
 * @param {boolean} [options.allowOffice=false] - Whether OFFICE staff can access this resource
 * @param {Function} [options.customCheck=null] - Optional async custom access validator: (req, doc) => boolean
 */
const authorizeResource = (options = {}) => {
  const {
    model,
    paramKey = 'id',
    studentField = 'student',
    classField = 'class',
    sectionField = 'section',
    allowOffice = false,
    customCheck = null,
  } = options;

  if (!model) {
    throw new Error('authorizeResource middleware requires a Mongoose model');
  }

  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required before resource authorization');
    }

    const resourceId = req.params[paramKey];
    if (!resourceId) {
      throw ApiError.badRequest(`Missing '${paramKey}' route parameter`);
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      throw ApiError.badRequest(`Invalid resource ID format: '${resourceId}'`);
    }

    // Query resource document
    const doc = await model.findById(resourceId);
    if (!doc) {
      throw ApiError.notFound(`Resource with ID '${resourceId}' not found`);
    }

    const userRole = req.user.role;
    const userId = req.user._id.toString();

    // 1. Full School Management Access: SUPER_ADMIN, PRINCIPAL, VICE_PRINCIPAL
    if (['SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL'].includes(userRole)) {
      req.resource = doc;
      return next();
    }

    // 2. Office Staff Access (if permitted for this resource)
    if (userRole === 'OFFICE' && allowOffice) {
      req.resource = doc;
      return next();
    }

    // 3. STUDENT Object-Level Check: Must own the record
    if (userRole === 'STUDENT') {
      const recordStudentId = (
        doc[studentField]?._id || doc[studentField] || doc.user || doc._id
      ).toString();

      if (recordStudentId !== userId) {
        throw ApiError.forbidden(
          `Object-level authorization failed: A student can access only their own records. Access to resource '${resourceId}' is strictly denied.`
        );
      }

      req.resource = doc;
      return next();
    }

    // 4. PARENT Object-Level Check: Must be the parent of the student owning this record
    if (userRole === 'PARENT') {
      const recordStudentId = (
        doc[studentField]?._id || doc[studentField] || doc._id
      ).toString();

      const parentChildren = (req.user.children || []).map((id) =>
        id.toString()
      );

      const isParentOfStudent = parentChildren.includes(recordStudentId);

      if (!isParentOfStudent) {
        throw ApiError.forbidden(
          `Object-level authorization failed: A parent can access only records belonging to their own children. Access to resource '${resourceId}' is strictly denied.`
        );
      }

      req.resource = doc;
      return next();
    }

    // 5. TEACHER Object-Level Check: Must be assigned to this class and section
    if (userRole === 'TEACHER') {
      const recordClass = doc[classField];
      const recordSection = doc[sectionField];

      const assignedClasses = req.user.assignedClasses || [];
      const isAssigned = assignedClasses.some(
        (assignment) =>
          assignment.class === recordClass &&
          (!assignment.section || assignment.section === recordSection)
      );

      if (!isAssigned) {
        const assignmentsStr = assignedClasses
          .map((a) => `${a.class}-${a.section || 'All'}`)
          .join(', ');
        throw ApiError.forbidden(
          `Object-level authorization failed: Teachers can access only assigned classes/students (Assigned: [${assignmentsStr || 'None'}]). Access to Class ${recordClass}-${recordSection} is denied.`
        );
      }

      req.resource = doc;
      return next();
    }

    // 6. Optional Custom Check
    if (typeof customCheck === 'function') {
      const isAllowed = await customCheck(req, doc);
      if (!isAllowed) {
        throw ApiError.forbidden('Object-level authorization failed custom policy check');
      }
      req.resource = doc;
      return next();
    }

    // If none of the role rules allowed access, deny
    throw ApiError.forbidden(
      `Object-level authorization failed: Role '${userRole}' is not permitted to access this record.`
    );
  });
};

module.exports = {
  authenticateUser,
  authorizeRoles,
  authorizeResource,
};
