/**
 * Admission Mongoose Model
 * Manages prospective student applications, document attachments, and verification lifecycle
 */
const mongoose = require('mongoose');

const ADMISSION_STATUSES = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'DOCUMENT_VERIFICATION',
  'APPROVED',
  'REJECTED',
  'WAITLISTED',
];

const GENDERS = ['Male', 'Female', 'Other'];

const DOCUMENT_TYPES = [
  'BIRTH_CERTIFICATE',
  'AADHAAR_CARD',
  'TRANSFER_CERTIFICATE',
  'PREVIOUS_MARKSHEET',
  'PASSPORT_PHOTO',
  'CASTE_CERTIFICATE',
  'OTHER',
];

const documentSchema = new mongoose.Schema({
  docType: {
    type: String,
    enum: DOCUMENT_TYPES,
    default: 'OTHER',
    required: true,
  },
  docName: {
    type: String,
    required: true,
    trim: true,
  },
  docUrl: {
    type: String,
    required: true,
    trim: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const admissionSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      required: [true, 'Application number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    studentName: {
      type: String,
      required: [true, 'Student full name is required'],
      trim: true,
      index: true,
    },
    dob: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: {
        values: GENDERS,
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    applyingClass: {
      type: String,
      required: [true, 'Class applying for is required'],
      trim: true,
      index: true,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
      trim: true,
      index: true,
    },
    parentName: {
      type: String,
      required: [true, 'Parent/Guardian full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact mobile number is required'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    prevSchool: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    bloodGroup: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ADMISSION_STATUSES,
        message: '{VALUE} is not a valid admission status',
      },
      default: 'SUBMITTED',
      index: true,
    },
    documents: [documentSchema],
    requestedDocuments: [
      {
        type: String,
        trim: true,
      },
    ],
    reviewerRemarks: {
      type: String,
      trim: true,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: '',
    },
    enrolledStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
  },
  {
    timestamps: true,
  }
);

// Composite index for fast & secure public status queries
admissionSchema.index({ applicationNumber: 1, phone: 1 });

const Admission = mongoose.model('Admission', admissionSchema);

module.exports = {
  Admission,
  ADMISSION_STATUSES,
  GENDERS,
  DOCUMENT_TYPES,
};
