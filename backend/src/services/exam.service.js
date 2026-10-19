/**
 * Examination Service
 *
 * Implements:
 * 1. Exam lifecycle: creation, scheduling, status updates, and publication
 * 2. Teacher subject authorization: teachers can only enter/modify marks for their assigned classes/subjects
 * 3. Zero-trust validation: validates student enrollment, rejects tampered payloads
 * 4. Automatic calculation: grades, GPA, percentage, pass/fail status, and class rankings
 * 5. Secure student & parent result viewing (preventing access to unpublished drafts)
 */
const mongoose = require('mongoose');
const {
  Exam,
  ExamSchedule,
  ExamMark,
  calculateSubjectGrade,
  calculateOverallGrade,
} = require('../models/exam.model');
const { Student } = require('../models/student.model');
const { Teacher } = require('../models/teacher.model');
const ApiError = require('../utils/apiError');

/**
 * 1. Create a New Exam (Management)
 */
const createExam = async (examData, user) => {
  const { name, examType, academicYear, startDate, endDate, classes, description } = examData;

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start > end) {
    throw ApiError.badRequest('Exam start date cannot be after end date');
  }

  const exam = await Exam.create({
    name,
    examType: examType || 'UNIT_TEST',
    academicYear: academicYear || '2025-2026',
    startDate: start,
    endDate: end,
    classes: classes || [],
    description: description || '',
    createdBy: user._id,
  });

  return exam;
};

/**
 * 2. Get Exams List (Filtered by role and publication status)
 */
const getExams = async (query = {}, user) => {
  const { academicYear, examType, isPublished, search } = query;
  const filter = {};

  if (academicYear) filter.academicYear = academicYear;
  if (examType) filter.examType = examType;

  // Students and parents only see published exams
  if (['STUDENT', 'PARENT'].includes(user.role)) {
    filter.isPublished = true;
  } else if (isPublished !== undefined) {
    filter.isPublished = isPublished === 'true';
  }

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const exams = await Exam.find(filter)
    .populate('createdBy', 'fullName role')
    .sort({ startDate: -1 });

  return exams;
};

/**
 * 3. Get Single Exam Details with Schedules
 */
const getExamById = async (examId, user) => {
  const exam = await Exam.findById(examId).populate('createdBy', 'fullName role');
  if (!exam) {
    throw ApiError.notFound('Examination not found');
  }

  // If student or parent, restrict unpublished exam results
  if (['STUDENT', 'PARENT'].includes(user.role) && !exam.isPublished) {
    throw ApiError.forbidden('Examination results have not been published yet');
  }

  const schedules = await ExamSchedule.find({ exam: examId }).sort({ examDate: 1, startTime: 1 });

  return {
    exam,
    schedules,
  };
};

/**
 * 4. Create / Update Exam Schedule for a Subject & Class
 */
