/**
 * Payment Mongoose Model
 * Manages server-side payment orders, transaction states, and cryptographic verification
 */
const mongoose = require('mongoose');

const PAYMENT_METHODS = ['UPI', 'CARD', 'NETBANKING', 'CASH', 'DEMAND_DRAFT'];
const PAYMENT_STATUSES = ['CREATED', 'SUCCESS', 'FAILED', 'REFUNDED'];

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, 'Payment Order ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    paymentId: {
      type: String,
      trim: true,
      index: true,
    },
    fee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fee',
      required: [true, 'Fee reference is required'],
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
      index: true,
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [1, 'Payment amount must be at least ₹1'],
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: {
        values: PAYMENT_METHODS,
        message: '{VALUE} is not a valid payment method',
      },
      default: 'UPI',
    },
    status: {
      type: String,
      enum: {
        values: PAYMENT_STATUSES,
        message: '{VALUE} is not a valid payment status',
      },
      default: 'CREATED',
      index: true,
    },
    signature: {
      type: String,
      trim: true,
    },
    receiptNumber: {
      type: String,
      trim: true,
      index: true,
    },
    verifiedAt: {
      type: Date,
    },
    failureReason: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = {
  Payment,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
};
