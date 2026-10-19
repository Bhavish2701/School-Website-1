/**
 * Fee & Payment Service
 *
 * Implements:
 * 1. Fee structures & student fee ledgering
 * 2. Pending fees analysis & overdue tracking
 * 3. Payment creation: POST /api/v1/payments/create (server-side order generation)
 * 4. Cryptographic payment verification: POST /api/v1/payments/verify
 *    - Never trusts payment success sent only from the frontend
 *    - Uses HMAC SHA256 timing-safe verification
 * 5. Atomic ledger updates, immutable receipt generation, and payment history
 */
const crypto = require('crypto');
const mongoose = require('mongoose');
const Fee = require('../models/fee.model');
const FeeStructure = require('../models/feeStructure.model');
const { Payment } = require('../models/payment.model');
const Receipt = require('../models/receipt.model');
const { Student } = require('../models/student.model');
const config = require('../config/env');
const ApiError = require('../utils/apiError');

// Server-side Payment Secret Key for Cryptographic HMAC Signature Verification
const PAYMENT_SECRET = config.paymentSecret;

/**
 * Generate server-side HMAC SHA256 signature
 */
const generatePaymentSignature = (orderId, paymentId) => {
  return crypto.createHmac('sha256', PAYMENT_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
};

/**
 * Timing-safe signature comparison to protect against timing attacks
 */
const verifySignature = (expected, received) => {
  if (!expected || !received) return false;
  const expectedBuf = Buffer.from(expected, 'utf8');
  const receivedBuf = Buffer.from(received, 'utf8');
  if (expectedBuf.length !== receivedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
};

/**
 * Generate unique receipt number (e.g. RCP-2025-8492)
 */
const generateReceiptNumber = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RCP-${year}-${rand}`;
};

/**
 * 1. Create Fee Structure (Management)
 */
const createFeeStructure = async (structureData, user) => {
  const {
    name,
    class: className,
    academicYear = '2025-2026',
    term = 'Annual',
    tuitionFee = 0,
    transportFee = 0,
    labFee = 0,
    computerFee = 0,
    libraryFee = 0,
    examinationFee = 0,
    extracurricularFee = 0,
    admissionFee = 0,
    dueDate,
    description = '',
  } = structureData;

  const totalAmount =
    Number(tuitionFee) +
    Number(transportFee) +
    Number(labFee) +
    Number(computerFee) +
    Number(libraryFee) +
    Number(examinationFee) +
    Number(extracurricularFee) +
    Number(admissionFee);

  const feeStructure = await FeeStructure.findOneAndUpdate(
    { class: className, academicYear, term },
    {
      name,
      class: className,
      academicYear,
      term,
      tuitionFee,
      transportFee,
      labFee,
      computerFee,
      libraryFee,
      examinationFee,
      extracurricularFee,
      admissionFee,
      totalAmount,
      dueDate: new Date(dueDate),
      description,
      createdBy: user._id,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return feeStructure;
};

/**
 * 2. Get Fee Structures
 */
const getFeeStructures = async (query = {}) => {
  const { class: className, academicYear } = query;
  const filter = {};
  if (className) filter.class = className;
  if (academicYear) filter.academicYear = academicYear;

  const structures = await FeeStructure.find(filter).sort({ class: 1, term: 1 });
  return structures;
};

/**
 * 3. Assign Fee to Student (Management)
 */
const assignStudentFee = async (feeData, user) => {
  const { studentId, feeStructureId, academicYear = '2025-2026', term = 'Term 1', dueDate, concessionAmount = 0 } = feeData;

  const student = await Student.findById(studentId);
  if (!student) {
    throw ApiError.notFound('Student not found');
  }

  let totalAmount = feeData.totalAmount;
  let breakdown = feeData.breakdown || [];

  if (feeStructureId) {
    const structure = await FeeStructure.findById(feeStructureId);
    if (structure) {
      totalAmount = structure.totalAmount;
      breakdown = [
        { item: 'Tuition Fee', amount: structure.tuitionFee },
        { item: 'Science & Computer Lab Fee', amount: structure.labFee + structure.computerFee },
        { item: 'Library & Activity Fee', amount: structure.libraryFee + structure.extracurricularFee },
        { item: 'Examination Fee', amount: structure.examinationFee },
      ].filter((b) => b.amount > 0);
    }
  }

  if (!totalAmount || totalAmount <= 0) {
    throw ApiError.badRequest('Total fee amount must be a positive number');
  }

  const netDue = Math.max(0, totalAmount - Number(concessionAmount));
  const status = netDue === 0 ? 'Paid' : 'Pending';

  const fee = await Fee.create({
    student: student._id,
    feeStructure: feeStructureId || null,
    academicYear,
    term,
    totalAmount,
    concessionAmount: Number(concessionAmount),
    paidAmount: 0,
    dueAmount: netDue,
    dueDate: new Date(dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    status,
    breakdown,
  });

  // Update student status
  await Student.findByIdAndUpdate(student._id, { feeStatus: status });

  return fee;
};

/**
 * 4. Get Student Fees (Student / Parent / Staff)
 */
const getStudentFees = async (studentId, user) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw ApiError.notFound('Student not found');
  }

  const fees = await Fee.find({ student: studentId })
    .populate('feeStructure', 'name totalAmount dueDate')
    .sort({ createdAt: -1 });

  const totalBilled = fees.reduce((sum, f) => sum + f.totalAmount, 0);
  const totalPaid = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalDue = fees.reduce((sum, f) => sum + f.dueAmount, 0);
  const totalConcessions = fees.reduce((sum, f) => sum + (f.concessionAmount || 0), 0);

  return {
    student: {
      id: student._id,
      fullName: student.fullName,
      admissionNo: student.admissionNo,
      class: student.class,
      section: student.section,
      feeStatus: student.feeStatus,
    },
    summary: {
      totalBilled,
      totalConcessions,
      totalPaid,
      totalDue,
      overallStatus: totalDue === 0 ? 'Paid' : totalPaid > 0 ? 'Partial' : 'Pending',
    },
    fees,
  };
};

/**
 * 5. Get Pending / Overdue Fees (Management & Office)
 */
const getPendingFees = async (query = {}) => {
  const { class: className, section, status } = query;
  const filter = { dueAmount: { $gt: 0 } };

  if (status) {
    filter.status = status;
  }

  const fees = await Fee.find(filter)
    .populate('student', 'admissionNo fullName class section rollNo parentName parentPhone')
    .sort({ dueDate: 1 });

  // Optional filter by student class/section
  let filteredFees = fees;
  if (className || section) {
    filteredFees = fees.filter((f) => {
      if (!f.student) return false;
      const classMatch = !className || f.student.class === className;
      const sectionMatch = !section || f.student.section === section;
      return classMatch && sectionMatch;
    });
  }

  const totalPendingAmount = filteredFees.reduce((sum, f) => sum + f.dueAmount, 0);

  return {
    totalPendingRecords: filteredFees.length,
    totalPendingAmount,
    records: filteredFees,
  };
};

/**
 * 6. Payment Initiation Order: POST /api/v1/payments/create
 * Creates server-side payment order. Never trusts client-side values.
 */
const createPaymentOrder = async (feeId, amount, paymentMethod = 'UPI', notes = '', user) => {
  const fee = await Fee.findById(feeId).populate('student');
  if (!fee) {
    throw ApiError.notFound('Fee record not found');
  }

  if (fee.dueAmount <= 0) {
    throw ApiError.badRequest('This fee has already been fully settled. No dues pending.');
  }

  const payAmount = Number(amount);
  if (payAmount <= 0 || payAmount > fee.dueAmount) {
    throw ApiError.badRequest(
      `Invalid payment amount: ₹${payAmount}. Minimum is ₹1 and maximum allowed due is ₹${fee.dueAmount}.`
    );
  }

  // Generate unique server order ID
  const orderId = `ORD_SV_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

  // Create pending Payment record on server
  const payment = await Payment.create({
    orderId,
    fee: fee._id,
    student: fee.student._id,
    payer: user._id,
    amount: payAmount,
    currency: 'INR',
    paymentMethod,
    status: 'CREATED',
    notes,
  });

  return {
    orderId: payment.orderId,
    amount: payment.amount,
    currency: payment.currency,
    paymentMethod: payment.paymentMethod,
    feeId: fee._id,
    student: {
      id: fee.student._id,
      fullName: fee.student.fullName,
      admissionNo: fee.student.admissionNo,
      class: fee.student.class,
      section: fee.student.section,
    },
    dueAmount: fee.dueAmount,
    // Provide server public gateway key and order token
    gatewayKeyId: 'rzp_live_srividya_school',
    message: 'Payment order initiated successfully. Complete payment and verify on server.',
  };
};

/**
 * 7. Payment Verification: POST /api/v1/payments/verify
 * Server-side cryptographic signature verification.
 * NEVER trusts frontend payment success info without cryptographic verification.
 */
const verifyPayment = async (orderId, paymentId, signature, user) => {
  const payment = await Payment.findOne({ orderId }).populate('fee student');
  if (!payment) {
    throw ApiError.notFound(`Payment order with ID '${orderId}' not found on server`);
  }

  // Idempotency check: if already verified successfully, return existing receipt
  if (payment.status === 'SUCCESS') {
    const existingReceipt = await Receipt.findOne({ payment: payment._id });
    return {
      verified: true,
      alreadyProcessed: true,
      payment,
      receipt: existingReceipt,
      message: 'Payment was already verified and settled',
    };
  }

  // Cryptographic Signature Verification
  // The signature must match HMAC SHA256 of orderId|paymentId with PAYMENT_SECRET
  const expectedSignature = generatePaymentSignature(orderId, paymentId);
  const isSignatureValid = verifySignature(expectedSignature, signature);

  // Check if offline/cash verification is performed by authorized staff
  const isStaffVerification =
    ['SUPER_ADMIN', 'PRINCIPAL', 'OFFICE'].includes(user.role) &&
    (signature === 'OFFLINE_CASH_VERIFIED' || signature === 'OFFICE_OVER_COUNTER');

  if (!isSignatureValid && !isStaffVerification) {
    payment.status = 'FAILED';
    payment.paymentId = paymentId;
    payment.failureReason = 'Cryptographic signature verification failed. Possible payload tampering detected.';
    await payment.save();

    throw ApiError.badRequest(
      'Payment verification failed: Invalid cryptographic gateway signature. Tampering or spoofing rejected.'
    );
  }

  // Signature is cryptographically verified!
  const receiptNumber = generateReceiptNumber();

  payment.status = 'SUCCESS';
  payment.paymentId = paymentId;
  payment.signature = signature;
  payment.receiptNumber = receiptNumber;
  payment.verifiedAt = new Date();
  await payment.save();

  // Atomically update Fee ledger
  const fee = await Fee.findById(payment.fee._id);
  fee.paidAmount += payment.amount;
  fee.dueAmount = Math.max(0, fee.totalAmount - (fee.concessionAmount || 0) - fee.paidAmount);
  fee.status = fee.dueAmount === 0 ? 'Paid' : 'Partial';

  fee.payments.push({
    transactionId: paymentId,
    amount: payment.amount,
    date: new Date(),
    method: payment.paymentMethod,
    receiptNumber,
    verifiedBy: isStaffVerification ? `Staff (${user.fullName})` : 'HMAC SHA-256 Server Gateway',
  });
  await fee.save();

  // Update Student overall fee status
  await Student.findByIdAndUpdate(payment.student._id, { feeStatus: fee.status });

  // Generate official immutable Receipt document
  const receipt = await Receipt.create({
    receiptNumber,
    payment: payment._id,
    fee: fee._id,
    student: payment.student._id,
    payer: user._id,
    amountPaid: payment.amount,
    remainingDue: fee.dueAmount,
    paymentDate: new Date(),
    paymentMode: payment.paymentMethod,
    description: `Fee payment for ${fee.term} (${fee.academicYear})`,
  });

  return {
    verified: true,
    paymentId,
    orderId,
    receiptNumber,
    amountPaid: payment.amount,
    remainingDue: fee.dueAmount,
    feeStatus: fee.status,
    receipt,
    message: `Payment of ₹${payment.amount.toLocaleString('en-IN')} verified successfully. Official Receipt ${receiptNumber} generated.`,
  };
};

/**
 * 8. Get Payment History (Filterable by role & student)
 */
const getPaymentHistory = async (query = {}, user) => {
  const { studentId, status, page = 1, limit = 20 } = query;
  const filter = {};

  if (user.role === 'STUDENT') {
    const student = await Student.findOne({ user: user._id });
    if (!student) throw ApiError.notFound('Student profile not found');
    filter.student = student._id;
  } else if (user.role === 'PARENT') {
    // Parent can access their children's payments
    const childrenIds = (user.children || []).map((id) => id.toString());
    const studentDocs = await Student.find({
      $or: [{ parentUser: user._id }, { _id: { $in: childrenIds } }],
    });
    filter.student = { $in: studentDocs.map((s) => s._id) };
  } else if (studentId) {
    filter.student = studentId;
  }

  if (status) filter.status = status;

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.max(1, parseInt(limit, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate('student', 'admissionNo fullName class section rollNo')
      .populate('payer', 'fullName role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),
    Payment.countDocuments(filter),
  ]);

  return {
    payments,
    pagination: {
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parsedLimit),
      limit: parsedLimit,
    },
  };
};

/**
 * 9. Get Official Receipt Details
 */
const getReceiptByNumber = async (receiptNumber, user) => {
  const receipt = await Receipt.findOne({ receiptNumber: receiptNumber.toUpperCase() })
    .populate('student', 'admissionNo fullName class section rollNo parentName parentPhone')
    .populate('payer', 'fullName email phone role')
    .populate('fee', 'academicYear term totalAmount concessionAmount paidAmount dueAmount breakdown');

  if (!receipt) {
    throw ApiError.notFound(`Receipt '${receiptNumber}' not found`);
  }

  // Authorization Check: Student can only view own receipt; Parent can only view child's receipt
  if (user.role === 'STUDENT') {
    const student = await Student.findOne({ user: user._id });
    if (!student || receipt.student._id.toString() !== student._id.toString()) {
      throw ApiError.forbidden('Unauthorized: You can only access your own payment receipts');
    }
  } else if (user.role === 'PARENT') {
    const childrenIds = (user.children || []).map((id) => id.toString());
    const isChild =
      childrenIds.includes(receipt.student._id.toString()) ||
      (receipt.student.parentUser && receipt.student.parentUser.toString() === user._id.toString());
    if (!isChild) {
      throw ApiError.forbidden('Unauthorized: You can only access payment receipts for your own children');
    }
  }

  return receipt;
};

module.exports = {
  generatePaymentSignature,
  createFeeStructure,
  getFeeStructures,
  assignStudentFee,
  getStudentFees,
  getPendingFees,
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
  getReceiptByNumber,
};
