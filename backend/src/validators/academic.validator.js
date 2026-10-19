/**
 * Academic Module Request Validators
 */
const validate = require('../middleware/validate.middleware');
const { SUBJECT_TYPES } = require('../models/subject.model');

const validateCreateAcademicYear = validate({
  name: { required: true, minLength: 4, label: 'Academic Year Name (e.g. 2025-2026)' },
  startDate: { required: true, label: 'Start Date' },
  endDate: { required: true, label: 'End Date' },
});

const validateCreateClass = validate({
  className: { required: true, minLength: 1, label: 'Class / Grade Name' },
  section: { required: true, minLength: 1, label: 'Section' },
  roomNumber: { label: 'Room Number' },
  capacity: { type: 'number', min: 1, label: 'Capacity' },
});

const validateCreateSubject = validate({
  code: { required: true, minLength: 2, label: 'Subject Code' },
  name: { required: true, minLength: 2, label: 'Subject Name' },
  type: { enum: SUBJECT_TYPES, label: 'Subject Type' },
});

const validateAssignTeacher = validate({
  teacherId: { required: true, label: 'Teacher ID' },
  subjectId: { label: 'Subject ID' },
});

const validateCreateAssignment = validate({
  title: { required: true, minLength: 3, label: 'Assignment Title' },
  description: { required: true, minLength: 5, label: 'Description' },
  subject: { required: true, minLength: 2, label: 'Subject' },
  class: { required: true, minLength: 1, label: 'Class' },
  section: { required: true, minLength: 1, label: 'Section' },
  dueDate: { required: true, label: 'Due Date' },
});

module.exports = {
  validateCreateAcademicYear,
  validateCreateClass,
  validateCreateSubject,
  validateAssignTeacher,
  validateCreateAssignment,
};
