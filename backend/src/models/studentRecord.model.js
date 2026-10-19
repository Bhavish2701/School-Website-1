/**
 * Student Record Model (Grades, Attendance, Progress Reports)
 * Used to demonstrate and enforce object-level authorization
 */
const mongoose = require('mongoose');

const studentRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
      index: true,
    },
    class: {
      type: String,
      required: [true, 'Class is required'],
      trim: true,
      index: true,
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      trim: true,
      index: true,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
      trim: true,
    },
    term: {
      type: String,
      default: 'Term-1',
      trim: true,
    },
    attendancePercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 95,
    },
    subjects: [
      {
        subject: { type: String, required: true },
        score: { type: Number, required: true },
        maxScore: { type: Number, default: 100 },
        grade: { type: String, default: 'A' },
      },
    ],
    teacherRemarks: {
      type: String,
      default: 'Good performance and active participation in class.',
    },
  },
  {
    timestamps: true,
  }
);

const StudentRecord = mongoose.model('StudentRecord', studentRecordSchema);

module.exports = StudentRecord;
