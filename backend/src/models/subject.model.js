/**
 * Subject Mongoose Model
 * Manages school curriculum subjects, codes, types, and applicable grade levels
 */
const mongoose = require('mongoose');

const SUBJECT_TYPES = ['CORE', 'ELECTIVE', 'LANGUAGE', 'LAB', 'ACTIVITY'];

const subjectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: SUBJECT_TYPES,
      default: 'CORE',
      index: true,
    },
    applicableClasses: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      trim: true,
      default: '',
    },
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

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = {
  Subject,
  SUBJECT_TYPES,
};
