/**
 * Teacher Mongoose Model
 * Manages faculty profile, qualifications, assigned classes/subjects, timetable, and leave balances
 */
const mongoose = require('mongoose');

const TEACHER_STATUS = ['ACTIVE', 'ON_LEAVE', 'INACTIVE', 'RESIGNED'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const periodSchema = new mongoose.Schema({
  periodNumber: { type: Number, required: true },
  startTime: { type: String, required: true }, // e.g. "09:00 AM"
  endTime: { type: String, required: true },   // e.g. "09:45 AM"
  class: { type: String, required: true },
  section: { type: String, default: 'A' },
  subject: { type: String, required: true },
  room: { type: String, default: 'Room 101' },
});

const dayScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: DAYS_OF_WEEK,
    required: true,
  },
  periods: [periodSchema],
});

const assignedClassSchema = new mongoose.Schema({
  class: { type: String, required: true, trim: true },
  section: { type: String, required: true, default: 'A', trim: true },
  subject: { type: String, required: true, trim: true },
  isClassTeacher: { type: Boolean, default: false },
});

const teacherSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Teacher full name is required'],
      trim: true,
      index: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required'],
    },
    qualification: {
      type: String,
      default: 'B.Ed, M.Sc',
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 5,
      min: 0,
    },
    specialization: {
      type: String,
      default: 'Mathematics',
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      default: 'Visakhapatnam, Andhra Pradesh',
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      trim: true,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: TEACHER_STATUS,
      default: 'ACTIVE',
      index: true,
    },
    // Reference to User account for auth/portal access
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    assignedClasses: [assignedClassSchema],
    assignedSubjects: [{ type: String, trim: true }],
    timetable: [dayScheduleSchema],
    leaveBalance: {
      casual: { type: Number, default: 12 },
      sick: { type: Number, default: 10 },
      earned: { type: Number, default: 15 },
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for total assigned classes count
teacherSchema.virtual('assignedClassCount').get(function () {
  return this.assignedClasses ? this.assignedClasses.length : 0;
});

teacherSchema.set('toJSON', { virtuals: true });
teacherSchema.set('toObject', { virtuals: true });

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = {
  Teacher,
  TEACHER_STATUS,
  DAYS_OF_WEEK,
};
