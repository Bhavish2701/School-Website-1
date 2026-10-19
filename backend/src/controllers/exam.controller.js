/**
 * Examination Controller
 * Handles HTTP requests, ensures uniform ApiResponse envelopes, and delegates to ExamService
 */
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const examService = require('../services/exam.service');
const { Student } = require('../models/student.model');

/**
 * 1. Create Exam (Management)
 */
const createExam = asyncHandler(async (req, res) => {
  const exam = await examService.createExam(req.body, req.user);
  return sendSuccess(res, { exam }, 'Examination created successfully', 201);
});

/**
 * 2. Get Exams List
 */
const getExams = asyncHandler(async (req, res) => {
  const exams = await examService.getExams(req.query, req.user);
  return sendSuccess(res, { exams }, 'Examinations retrieved successfully', 200);
});

/**
 * 3. Get Exam Details with Schedules
 */
const getExamById = asyncHandler(async (req, res) => {
  const result = await examService.getExamById(req.params.id, req.user);
  return sendSuccess(res, result, 'Examination details retrieved successfully', 200);
});

/**
 * 4. Create / Update Exam Schedule for a Subject & Class
 */
const createSchedule = asyncHandler(async (req, res) => {
  const schedule = await examService.createSchedule(req.params.id, req.body, req.user);
  return sendSuccess(res, { schedule }, 'Exam subject scheduled successfully', 201);
});

/**
 * 5. Get Exam Schedule for a Class
 */
const getExamSchedule = asyncHandler(async (req, res) => {
  const schedules = await examService.getExamSchedule(req.params.id, req.query.class);
  return sendSuccess(res, { schedules }, 'Exam schedule retrieved successfully', 200);
});

/**
 * 6. Enter / Submit Subject Marks (With Teacher Authorization)
 */
const enterMarks = asyncHandler(async (req, res) => {
  const { class: className, section, subject, marks } = req.body;
  const result = await examService.enterSubjectMarks(
    req.params.id,
    className,
    section,
    subject,
    marks,
    req.user
  );
  return sendSuccess(res, result, result.message, 201);
});

/**
 * 7. Modify Student Mark
 */
const modifyMark = asyncHandler(async (req, res) => {
  const { markId } = req.params;
  const { subject, marksObtained, isAbsent, remarks } = req.body;

  const result = await examService.modifyStudentMark(
    markId,
    subject,
    { marksObtained, isAbsent, remarks },
    req.user
  );
  return sendSuccess(res, { mark: result }, 'Student examination mark updated successfully', 200);
});

/**
 * 8. Calculate Class Results & Rankings (Management)
 */
const calculateResults = asyncHandler(async (req, res) => {
  const { class: className, section } = req.query;
  if (!className) {
    throw ApiError.badRequest('Class parameter is required to calculate results');
  }

  const result = await examService.calculateExamResults(req.params.id, className, section);
  return sendSuccess(res, result, 'Class results and rankings calculated successfully', 200);
});

/**
 * 9. Publish Exam Results (Management)
 */
const publishResults = asyncHandler(async (req, res) => {
  const result = await examService.publishExamResults(req.params.id, req.user);
  return sendSuccess(res, result, result.message, 200);
});

/**
 * Helper to resolve logged-in student
 */
const resolveStudentForUser = async (user) => {
  const student = await Student.findOne({ user: user._id });
  if (!student) {
    throw ApiError.notFound('Student profile associated with your user account was not found');
  }
  return student;
};

/**
 * 10. STUDENT: View Own Published Report Cards
 */
const getStudentOwnResults = asyncHandler(async (req, res) => {
  const student = await resolveStudentForUser(req.user);
  const result = await examService.getStudentReportCards(student._id, req.user);
  return sendSuccess(res, result, 'Student report cards retrieved successfully', 200);
});

/**
 * 11. STUDENT: View Own Marks Memo for Specific Exam
 */
const getStudentOwnExamResult = asyncHandler(async (req, res) => {
  const student = await resolveStudentForUser(req.user);
  const result = await examService.getStudentResult(req.params.id, student._id, req.user);
  return sendSuccess(res, { result }, 'Marks memo retrieved successfully', 200);
});

/**
 * 12. PARENT: View Child's Published Report Cards
 */
const getChildResults = asyncHandler(async (req, res) => {
  // req.child is pre-authorized by verifyParentChildAccess
  const result = await examService.getStudentReportCards(req.child._id, req.user);
  return sendSuccess(res, result, `Report cards for ${req.child.fullName} retrieved successfully`, 200);
});

/**
 * 13. PARENT: View Child's Marks Memo for Specific Exam
 */
const getChildExamResult = asyncHandler(async (req, res) => {
  const result = await examService.getStudentResult(req.params.id, req.child._id, req.user);
  return sendSuccess(res, { result }, `Marks memo for ${req.child.fullName} retrieved successfully`, 200);
});

/**
 * 14. STAFF: Class Results Dossier
 */
const getClassMarksDossier = asyncHandler(async (req, res) => {
  const { class: className, section } = req.params;
  const marks = await examService.getClassMarksDossier(req.params.id, className, section);
  return sendSuccess(res, { marks }, `Results dossier for Class ${className}-${section} retrieved successfully`, 200);
});

module.exports = {
  createExam,
  getExams,
  getExamById,
  createSchedule,
  getExamSchedule,
  enterMarks,
  modifyMark,
  calculateResults,
  publishResults,
  getStudentOwnResults,
  getStudentOwnExamResult,
  getChildResults,
  getChildExamResult,
  getClassMarksDossier,
};
