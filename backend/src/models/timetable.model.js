/**
 * Timetable Mongoose Model
 * Manages periodic academic schedules with strict teacher, room, and class conflict prevention.
 */
const mongoose = require('mongoose');

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const timetableSchema = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      default: 'SRIVIDYA-EM-01',
      index: true,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
      required: true,
      index: true,
    },
    className: {
      type: String,
      required: [true, 'Class name is required (e.g. Class X-A)'],
      trim: true,
      index: true,
    },
    section: {
      type: String,
      default: 'A',
      trim: true,
      uppercase: true,
    },
    day: {
      type: String,
      enum: DAYS_OF_WEEK,
      required: [true, 'Day of week is required'],
      index: true,
    },
    periodNumber: {
      type: Number,
      required: [true, 'Period number is required'],
    },
    periodName: {
      type: String,
      required: [true, 'Period name is required (e.g. Period 1)'],
      trim: true,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required (e.g. 08:50 AM)'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required (e.g. 09:35 AM)'],
    },
    startMinutes: {
      type: Number, // Minutes since midnight for range overlap queries
      required: true,
      index: true,
    },
    endMinutes: {
      type: Number, // Minutes since midnight
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    teacher: {
      type: String,
      required: [true, 'Assigned teacher name is required'],
      trim: true,
      index: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      index: true,
    },
    room: {
      type: String,
      default: 'Room 101',
      trim: true,
      index: true,
    },
    wing: {
      type: String,
      enum: ['High School', 'Primary Wing', 'Pre-Primary'],
      default: 'High School',
    },
    isBreak: {
      type: Boolean,
      default: false,
    },
    isCoaching: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast conflict lookup and timetable retrieval
timetableSchema.index(
  { className: 1, day: 1, periodNumber: 1, academicYear: 1 },
  { unique: true }
);

timetableSchema.index({ teacher: 1, day: 1, startMinutes: 1, endMinutes: 1, academicYear: 1 });
timetableSchema.index({ room: 1, day: 1, startMinutes: 1, endMinutes: 1, academicYear: 1 });

/**
 * Validate conflict before saving:
 * Checks if teacher or room is already booked in an overlapping time window
 * A.start < B.end && B.start < A.end
 */
timetableSchema.pre('save', async function (next) {
  if (this.isBreak || this.status === 'INACTIVE') return next();

  // 1. Teacher conflict check
  const teacherConflict = await mongoose.model('Timetable').findOne({
    _id: { $ne: this._id },
    academicYear: this.academicYear,
    day: this.day,
    teacher: this.teacher,
    status: 'ACTIVE',
    startMinutes: { $lt: this.endMinutes },
    endMinutes: { $gt: this.startMinutes },
  });

  if (teacherConflict) {
    const err = new Error(
      `Scheduling Conflict: Teacher ${this.teacher} is already assigned to ${teacherConflict.className} (${teacherConflict.periodName}: ${teacherConflict.startTime} – ${teacherConflict.endTime}) on ${this.day}`
    );
    err.statusCode = 409;
    err.conflictData = teacherConflict;
    return next(err);
  }

  // 2. Room conflict check
  const roomConflict = await mongoose.model('Timetable').findOne({
    _id: { $ne: this._id },
    academicYear: this.academicYear,
    day: this.day,
    room: this.room,
    className: { $ne: this.className },
    status: 'ACTIVE',
    startMinutes: { $lt: this.endMinutes },
    endMinutes: { $gt: this.startMinutes },
  });

  if (roomConflict) {
    const err = new Error(
      `Room Conflict: ${this.room} is already booked by ${roomConflict.className} (${roomConflict.periodName}: ${roomConflict.startTime} – ${roomConflict.endTime}) on ${this.day}`
    );
    err.statusCode = 409;
    err.conflictData = roomConflict;
    return next(err);
  }

  next();
});

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
module.exports.Timetable = Timetable;
