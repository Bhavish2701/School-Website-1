/**
 * Student HTTP Controller
 * Handles HTTP requests, delegates business operations to StudentService,
 * and formats standardized API responses.
 */
const studentService = require('../services/student.service');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/v1/students
 * @desc    Get paginated, searchable, and filtered list of students
 * @access  Protected
 */
const getStudents = asyncHandler(async (req, res) => {
  const result = await studentService.getStudents(req.query, req.user);
  sendSuccess(
    res,
    {
      students: result.records,
      pagination: result.pagination,
    },
    'Students retrieved successfully',
    200
  );
});

/**
 * @route   GET /api/v1/students/:id
 * @desc    Get student profile details by ID
 * @access  Protected (Object-Level Authorization enforced in Service)
 */
const getStudentById = asyncHandler(async (req, res) => {
  const student = await studentService.getStudentById(req.params.id, req.user);
  sendSuccess(res, { student }, 'Student details retrieved successfully', 200);
});

/**
 * @route   POST /api/v1/students
 * @desc    Create / register a new student
 * @access  Protected (SUPER_ADMIN, PRINCIPAL, VICE_PRINCIPAL, OFFICE)
 */
const createStudent = asyncHandler(async (req, res) => {
  const student = await studentService.createStudent(req.body, req.user);
  sendSuccess(res, { student }, 'Student registered successfully', 201);
});

/**
 * @route   PATCH /api/v1/students/:id
 * @desc    Update student profile, academic info, or status
 * @access  Protected (SUPER_ADMIN, PRINCIPAL, VICE_PRINCIPAL, OFFICE, TEACHER)
 */
const updateStudent = asyncHandler(async (req, res) => {
  const student = await studentService.updateStudent(req.params.id, req.body, req.user);
  sendSuccess(res, { student }, 'Student updated successfully', 200);
});

/**
 * @route   DELETE /api/v1/students/:id
 * @desc    Delete student record
 * @access  Protected (SUPER_ADMIN, PRINCIPAL)
 */
const deleteStudent = asyncHandler(async (req, res) => {
  const result = await studentService.deleteStudent(req.params.id, req.user);
  sendSuccess(res, result, 'Student deleted successfully', 200);
});

/**
 * @route   GET /api/v1/students/dashboard/stats
 * @desc    Get aggregate statistics for student dashboard
 * @access  Protected (Staff roles)
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await studentService.getStudentDashboardStats(req.user);
  sendSuccess(res, { stats }, 'Student dashboard statistics retrieved successfully', 200);
});

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getDashboardStats,
};
