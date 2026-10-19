/**
 * Examination Module Request Validators
 */
const mongoose = require('mongoose');
const validate = require('../middleware/validate.middleware');
const { EXAM_TYPES } = require('../models/exam.model');
const ApiError = require('../utils/apiError');

/**
 * Validate Exam Creation
 */
const validateCreateExam = validate({
  name: {
    required: true,
    minLength: 3,
    label: 'Exam Name',
  },
  examType: {
    enum: EXAM_TYPES,
    label: 'Exam Type',
  },
  startDate: {
    required: true,
    label: 'Start Date',
  },
  endDate: {
    required: true,
    label: 'End Date',
  },
});

/**
 * Validate Exam Scheduling
 */
const validateCreateSchedule = validate({
  class: {
    required: true,
    label: 'Class',
  },
  subject: {
    required: true,
    label: 'Subject',
  },
  examDate: {
    required: true,
    label: 'Exam Date',
  },
  startTime: {
    required: true,
    label: 'Start Time',
  },
  endTime: {
    required: true,
    label: 'End Time',
  },
});

/**
 * Validate Marks Entry Payload
 */
const validateEnterMarks = (req, res, next) => {
  const { class: className, section, subject, marks } = req.body;
  const errors = {};

  if (!className || typeof className !== 'string' || !className.trim()) {
    errors.class = 'Class is required';
  }

  if (!section || typeof section !== 'string' || !section.trim()) {
    errors.section = 'Section is required';
  }

  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    errors.subject = 'Subject is required';
  }

  if (!marks || !Array.isArray(marks) || marks.length === 0) {
    errors.marks = 'Marks array is required and cannot be empty';
  } else {
    for (let i = 0; i < marks.length; i++) {
      const item = marks[i];
      if (!item.studentId || !mongoose.Types.ObjectId.isValid(item.studentId)) {
        errors[`marks[${i}].studentId`] = `Item ${i}: Invalid or missing studentId`;
      }
      if (item.marksObtained === undefined || item.marksObtained === null || typeof item.marksObtained !== 'number') {
        if (!item.isAbsent) {
          errors[`marks[${i}].marksObtained`] = `Item ${i}: marksObtained is required as a number unless student is absent`;
        }
      } else if (item.marksObtained < 0) {
        errors[`marks[${i}].marksObtained`] = `Item ${i}: marksObtained cannot be negative`;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    throw ApiError.validation(errors, 'Marks entry validation failed');
  }

  next();
};

module.exports = {
  validateCreateExam,
  validateCreateSchedule,
  validateEnterMarks,
};
