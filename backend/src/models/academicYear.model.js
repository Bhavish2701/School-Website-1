/**
 * Academic Year Mongoose Model
 * Manages school academic calendar cycles, terms, and current active year
 */
const mongoose = require('mongoose');

const termSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Term 1", "Term 2"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const academicYearSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Academic year name is required (e.g. 2025-2026)'],
      unique: true,
      trim: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isCurrent: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['UPCOMING', 'ACTIVE', 'COMPLETED'],
      default: 'ACTIVE',
    },
    terms: [termSchema],
  },
  {
    timestamps: true,
  }
);

// If an academic year is marked as isCurrent, unmark others
academicYearSchema.pre('save', async function (next) {
  if (this.isModified('isCurrent') && this.isCurrent) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isCurrent: false } }
    );
  }
  next();
});

const AcademicYear = mongoose.model('AcademicYear', academicYearSchema);

module.exports = AcademicYear;
