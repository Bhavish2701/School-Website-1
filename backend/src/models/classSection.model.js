/**
 * ClassSection Mongoose Model
 * Manages school class levels, sections, room numbers, class teacher allocations,
 * and subject teacher mappings.
 */
const mongoose = require('mongoose');

const subjectAllocationSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  weeklyPeriods: {
    type: Number,
    default: 5,
    min: 1,
  },
});

const classSectionSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: [true, 'Class name is required (e.g. 10, 9, 8)'],
      trim: true,
      index: true,
    },
    section: {
      type: String,
      required: [true, 'Section is required (e.g. A, B, C)'],
      trim: true,
      uppercase: true,
      default: 'A',
      index: true,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
      trim: true,
      index: true,
    },
    roomNumber: {
      type: String,
      trim: true,
      default: 'Room 101',
    },
    capacity: {
      type: Number,
      default: 45,
      min: 1,
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      index: true,
    },
    subjectAllocations: [subjectAllocationSchema],
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee uniqueness of a section within a class in an academic year
classSectionSchema.index(
  { className: 1, section: 1, academicYear: 1 },
  { unique: true }
);

// Virtual for formatted label (e.g. "10-A")
classSectionSchema.virtual('label').get(function () {
  return `${this.className}-${this.section}`;
});

classSectionSchema.set('toJSON', { virtuals: true });
classSectionSchema.set('toObject', { virtuals: true });

const ClassSection = mongoose.model('ClassSection', classSectionSchema);

module.exports = ClassSection;
module.exports.ClassSection = ClassSection;
