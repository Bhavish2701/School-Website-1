/**
 * Payment Controller
 * Handles payment order creation, cryptographic verification, payment history, and receipts
 */
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const feeService = require('../services/fee.service');

/**
 * 1. POST /api/v1/payments/create
 * Initiates server-side payment order.
 */
const createPayment = asyncHandler(async (req, res) => {
  const { feeId, amount, paymentMethod, notes } = req.body;
  const result = await feeService.createPaymentOrder(
    feeId,
    amount,
    paymentMethod,
    notes,
    req.user
  );
  return sendSuccess(res, result, result.message, 201);
});

/**
 * 2. POST /api/v1/payments/verify
 * Cryptographically verifies payment server-side and updates ledger.
 */
const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentId, signature } = req.body;
  const result = await feeService.verifyPayment(
    orderId,
    paymentId,
    signature,
    req.user
  );
  return sendSuccess(res, result, result.message, 200);
});

/**
 * 3. GET /api/v1/payments/history
 * Fetches transaction history for user/role.
 */
const getHistory = asyncHandler(async (req, res) => {
  const result = await feeService.getPaymentHistory(req.query, req.user);
  return sendSuccess(res, result, 'Payment history retrieved successfully', 200);
});

/**
 * 4. GET /api/v1/payments/receipts/:receiptNumber
 * Fetches official receipt details.
 */
const getReceipt = asyncHandler(async (req, res) => {
  const { receiptNumber } = req.params;
  const receipt = await feeService.getReceiptByNumber(receiptNumber, req.user);
  return sendSuccess(res, { receipt }, 'Receipt details retrieved successfully', 200);
});

module.exports = {
  createPayment,
  verifyPayment,
  getHistory,
  getReceipt,
};
