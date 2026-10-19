/**
 * FeeStructure Mongoose Model
 * Manages school fee heads and default fee templates per class and academic year
 */
const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Fee structure name is required'],
      trim: true,
      index: true,
    },
    class: {
      type: String,
      required: [true, 'Class is required'],
      trim: true,
      index: true,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
      trim: true,
      index: true,
    },
    term: {
      type: String,
      enum: ['Annual', 'Term 1', 'Term 2', 'Term 3'],
      default: 'Annual',
    },
    tuitionFee: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    transportFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    labFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    computerFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    libraryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    examinationFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    extracurricularFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    admissionFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint per class, academic year, and term
feeStructureSchema.index({ class: 1, academicYear: 1, term: 1 }, { unique: true });

const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);

module.exports = FeeStructure;
