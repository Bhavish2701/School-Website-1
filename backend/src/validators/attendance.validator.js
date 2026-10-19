/**
 * Attendance Request Validators
 */
const mongoose = require('mongoose');
const validate = require('../middleware/validate.middleware');
const { ATTENDANCE_STATUS } = require('../models/attendance.model');
const ApiError = require('../utils/apiError');

/**
 * Validate Attendance Submission
 */
const validateMarkAttendance = (req, res, next) => {
  const { class: className, section, date, records } = req.body;
  const errors = {};

  if (!className || typeof className !== 'string' || !className.trim()) {
    errors.class = 'Class is required';
  }

  if (!section || typeof section !== 'string' || !section.trim()) {
    errors.section = 'Section is required';
  }

  if (!date) {
    errors.date = 'Date is required';
  } else {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      errors.date = 'Invalid date format. Expected YYYY-MM-DD or ISO date string';
    }
  }

  if (!records || !Array.isArray(records) || records.length === 0) {
    errors.records = 'Attendance records array is required and cannot be empty';
  } else {
    for (let i = 0; i < records.length; i++) {
      const item = records[i];
      if (!item.studentId || !mongoose.Types.ObjectId.isValid(item.studentId)) {
        errors[`records[${i}].studentId`] = `Item ${i}: Invalid or missing studentId`;
      }
      if (!item.status || !ATTENDANCE_STATUS.includes(item.status.toUpperCase())) {
        errors[`records[${i}].status`] = `Item ${i}: Status must be one of [${ATTENDANCE_STATUS.join(', ')}]`;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    throw ApiError.validation(errors, 'Attendance submission validation failed');
  }

  next();
};

/**
 * Validate Individual Record Correction / Permitted Update
 */
const validateUpdateRecord = validate({
  status: {
    enum: ATTENDANCE_STATUS,
    label: 'Attendance Status',
  },
  remarks: {
    label: 'Remarks',
  },
});

module.exports = {
  validateMarkAttendance,
  validateUpdateRecord,
};
