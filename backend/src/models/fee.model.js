/**
 * Fee Mongoose Model
 * Manages student fee accounts, concessions, payments, and receipts
 */
const mongoose = require('mongoose');

const FEE_STATUSES = ['Paid', 'Partial', 'Pending', 'Overdue'];

const feeBreakdownSchema = new mongoose.Schema({
  item: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
});

const paymentRecordSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
  method: { type: String, default: 'UPI' },
  receiptNumber: { type: String, required: true, trim: true },
  verifiedBy: { type: String, default: 'Gateway Server' },
});

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
      index: true,
    },
    feeStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeeStructure',
    },
    academicYear: {
      type: String,
      default: '2025-2026',
      trim: true,
      index: true,
    },
    term: {
      type: String,
      default: 'Term 1',
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    concessionAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dueAmount: {
      type: Number,
      required: true,
      default: function () {
        return Math.max(0, this.totalAmount - (this.concessionAmount || 0) - (this.paidAmount || 0));
      },
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: FEE_STATUSES,
        message: '{VALUE} is not a valid fee status',
      },
      default: 'Pending',
      index: true,
    },
    breakdown: [feeBreakdownSchema],
    payments: [paymentRecordSchema],
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

feeSchema.index({ student: 1, academicYear: 1, term: 1 });

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;
module.exports.Fee = Fee;
module.exports.FEE_STATUSES = FEE_STATUSES;
