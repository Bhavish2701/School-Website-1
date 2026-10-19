/**
 * Student Mongoose Model
 * Manages detailed student profile, academic status, parent relations, and class assignments
 */
const mongoose = require('mongoose');

const STATUS_VALUES = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'ALUMNI', 'TRANSFERRED'];
const GENDER_VALUES = ['male', 'female', 'other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const FEE_STATUSES = ['Paid', 'Partial', 'Pending'];

const studentSchema = new mongoose.Schema(
  {
    admissionNo: {
      type: String,
      required: [true, 'Admission number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Student full name is required'],
      trim: true,
      index: true,
    },
    gender: {
      type: String,
      enum: {
        values: GENDER_VALUES,
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
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
      default: 'A',
      index: true,
    },
    rollNo: {
      type: String,
      trim: true,
      index: true,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: STATUS_VALUES,
        message: '{VALUE} is not a valid student status',
      },
      default: 'ACTIVE',
      index: true,
    },
    dob: {
      type: String, // String format (e.g. "15 Jun 2012") or Date
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BLOOD_GROUPS,
        message: '{VALUE} is not a valid blood group',
      },
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: 'Visakhapatnam, Andhra Pradesh',
    },
    parentName: {
      type: String,
      trim: true,
      default: '',
    },
    parentPhone: {
      type: String,
      trim: true,
      default: '',
    },
    // Reference to User account of parent for portal integration
    parentUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    // Reference to User account of student for login integration
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    attendancePercentage: {
      type: Number,
      default: 90,
      min: 0,
      max: 100,
    },
    gpa: {
      type: Number,
      default: 8.5,
      min: 0,
      max: 10,
    },
    feeStatus: {
      type: String,
      enum: {
        values: FEE_STATUSES,
        message: '{VALUE} is not a valid fee status',
      },
      default: 'Paid',
      index: true,
    },
    emergencyContact: {
      name: { type: String, trim: true, default: '' },
      relation: { type: String, trim: true, default: 'Parent' },
      phone: { type: String, trim: true, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for formatted Class-Section
studentSchema.virtual('classSection').get(function () {
  return `${this.class}-${this.section}`;
});

studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = {
  Student,
  STATUS_VALUES,
  GENDER_VALUES,
  BLOOD_GROUPS,
  FEE_STATUSES,
};