const createSchedule = async (examId, scheduleData, user) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw ApiError.notFound('Examination not found');
  }

  const {
    class: className,
    section = 'ALL',
    subject,
    examDate,
    startTime,
    endTime,
    roomNumber,
    maxMarks = 100,
    passMarks = 35,
    syllabus = '',
  } = scheduleData;

  const schedule = await ExamSchedule.findOneAndUpdate(
    { exam: examId, class: className, subject },
    {
      exam: examId,
      class: className,
      section,
      subject,
      examDate: new Date(examDate),
      startTime,
      endTime,
      roomNumber,
      maxMarks,
      passMarks,
      syllabus,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return schedule;
};

/**
 * 5. Get Exam Schedule for a Class
 */
const getExamSchedule = async (examId, className) => {
  const filter = { exam: examId };
  if (className) filter.class = className;

  const schedules = await ExamSchedule.find(filter).sort({ examDate: 1, startTime: 1 });
  return schedules;
};

/**
 * Helper to verify Teacher subject/class authorization
 */
const verifyTeacherSubjectAccess = async (user, className, section, subjectName) => {
  // Management roles have universal authorization
  if (['SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'OFFICE'].includes(user.role)) {
    return true;
  }

  if (user.role === 'TEACHER') {
    const teacher = await Teacher.findOne({ user: user._id });
    if (!teacher) {
      throw ApiError.forbidden('Teacher profile not found');
    }

    const assigned = (teacher.assignedClasses || []).some((ac) => {
      const classMatch = ac.class === className;
      const sectionMatch = !section || ac.section === section || ac.section === 'ALL';
      const subjectMatch = ac.subject && ac.subject.toLowerCase() === subjectName.toLowerCase();
      return classMatch && sectionMatch && subjectMatch;
    });

    if (!assigned) {
      throw ApiError.forbidden(
        `Unauthorized: You are only permitted to enter or modify marks for your assigned classes and subjects. You do not teach ${subjectName} in Class ${className}-${section}.`
      );
    }

    return true;
  }

  // Students and parents must NEVER be able to modify marks
  throw ApiError.forbidden('Your user role is strictly prohibited from entering or modifying examination marks');
};

/**
 * 6. Enter / Submit Marks for a Subject in a Class (With Teacher Authorization)
 */
const enterSubjectMarks = async (examId, className, section, subjectName, marksList, user) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw ApiError.notFound('Examination not found');
  }

  // 1. Enforce strict Teacher authorization for this subject & class
  await verifyTeacherSubjectAccess(user, className, section, subjectName);

  // 2. Fetch subject schedule for maxMarks and passMarks
  const schedule = await ExamSchedule.findOne({
    exam: examId,
    class: className,
    subject: { $regex: new RegExp(`^${subjectName}$`, 'i') },
  });

  const maxMarks = schedule ? schedule.maxMarks : 100;
  const passMarks = schedule ? schedule.passMarks : 35;

  // 3. Validate student IDs belong to this class and section
  const studentIds = marksList.map((m) => m.studentId);
  const matchedStudents = await Student.find({
    _id: { $in: studentIds },
    class: className,
    section,
    status: 'ACTIVE',
  });

  if (matchedStudents.length !== marksList.length) {
    throw ApiError.badRequest(
      `Payload validation failed: Expected ${marksList.length} active students in Class ${className}-${section}, found ${matchedStudents.length}. Unauthorized student IDs detected.`
    );
  }

  const results = [];

  // 4. Record/Upsert subject marks for each student
  for (const item of marksList) {
    const isAbsent = Boolean(item.isAbsent);
    const marksObtained = isAbsent ? 0 : Number(item.marksObtained);

    const { grade, gradePoint, isPass } = calculateSubjectGrade(marksObtained, maxMarks, isAbsent);

    let examMark = await ExamMark.findOne({ exam: examId, student: item.studentId });

    if (!examMark) {
      examMark = new ExamMark({
        exam: examId,
        student: item.studentId,
        class: className,
        section,
        academicYear: exam.academicYear,
        subjectMarks: [],
      });
    }

    // Check if this subject already exists in student's marks memo
    const existingIndex = examMark.subjectMarks.findIndex(
      (sm) => sm.subject.toLowerCase() === subjectName.toLowerCase()
    );

    const newSubjectEntry = {
      subject: subjectName,
      marksObtained,
      maxMarks,
      passMarks,
      isAbsent,
      grade,
      gradePoint,
      remarks: item.remarks || '',
      enteredBy: user._id,
      enteredAt: new Date(),
      updatedBy: user._id,
      updatedAt: new Date(),
    };

    if (existingIndex >= 0) {
      examMark.subjectMarks[existingIndex] = newSubjectEntry;
    } else {
      examMark.subjectMarks.push(newSubjectEntry);
    }

    // 5. Recalculate Student Overall Results
    let totalObtained = 0;
    let totalMax = 0;
    let totalGradePoints = 0;
    let hasFailedSubject = false;

    for (const sm of examMark.subjectMarks) {
      if (!sm.isAbsent) totalObtained += sm.marksObtained;
      totalMax += sm.maxMarks;
      totalGradePoints += sm.gradePoint;
      if (sm.marksObtained < sm.passMarks || sm.isAbsent) {
        hasFailedSubject = true;
      }
    }

    const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 1000) / 10 : 0;
    const gpa = examMark.subjectMarks.length > 0 ? Math.round((totalGradePoints / examMark.subjectMarks.length) * 10) / 10 : 0;
    const overallGrade = calculateOverallGrade(percentage);
    const resultStatus = hasFailedSubject ? 'FAILED' : 'PASSED';

    examMark.totalMarksObtained = totalObtained;
    examMark.totalMaxMarks = totalMax;
    examMark.percentage = percentage;
    examMark.gpa = gpa;
    examMark.overallGrade = overallGrade;
    examMark.resultStatus = resultStatus;
    examMark.isPublished = exam.isPublished;

    await examMark.save();
    results.push(examMark);
  }

  return {
    examId,
    class: className,
    section,
    subject: subjectName,
    studentsGraded: results.length,
    message: `Marks for ${subjectName} (Class ${className}-${section}) recorded and calculated successfully`,
  };
};

