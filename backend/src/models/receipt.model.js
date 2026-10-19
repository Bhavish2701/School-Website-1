/**
 * Receipt Mongoose Model
 * Manages official immutable fee payment receipts
 */
const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: [true, 'Receipt number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    fee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fee',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    remainingDue: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMode: {
      type: String,
      default: 'Online Portal Payment',
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: 'Term Dues Cleared',
    },
    institutionName: {
      type: String,
      default: 'Sri Vidya E.M High School',
    },
    issuedBy: {
      type: String,
      default: 'Accounts Dept, Sri Vidya High School',
    },
  },
  {
    timestamps: true,
  }
);

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
module.exports.Receipt = Receipt;
