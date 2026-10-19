/**
 * Examination Mongoose Models
 *
 * Implements:
 * 1. Exam - Exam profile, term/academic year, schedule bounds, and publication status
 * 2. ExamSchedule - Date, start/end time, venue, maxMarks, and passMarks per subject/class
 * 3. ExamMark - Comprehensive marks memo per student with subject scores, GPA, grades, and class rank
 */
const mongoose = require('mongoose');

const EXAM_TYPES = [
  'FORMATIVE_1',
  'FORMATIVE_2',
  'SUMMATIVE_1',
  'SUMMATIVE_2',
  'UNIT_TEST',
  'ANNUAL',
  'MID_TERM',
  'OTHER',
];

const EXAM_STATUS = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
const RESULT_STATUS = ['PASSED', 'FAILED', 'WITHHELD', 'PENDING'];

/**
 * 1. Exam Model Schema
 */
const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true,
      index: true,
    },
    examType: {
      type: String,
      enum: {
        values: EXAM_TYPES,
        message: '{VALUE} is not a valid exam type',
      },
      default: 'UNIT_TEST',
      index: true,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
      trim: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Exam start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'Exam end date is required'],
    },
    classes: [
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
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: EXAM_STATUS,
      default: 'UPCOMING',
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

/**
 * 2. Exam Schedule Schema (Subject-wise Timetable per Class)
 */
const examScheduleSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: [true, 'Exam reference is required'],
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
      default: 'ALL',
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      index: true,
    },
    examDate: {
      type: Date,
      required: [true, 'Exam date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required (e.g. 09:30 AM)'],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, 'End time is required (e.g. 12:30 PM)'],
      trim: true,
    },
    roomNumber: {
      type: String,
      trim: true,
      default: 'Exam Hall 1',
    },
    maxMarks: {
      type: Number,
      required: true,
      default: 100,
      min: 1,
    },
    passMarks: {
      type: Number,
      required: true,
      default: 35,
      min: 0,
    },
    syllabus: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate subject scheduling for the same exam and class
examScheduleSchema.index({ exam: 1, class: 1, subject: 1 }, { unique: true });

/**
 * 3. Exam Marks Schema (Student Subject Marks Memo & Dossier)
 */
const subjectMarkSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  marksObtained: {
    type: Number,
    required: true,
    min: 0,
  },
  maxMarks: {
    type: Number,
    default: 100,
    min: 1,
  },
  passMarks: {
    type: Number,
    default: 35,
    min: 0,
  },
  isAbsent: {
    type: Boolean,
    default: false,
  },
  grade: {
    type: String,
    default: 'A',
  },
  gradePoint: {
    type: Number,
    default: 10,
    min: 0,
    max: 10,
  },
  remarks: {
    type: String,
    trim: true,
    default: '',
  },
  enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  enteredAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedAt: {
    type: Date,
  },
});

const examMarkSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: [true, 'Exam reference is required'],
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
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
    subjectMarks: [subjectMarkSchema],
    totalMarksObtained: {
      type: Number,
      default: 0,
    },
    totalMaxMarks: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    gpa: {
      type: Number,
      default: 0,
    },
    overallGrade: {
      type: String,
      default: 'A',
    },
    resultStatus: {
      type: String,
      enum: RESULT_STATUS,
      default: 'PENDING',
      index: true,
    },
    rankInClass: {
      type: Number,
      default: null,
    },
    classTeacherRemarks: {
      type: String,
      trim: true,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// DUPLICATE PREVENTION: A student has exactly one marks memo per exam
examMarkSchema.index({ exam: 1, student: 1 }, { unique: true });
examMarkSchema.index({ exam: 1, class: 1, section: 1 });

/**
 * Standard Grading Helper (10-Point AP/CBSE System)
 */
const calculateSubjectGrade = (marksObtained, maxMarks = 100, isAbsent = false) => {
  if (isAbsent) {
    return { grade: 'AB', gradePoint: 0, isPass: false };
  }
  const pct = (marksObtained / maxMarks) * 100;
  if (pct >= 91) return { grade: 'A1', gradePoint: 10, isPass: true };
  if (pct >= 81) return { grade: 'A2', gradePoint: 9, isPass: true };
  if (pct >= 71) return { grade: 'B1', gradePoint: 8, isPass: true };
  if (pct >= 61) return { grade: 'B2', gradePoint: 7, isPass: true };
  if (pct >= 51) return { grade: 'C1', gradePoint: 6, isPass: true };
  if (pct >= 41) return { grade: 'C2', gradePoint: 5, isPass: true };
  if (pct >= 35) return { grade: 'D', gradePoint: 4, isPass: true };
  return { grade: 'F', gradePoint: 0, isPass: false };
};

const calculateOverallGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 35) return 'D';
  return 'F';
};

const Exam = mongoose.model('Exam', examSchema);
const ExamSchedule = mongoose.model('ExamSchedule', examScheduleSchema);
const ExamMark = mongoose.model('ExamMark', examMarkSchema);

module.exports = {
  Exam,
  ExamSchedule,
  ExamMark,
  EXAM_TYPES,
  EXAM_STATUS,
  RESULT_STATUS,
  calculateSubjectGrade,
  calculateOverallGrade,
};
