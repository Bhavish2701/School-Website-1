/**
 * Fee & Payment Module Request Validators
 */
const mongoose = require('mongoose');
const validate = require('../middleware/validate.middleware');
const { PAYMENT_METHODS } = require('../models/payment.model');
const ApiError = require('../utils/apiError');

/**
 * Validate Fee Structure Creation
 */
const validateCreateFeeStructure = validate({
  name: {
    required: true,
    minLength: 3,
    label: 'Fee Structure Name',
  },
  class: {
    required: true,
    label: 'Class',
  },
  totalAmount: {
    required: true,
    type: 'number',
    min: 1,
    label: 'Total Amount',
  },
  dueDate: {
    required: true,
    label: 'Due Date',
  },
});

/**
 * Validate Student Fee Allocation
 */
const validateAssignStudentFee = (req, res, next) => {
  const { studentId, feeStructureId, totalAmount, dueDate } = req.body;
  const errors = {};

  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    errors.studentId = 'Valid studentId is required';
  }

  if (!feeStructureId && (totalAmount === undefined || typeof totalAmount !== 'number' || totalAmount <= 0)) {
    errors.totalAmount = 'totalAmount must be a positive number when feeStructureId is not provided';
  }

  if (feeStructureId && !mongoose.Types.ObjectId.isValid(feeStructureId)) {
    errors.feeStructureId = 'Invalid feeStructureId format';
  }

  if (dueDate && isNaN(new Date(dueDate).getTime())) {
    errors.dueDate = 'Invalid dueDate format';
  }

  if (Object.keys(errors).length > 0) {
    throw ApiError.validation(errors, 'Student fee allocation validation failed');
  }

  next();
};

/**
 * Validate Payment Initiation Order (POST /api/v1/payments/create)
 */
const validateCreatePaymentOrder = (req, res, next) => {
  const { feeId, amount, paymentMethod } = req.body;
  const errors = {};

  if (!feeId || !mongoose.Types.ObjectId.isValid(feeId)) {
    errors.feeId = 'Valid feeId is required';
  }

  if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
    errors.amount = 'amount must be a positive number greater than 0';
  }

  if (paymentMethod && !PAYMENT_METHODS.includes(paymentMethod)) {
    errors.paymentMethod = `paymentMethod must be one of [${PAYMENT_METHODS.join(', ')}]`;
  }

  if (Object.keys(errors).length > 0) {
    throw ApiError.validation(errors, 'Payment creation validation failed');
  }

  next();
};

/**
 * Validate Payment Verification (POST /api/v1/payments/verify)
 */
const validateVerifyPayment = (req, res, next) => {
  const { orderId, paymentId } = req.body;
  const errors = {};

  if (!orderId || typeof orderId !== 'string' || !orderId.trim()) {
    errors.orderId = 'orderId is required';
  }

  if (!paymentId || typeof paymentId !== 'string' || !paymentId.trim()) {
    errors.paymentId = 'paymentId is required';
  }

  if (Object.keys(errors).length > 0) {
    throw ApiError.validation(errors, 'Payment verification validation failed');
  }

  next();
};

module.exports = {
  validateCreateFeeStructure,
  validateAssignStudentFee,
  validateCreatePaymentOrder,
  validateVerifyPayment,
};
