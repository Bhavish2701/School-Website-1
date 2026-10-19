/**
 * Academic Module HTTP Controller
 * Dispatches HTTP requests to AcademicService and returns uniform API responses.
 */
const academicService = require('../services/academic.service');
const { sendSuccess } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// 1. Academic Years
const getAcademicYears = asyncHandler(async (req, res) => {
  const years = await academicService.getAcademicYears();
  sendSuccess(res, { years }, 'Academic years retrieved successfully', 200);
});

const createAcademicYear = asyncHandler(async (req, res) => {
  const year = await academicService.createAcademicYear(req.body);
  sendSuccess(res, { year }, 'Academic year created successfully', 201);
});

const setCurrentYear = asyncHandler(async (req, res) => {
  const year = await academicService.setCurrentAcademicYear(req.params.id);
  sendSuccess(res, { year }, 'Current academic year updated successfully', 200);
});

// 2. Classes & Sections
const getClasses = asyncHandler(async (req, res) => {
  const result = await academicService.getClasses(req.query);
  sendSuccess(res, result, 'Classes retrieved successfully', 200);
});

const getClassById = asyncHandler(async (req, res) => {
  const classData = await academicService.getClassById(req.params.id);
  sendSuccess(res, { class: classData }, 'Class details retrieved successfully', 200);
});

const createClass = asyncHandler(async (req, res) => {
  const newClass = await academicService.createClass(req.body);
  sendSuccess(res, { class: newClass }, 'Class and section created successfully', 201);
});

const updateClass = asyncHandler(async (req, res) => {
  const updated = await academicService.updateClass(req.params.id, req.body);
  sendSuccess(res, { class: updated }, 'Class and section updated successfully', 200);
});

// 3. Subjects
const getSubjects = asyncHandler(async (req, res) => {
  const result = await academicService.getSubjects(req.query);
  sendSuccess(res, result, 'Subjects retrieved successfully', 200);
});

const createSubject = asyncHandler(async (req, res) => {
  const subject = await academicService.createSubject(req.body);
  sendSuccess(res, { subject }, 'Subject created successfully', 201);
});

const updateSubject = asyncHandler(async (req, res) => {
  const subject = await academicService.updateSubject(req.params.id, req.body);
  sendSuccess(res, { subject }, 'Subject updated successfully', 200);
});

const deleteSubject = asyncHandler(async (req, res) => {
  const result = await academicService.deleteSubject(req.params.id);
  sendSuccess(res, result, 'Subject deleted successfully', 200);
});

// 4. Teacher Allocations
const assignTeacher = asyncHandler(async (req, res) => {
  const classSection = await academicService.assignTeacher(req.params.id, req.body);
  sendSuccess(res, { class: classSection }, 'Teacher allocated to class successfully', 200);
});

// 5. Class Assignments (Homework / Projects)
const getAssignments = asyncHandler(async (req, res) => {
  const result = await academicService.getAssignments(req.query);
  sendSuccess(res, result, 'Assignments retrieved successfully', 200);
});

const getAssignmentById = asyncHandler(async (req, res) => {
  const assignment = await academicService.getAssignmentById(req.params.id);
  sendSuccess(res, { assignment }, 'Assignment retrieved successfully', 200);
});

const createAssignment = asyncHandler(async (req, res) => {
  const assignment = await academicService.createAssignment(req.body, req.user);
  sendSuccess(res, { assignment }, 'Assignment published successfully', 201);
});

const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await academicService.updateAssignment(req.params.id, req.body, req.user);
  sendSuccess(res, { assignment }, 'Assignment updated successfully', 200);
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const result = await academicService.deleteAssignment(req.params.id, req.user);
  sendSuccess(res, result, 'Assignment deleted successfully', 200);
});

// 6. Academic Dashboard
const getAcademicDashboard = asyncHandler(async (req, res) => {
  const dashboard = await academicService.getAcademicDashboard();
  sendSuccess(res, { dashboard }, 'Academic dashboard metrics retrieved successfully', 200);
});

module.exports = {
  getAcademicYears,
  createAcademicYear,
  setCurrentYear,
  getClasses,
  getClassById,
  createClass,
  updateClass,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  assignTeacher,
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAcademicDashboard,
};
