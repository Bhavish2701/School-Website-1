/**
 * Teacher Module Request Validators
 */
const validate = require('../middleware/validate.middleware');
const { TEACHER_STATUS } = require('../models/teacher.model');
const { LEAVE_TYPES, LEAVE_STATUS } = require('../models/leave.model');

const validateCreateTeacher = validate({
  employeeId: { required: true, minLength: 3, label: 'Employee ID' },
  fullName: { required: true, minLength: 2, label: 'Teacher Full Name' },
  gender: { required: true, enum: ['male', 'female', 'other'], label: 'Gender' },
  email: { required: true, isEmail: true, label: 'Email' },
  phone: { required: true, minLength: 10, label: 'Phone Number' },
  specialization: { label: 'Specialization' },
  qualification: { label: 'Qualification' },
  status: { enum: TEACHER_STATUS, label: 'Status' },
});

const validateUpdateTeacher = validate({
  fullName: { minLength: 2, label: 'Teacher Full Name' },
  email: { isEmail: true, label: 'Email' },
  phone: { minLength: 10, label: 'Phone Number' },
  status: { enum: TEACHER_STATUS, label: 'Status' },
});

const validateApplyLeave = validate({
  leaveType: { required: true, enum: LEAVE_TYPES, label: 'Leave Type' },
  startDate: { required: true, label: 'Start Date' },
  endDate: { required: true, label: 'End Date' },
  reason: { required: true, minLength: 5, label: 'Reason for Leave' },
});

const validateReviewLeave = validate({
  status: { required: true, enum: ['APPROVED', 'REJECTED'], label: 'Review Status' },
  reviewRemarks: { label: 'Review Remarks' },
});

const validateCreateNotification = validate({
  title: { required: true, minLength: 3, label: 'Title' },
  message: { required: true, minLength: 5, label: 'Message' },
});

module.exports = {
  validateCreateTeacher,
  validateUpdateTeacher,
  validateApplyLeave,
  validateReviewLeave,
  validateCreateNotification,
};