/**
 * 7. Modify Individual Student Mark (With Authorization Check)
 */
const modifyStudentMark = async (markId, subjectName, updateData, user) => {
  const examMark = await ExamMark.findById(markId);
  if (!examMark) {
    throw ApiError.notFound('Exam mark record not found');
  }

  // Enforce Teacher Authorization
  await verifyTeacherSubjectAccess(user, examMark.class, examMark.section, subjectName);

  const subjectEntry = examMark.subjectMarks.find(
    (sm) => sm.subject.toLowerCase() === subjectName.toLowerCase()
  );

  if (!subjectEntry) {
    throw ApiError.notFound(`Subject '${subjectName}' not found in student's marks memo`);
  }

  if (updateData.marksObtained !== undefined) {
    subjectEntry.marksObtained = Number(updateData.marksObtained);
    subjectEntry.isAbsent = false;
  }
  if (updateData.isAbsent !== undefined) {
    subjectEntry.isAbsent = Boolean(updateData.isAbsent);
    if (subjectEntry.isAbsent) subjectEntry.marksObtained = 0;
  }
  if (updateData.remarks !== undefined) {
    subjectEntry.remarks = updateData.remarks;
  }

  // Recalculate subject grade
  const { grade, gradePoint } = calculateSubjectGrade(
    subjectEntry.marksObtained,
    subjectEntry.maxMarks,
    subjectEntry.isAbsent
  );
  subjectEntry.grade = grade;
  subjectEntry.gradePoint = gradePoint;
  subjectEntry.updatedBy = user._id;
  subjectEntry.updatedAt = new Date();

  // Recalculate student totals
  let totalObtained = 0;
  let totalMax = 0;
  let totalGradePoints = 0;
  let hasFailedSubject = false;

  for (const sm of examMark.subjectMarks) {
    if (!sm.isAbsent) totalObtained += sm.marksObtained;
    totalMax += sm.maxMarks;
    totalGradePoints += sm.gradePoint;
    if (sm.marksObtained < sm.passMarks || sm.isAbsent) {
      hasFailedSubject = true;
    }
  }

  examMark.totalMarksObtained = totalObtained;
  examMark.totalMaxMarks = totalMax;
  examMark.percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 1000) / 10 : 0;
  examMark.gpa = examMark.subjectMarks.length > 0 ? Math.round((totalGradePoints / examMark.subjectMarks.length) * 10) / 10 : 0;
  examMark.overallGrade = calculateOverallGrade(examMark.percentage);
  examMark.resultStatus = hasFailedSubject ? 'FAILED' : 'PASSED';

  await examMark.save();
  return examMark;
};

/**
 * 8. Calculate Class Results & Rankings
 */
