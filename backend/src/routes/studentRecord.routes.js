/**
 * Student Records & Academic Routes
 * Demonstrates and enforces Role-Based & Object-Level Authorization,
 * as well as Common Infrastructure (Pagination, Filtering, Searching, Sorting, Validation)
 */
const express = require('express');
const router = express.Router();
const StudentRecord = require('../models/studentRecord.model');
const {
  authenticateUser,
  authorizeRoles,
  authorizeResource,
} = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');
const QueryFeatures = require('../utils/queryFeatures');
const { formatSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/v1/records/:id
 * @desc    Get specific student academic record by ID (Object-Level Authorization)
 */
router.get(
  '/:id',
  authenticateUser,
  authorizeResource({
    model: StudentRecord,
    paramKey: 'id',
    studentField: 'student',
    classField: 'class',
    sectionField: 'section',
    allowOffice: true,
  }),
  asyncHandler(async (req, res) => {
    res.status(200).json(
      formatSuccess(
        {
          record: req.resource,
          accessedBy: {
            username: req.user.username,
            role: req.user.role,
          },
        },
        'Student record retrieved successfully (Object-level authorized)'
      )
    );
  })
);

/**
 * @route   GET /api/v1/records
 * @desc    List student records with Pagination, Filtering, Searching, and Sorting
 * @access  Protected (Scoped by role)
 */
router.get(
  '/',
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.user;
    let baseQuery = {};

    // 1. Role-based scoping
    if (user.role === 'STUDENT') {
      baseQuery.student = user._id;
    } else if (user.role === 'PARENT') {
      baseQuery.student = { $in: user.children || [] };
    } else if (user.role === 'TEACHER') {
      const assigned = user.assignedClasses || [];
      const classFilters = assigned.map((a) => ({
        class: a.class,
        ...(a.section ? { section: a.section } : {}),
      }));
      baseQuery.$or = classFilters.length > 0 ? classFilters : [{ _id: null }];
    }

    // 2. Initialize QueryFeatures chain on StudentRecord.find(baseQuery)
    const mongooseQuery = StudentRecord.find(baseQuery).populate(
      'student',
      'fullName username email studentProfile'
    );

    const queryFeatures = new QueryFeatures(mongooseQuery, req.query)
      .search(['academicYear', 'term', 'teacherRemarks'])
      .filter()
      .sort('-createdAt')
      .paginate(10, 100);

    const result = await queryFeatures.execute();

    res.status(200).json(
      formatSuccess(
        {
          records: result.records,
          pagination: result.pagination,
        },
        'Student records retrieved successfully'
      )
    );
  })
);

/**
 * @route   POST /api/v1/records
 * @desc    Create student record with input validation
 * @access  Protected (Management & Teachers only)
 */
router.post(
  '/',
  authenticateUser,
  authorizeRoles('SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'TEACHER'),
  validate({
    student: { required: true, label: 'Student ID' },
    class: { required: true, minLength: 1, label: 'Class' },
    section: { required: true, minLength: 1, label: 'Section' },
    attendancePercentage: { type: 'number', min: 0, max: 100, label: 'Attendance Percentage' },
  }),
  asyncHandler(async (req, res) => {
    const record = await StudentRecord.create(req.body);
    res.status(201).json(
      formatSuccess({ record }, 'Student record created successfully')
    );
  })
);

module.exports = router;
