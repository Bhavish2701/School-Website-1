/**
 * Student Request Validation Schemas
 */
const validate = require('../middleware/validate.middleware');
const { STATUS_VALUES, GENDER_VALUES, BLOOD_GROUPS, FEE_STATUSES } = require('../models/student.model');

const validateCreateStudent = validate({
  admissionNo: { required: true, minLength: 3, label: 'Admission Number' },
  fullName: { required: true, minLength: 2, label: 'Student Full Name' },
  gender: { required: true, enum: GENDER_VALUES, label: 'Gender' },
  class: { required: true, minLength: 1, label: 'Class' },
  section: { required: true, minLength: 1, label: 'Section' },
  status: { enum: STATUS_VALUES, label: 'Status' },
  bloodGroup: { enum: BLOOD_GROUPS, label: 'Blood Group' },
  feeStatus: { enum: FEE_STATUSES, label: 'Fee Status' },
  attendancePercentage: { type: 'number', min: 0, max: 100, label: 'Attendance Percentage' },
  gpa: { type: 'number', min: 0, max: 10, label: 'GPA' },
});

const validateUpdateStudent = validate({
  fullName: { minLength: 2, label: 'Student Full Name' },
  gender: { enum: GENDER_VALUES, label: 'Gender' },
  status: { enum: STATUS_VALUES, label: 'Status' },
  bloodGroup: { enum: BLOOD_GROUPS, label: 'Blood Group' },
  feeStatus: { enum: FEE_STATUSES, label: 'Fee Status' },
  attendancePercentage: { type: 'number', min: 0, max: 100, label: 'Attendance Percentage' },
  gpa: { type: 'number', min: 0, max: 10, label: 'GPA' },
});

module.exports = {
  validateCreateStudent,
  validateUpdateStudent,
};