const calculateExamResults = async (examId, className, section) => {
  const filter = { exam: examId, class: className };
  if (section && section !== 'ALL') filter.section = section;

  const marksList = await ExamMark.find(filter).sort({ totalMarksObtained: -1, percentage: -1 });

  if (marksList.length === 0) {
    throw ApiError.notFound(`No marks records found for Class ${className}-${section || 'ALL'}`);
  }

  // Assign class rank
  let currentRank = 1;
  for (let i = 0; i < marksList.length; i++) {
    if (i > 0 && marksList[i].totalMarksObtained < marksList[i - 1].totalMarksObtained) {
      currentRank = i + 1;
    }
    marksList[i].rankInClass = currentRank;
    await marksList[i].save();
  }

  const totalStudents = marksList.length;
  const passedStudents = marksList.filter((m) => m.resultStatus === 'PASSED').length;
  const passPercentage = Math.round((passedStudents / totalStudents) * 1000) / 10;

  return {
    examId,
    class: className,
    section: section || 'ALL',
    totalStudents,
    passedStudents,
    failedStudents: totalStudents - passedStudents,
    passPercentage,
    ranks: marksList.map((m) => ({
      studentId: m.student,
      rank: m.rankInClass,
      totalMarks: m.totalMarksObtained,
      percentage: m.percentage,
      gpa: m.gpa,
      grade: m.overallGrade,
      status: m.resultStatus,
    })),
  };
};

/**
 * 9. Publish Exam Results (Management Only)
 */
const publishExamResults = async (examId, user) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw ApiError.notFound('Examination not found');
  }

  exam.isPublished = true;
  exam.publishedAt = new Date();
  exam.publishedBy = user._id;
  exam.status = 'COMPLETED';
  await exam.save();

  // Set isPublished to true on all associated ExamMark records
  await ExamMark.updateMany({ exam: examId }, { isPublished: true });

  return {
    examId: exam._id,
    name: exam.name,
    isPublished: true,
    publishedAt: exam.publishedAt,
    message: `Results for ${exam.name} have been officially published to Students and Parents`,
  };
};

/**
 * 10. Get Student Specific Exam Result / Marks Memo
 */
const getStudentResult = async (examId, studentId, user) => {
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw ApiError.notFound('Examination not found');
  }

  // If student or parent, enforce result publication check
  if (['STUDENT', 'PARENT'].includes(user.role) && !exam.isPublished) {
    throw ApiError.forbidden('Results for this examination have not been published yet');
  }

  const mark = await ExamMark.findOne({ exam: examId, student: studentId })
    .populate('student', 'admissionNo fullName class section rollNo parentName')
    .populate('exam', 'name examType academicYear startDate endDate');

  if (!mark) {
    throw ApiError.notFound('Result record not found for this examination and student');
  }

  return mark;
};

/**
 * 11. Get All Published Report Cards for a Student
 */
const getStudentReportCards = async (studentId, user) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw ApiError.notFound('Student not found');
  }

  const marks = await ExamMark.find({
    student: studentId,
    isPublished: true,
  })
    .populate('exam', 'name examType academicYear startDate endDate')
    .sort({ createdAt: -1 });

  return {
    student: {
      id: student._id,
      fullName: student.fullName,
      admissionNo: student.admissionNo,
      class: student.class,
      section: student.section,
      rollNo: student.rollNo,
    },
    totalExams: marks.length,
    reportCards: marks,
  };
};

/**
 * 12. Class Results Dossier (Staff View)
 */
const getClassMarksDossier = async (examId, className, section) => {
  const marks = await ExamMark.find({
    exam: examId,
    class: className,
    section,
  })
    .populate('student', 'admissionNo fullName rollNo')
    .sort({ rankInClass: 1, totalMarksObtained: -1 });

  return marks;
};

module.exports = {
  createExam,
  getExams,
  getExamById,
  createSchedule,
  getExamSchedule,
  enterSubjectMarks,
  modifyStudentMark,
  calculateExamResults,
  publishExamResults,
  getStudentResult,
  getStudentReportCards,
  getClassMarksDossier,
};
