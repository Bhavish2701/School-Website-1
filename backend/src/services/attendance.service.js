/**
 * Attendance Service
 *
 * Implements business logic for:
 * - Teacher: class assignment verification, class rosters, attendance submission, duplicate-proof bulk upserts
 * - Student: self attendance summary, daily log, monthly calendar view
 * - Parent: child attendance tracking (with parent-child authorization)
 * - Management: school-wide daily overview, class breakdown, low-attendance reports
 */
const mongoose = require('mongoose');
const { AttendanceRecord, AttendanceRegister } = require('../models/attendance.model');
const { Student } = require('../models/student.model');
const { Teacher } = require('../models/teacher.model');
const { ClassSection } = require('../models/classSection.model');
const ApiError = require('../utils/apiError');

/**
 * Normalize Date to UTC midnight (00:00:00.000Z)
 * Crucial for duplicate prevention across different timezones
 */
const normalizeDate = (dateInput) => {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(d.getTime())) {
    throw ApiError.badRequest('Invalid date string provided');
  }
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
};

/**
 * Helper to recalculate a student's cumulative attendance percentage
 */
const recalculateStudentAttendance = async (studentId) => {
  const totalDays = await AttendanceRecord.countDocuments({ student: studentId });
  if (totalDays === 0) return 100;

  const presentDays = await AttendanceRecord.countDocuments({
    student: studentId,
    status: { $in: ['PRESENT', 'LATE', 'EXCUSED'] },
  });
  const halfDays = await AttendanceRecord.countDocuments({
    student: studentId,
    status: 'HALF_DAY',
  });

  const weightedPresent = presentDays + halfDays * 0.5;
  const percentage = Math.round((weightedPresent / totalDays) * 100);

  await Student.findByIdAndUpdate(studentId, { attendancePercentage: percentage });
  return percentage;
};

/**
 * 1. Get teacher's assigned classes with live student counts and today's attendance status
 */
const getTeacherAssignedClasses = async (user) => {
  const teacher = await Teacher.findOne({ user: user._id });
  if (!teacher) {
    throw ApiError.notFound('Teacher profile associated with your account was not found');
  }

  const today = normalizeDate(new Date());
  const classesSummary = [];

  // Deduplicate classes if teacher teaches multiple subjects in same class/section
  const seenMap = new Map();
  for (const ac of teacher.assignedClasses || []) {
    const key = `${ac.class}-${ac.section}`;
    if (!seenMap.has(key)) {
      seenMap.set(key, ac);
    }
  }

  for (const ac of seenMap.values()) {
    const totalStudents = await Student.countDocuments({
      class: ac.class,
      section: ac.section,
      status: 'ACTIVE',
    });

    const register = await AttendanceRegister.findOne({
      class: ac.class,
      section: ac.section,
      date: today,
    });

    classesSummary.push({
      class: ac.class,
      section: ac.section,
      subject: ac.subject,
      isClassTeacher: Boolean(ac.isClassTeacher),
      totalStudents,
      isMarkedToday: Boolean(register),
      todayRegister: register
        ? {
            presentCount: register.presentCount,
            absentCount: register.absentCount,
            attendanceRate: register.attendanceRate,
            submittedAt: register.updatedAt,
          }
        : null,
    });
  }

  return {
    teacherId: teacher._id,
    teacherName: teacher.fullName,
    employeeId: teacher.employeeId,
    assignedCount: classesSummary.length,
    classes: classesSummary,
  };
};

/**
 * 2. Get students of a class-section for attendance marking
 */
const getClassStudentsForAttendance = async (className, section, dateInput, user) => {
  const targetDate = normalizeDate(dateInput);

  // If role is TEACHER, verify authorization
  if (user.role === 'TEACHER') {
    const teacher = await Teacher.findOne({ user: user._id });
    if (!teacher) {
      throw ApiError.forbidden('Teacher profile not found');
    }
    const hasAccess = (teacher.assignedClasses || []).some(
      (ac) => ac.class === className && ac.section === section
    );
    if (!hasAccess) {
      throw ApiError.forbidden(`You are not assigned to Class ${className}-${section}`);
    }
  }

  // Fetch active students in class
  const students = await Student.find({
    class: className,
    section: section,
    status: 'ACTIVE',
  }).sort({ rollNo: 1, fullName: 1 });

  // Fetch existing attendance records for these students on targetDate
  const studentIds = students.map((s) => s._id);
  const existingRecords = await AttendanceRecord.find({
    student: { $in: studentIds },
    date: targetDate,
  });

  const recordMap = new Map();
  existingRecords.forEach((rec) => {
    recordMap.set(rec.student.toString(), rec);
  });

  const studentRoster = students.map((s) => {
    const record = recordMap.get(s._id.toString());
    return {
      studentId: s._id,
      admissionNo: s.admissionNo,
      rollNo: s.rollNo || '-',
      fullName: s.fullName,
      gender: s.gender,
      currentStatus: record ? record.status : 'PRESENT',
      remarks: record ? record.remarks : '',
      isPermitted: record ? record.isPermitted : false,
      recordId: record ? record._id : null,
      alreadyMarked: Boolean(record),
    };
  });

  const register = await AttendanceRegister.findOne({
    class: className,
    section: section,
    date: targetDate,
  });

  return {
    class: className,
    section: section,
    date: targetDate,
    totalStudents: students.length,
    isMarked: Boolean(register),
    summary: register
      ? {
          presentCount: register.presentCount,
          absentCount: register.absentCount,
          lateCount: register.lateCount,
          halfDayCount: register.halfDayCount,
          excusedCount: register.excusedCount,
          attendanceRate: register.attendanceRate,
        }
      : null,
    students: studentRoster,
  };
};

/**
 * 3. Mark & Submit Class Attendance (With backend validation & duplicate prevention)
 */
const markClassAttendance = async (className, section, dateInput, records, remarks, user) => {
  const normalizedDate = normalizeDate(dateInput);

  // 1. Authorization: If TEACHER, verify assignment
  if (user.role === 'TEACHER') {
    const teacher = await Teacher.findOne({ user: user._id });
    if (!teacher) {
      throw ApiError.forbidden('Teacher profile not found');
    }
    const isAssigned = (teacher.assignedClasses || []).some(
      (ac) => ac.class === className && ac.section === section
    );
    if (!isAssigned) {
      throw ApiError.forbidden(`Unauthorized: You are not assigned to Class ${className}-${section}`);
    }
  }

  // 2. Validate that every student in the records actually exists and belongs to this class/section
  const studentIds = records.map((r) => r.studentId);
  const matchedStudents = await Student.find({
    _id: { $in: studentIds },
    class: className,
    section: section,
    status: 'ACTIVE',
  });

  if (matchedStudents.length !== records.length) {
    throw ApiError.badRequest(
      `Frontend payload validation failed: Expected ${records.length} active students in Class ${className}-${section}, but found ${matchedStudents.length}. Unauthorized or tampered student IDs detected.`
    );
  }

  // 3. Compute Register Metrics
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let halfDayCount = 0;
  let excusedCount = 0;

  const bulkOps = records.map((rec) => {
    const status = rec.status.toUpperCase();
    if (status === 'PRESENT') presentCount++;
    else if (status === 'ABSENT') absentCount++;
    else if (status === 'LATE') lateCount++;
    else if (status === 'HALF_DAY') halfDayCount++;
    else if (status === 'EXCUSED') excusedCount++;

    return {
      updateOne: {
        filter: { student: rec.studentId, date: normalizedDate },
        update: {
          $set: {
            student: rec.studentId,
            class: className,
            section: section,
            date: normalizedDate,
            status,
            remarks: rec.remarks || '',
            isPermitted: Boolean(rec.isPermitted),
            markedBy: user._id,
            updatedBy: user._id,
          },
        },
        upsert: true,
      },
    };
  });

  // 4. Duplicate-Proof Bulk Upsert for Student Attendance Records
  await AttendanceRecord.bulkWrite(bulkOps);

  const totalStudents = records.length;
  const weightedPresent = presentCount + lateCount + excusedCount + halfDayCount * 0.5;
  const attendanceRate = totalStudents > 0 ? Math.round((weightedPresent / totalStudents) * 1000) / 10 : 100;

  // 5. Upsert Classroom Session Register Header
  const register = await AttendanceRegister.findOneAndUpdate(
    { class: className, section, date: normalizedDate },
    {
      class: className,
      section,
      date: normalizedDate,
      takenBy: user._id,
      totalStudents,
      presentCount,
      absentCount,
      lateCount,
      halfDayCount,
      excusedCount,
      attendanceRate,
      status: 'SUBMITTED',
      remarks: remarks || '',
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // 6. Recalculate Student Cumulative Attendance in Background/Sequential Loop
  for (const studentId of studentIds) {
    await recalculateStudentAttendance(studentId);
  }

  return {
    registerId: register._id,
    class: className,
    section,
    date: normalizedDate,
    totalStudents,
    presentCount,
    absentCount,
    lateCount,
    halfDayCount,
    excusedCount,
    attendanceRate,
    message: `Attendance for Class ${className}-${section} recorded successfully (${presentCount}/${totalStudents} present)`,
  };
};

/**
 * 4. Update Permitted Attendance Record
 * Allows teachers / admin to update a record (e.g. absent -> excused, late -> present)
 */
const updatePermittedAttendance = async (recordId, updateData, user) => {
  const record = await AttendanceRecord.findById(recordId);
  if (!record) {
    throw ApiError.notFound('Attendance record not found');
  }

  // Teacher authorization check
  if (user.role === 'TEACHER') {
    const teacher = await Teacher.findOne({ user: user._id });
    if (!teacher) {
      throw ApiError.forbidden('Teacher profile not found');
    }
    const isAssigned = (teacher.assignedClasses || []).some(
      (ac) => ac.class === record.class && ac.section === record.section
    );
    if (!isAssigned) {
      throw ApiError.forbidden(`Unauthorized to modify records for Class ${record.class}-${record.section}`);
    }
  }

  if (updateData.status) {
    record.status = updateData.status.toUpperCase();
  }
  if (updateData.remarks !== undefined) {
    record.remarks = updateData.remarks;
  }
  if (updateData.isPermitted !== undefined) {
    record.isPermitted = Boolean(updateData.isPermitted);
  }
  record.updatedBy = user._id;

  await record.save();

  // Recalculate student cumulative percentage
  const updatedStudentPercentage = await recalculateStudentAttendance(record.student);

  // Recalculate the day's class register counts
  const allRecords = await AttendanceRecord.find({
    class: record.class,
    section: record.section,
    date: record.date,
  });

  const total = allRecords.length;
  const present = allRecords.filter((r) => r.status === 'PRESENT').length;
  const absent = allRecords.filter((r) => r.status === 'ABSENT').length;
  const late = allRecords.filter((r) => r.status === 'LATE').length;
  const halfDay = allRecords.filter((r) => r.status === 'HALF_DAY').length;
  const excused = allRecords.filter((r) => r.status === 'EXCUSED').length;
  const rate = total > 0 ? Math.round(((present + late + excused + halfDay * 0.5) / total) * 1000) / 10 : 100;

  await AttendanceRegister.findOneAndUpdate(
    { class: record.class, section: record.section, date: record.date },
    {
      presentCount: present,
      absentCount: absent,
      lateCount: late,
      halfDayCount: halfDay,
      excusedCount: excused,
      attendanceRate: rate,
    }
  );

  return {
    record,
    studentCumulativePercentage: updatedStudentPercentage,
  };
};

/**
 * 5. Get Attendance History for a Class/Section
 */
const getAttendanceHistory = async (query) => {
  const { class: className, section, startDate, endDate, page = 1, limit = 20 } = query;
  const filter = {};

  if (className) filter.class = className;
  if (section) filter.section = section;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = normalizeDate(startDate);
    if (endDate) filter.date.$lte = normalizeDate(endDate);
  }

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.max(1, parseInt(limit, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));

  const [registers, total] = await Promise.all([
    AttendanceRegister.find(filter)
      .populate('takenBy', 'fullName employeeId')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit),
    AttendanceRegister.countDocuments(filter),
  ]);

  return {
    registers,
    pagination: {
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parsedLimit),
      limit: parsedLimit,
    },
  };
};

/**
 * 6. Get Student Own Attendance Summary
 */
const getStudentAttendanceSummary = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw ApiError.notFound('Student not found');
  }

  const [totalDays, presentDays, absentDays, lateDays, halfDays, excusedDays] = await Promise.all([
    AttendanceRecord.countDocuments({ student: studentId }),
    AttendanceRecord.countDocuments({ student: studentId, status: 'PRESENT' }),
    AttendanceRecord.countDocuments({ student: studentId, status: 'ABSENT' }),
    AttendanceRecord.countDocuments({ student: studentId, status: 'LATE' }),
    AttendanceRecord.countDocuments({ student: studentId, status: 'HALF_DAY' }),
    AttendanceRecord.countDocuments({ student: studentId, status: 'EXCUSED' }),
  ]);

  const weightedPresent = presentDays + lateDays + excusedDays + halfDays * 0.5;
  const rate = totalDays > 0 ? Math.round((weightedPresent / totalDays) * 1000) / 10 : 100;

  return {
    studentId: student._id,
    fullName: student.fullName,
    admissionNo: student.admissionNo,
    class: student.class,
    section: student.section,
    rollNo: student.rollNo,
    totalWorkingDays: totalDays,
    attendedDays: presentDays + lateDays + excusedDays,
    presentDays,
    absentDays,
    lateDays,
    halfDays,
    excusedDays,
    attendanceRate: rate,
    isLowAttendance: rate < 75,
  };
};

/**
 * 7. Get Student Daily Attendance Log
 */
const getStudentDailyAttendance = async (studentId, query = {}) => {
  const { startDate, endDate, page = 1, limit = 30 } = query;
  const filter = { student: studentId };

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = normalizeDate(startDate);
    if (endDate) filter.date.$lte = normalizeDate(endDate);
  }

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.max(1, parseInt(limit, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));

  const [records, total] = await Promise.all([
    AttendanceRecord.find(filter).sort({ date: -1 }).skip(skip).limit(parsedLimit),
    AttendanceRecord.countDocuments(filter),
  ]);

  return {
    records,
    pagination: {
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parsedLimit),
      limit: parsedLimit,
    },
  };
};

/**
 * 8. Get Student Monthly Attendance Register
 */
const getStudentMonthlyAttendance = async (studentId, month, year) => {
  const currentYear = year ? parseInt(year, 10) : new Date().getUTCFullYear();
  const currentMonth = month ? parseInt(month, 10) - 1 : new Date().getUTCMonth(); // 0-indexed

  const startOfMonth = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0, 0));
  const endOfMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59, 999));

  const records = await AttendanceRecord.find({
    student: studentId,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  }).sort({ date: 1 });

  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let halfDayCount = 0;
  let excusedCount = 0;

  const calendarDays = records.map((r) => {
    if (r.status === 'PRESENT') presentCount++;
    else if (r.status === 'ABSENT') absentCount++;
    else if (r.status === 'LATE') lateCount++;
    else if (r.status === 'HALF_DAY') halfDayCount++;
    else if (r.status === 'EXCUSED') excusedCount++;

    return {
      date: r.date.toISOString().split('T')[0],
      day: r.date.getUTCDate(),
      status: r.status,
      remarks: r.remarks,
      isPermitted: r.isPermitted,
    };
  });

  const totalDays = records.length;
  const weighted = presentCount + lateCount + excusedCount + halfDayCount * 0.5;
  const monthlyRate = totalDays > 0 ? Math.round((weighted / totalDays) * 1000) / 10 : 100;

  return {
    month: currentMonth + 1,
    year: currentYear,
    totalWorkingDays: totalDays,
    presentCount,
    absentCount,
    lateCount,
    halfDayCount,
    excusedCount,
    monthlyRate,
    days: calendarDays,
  };
};

/**
 * 9. Management: School-Wide Attendance Overview
 */
const getManagementSchoolOverview = async (dateInput) => {
  const targetDate = normalizeDate(dateInput);

  // Fetch all class-sections
  const classSections = await ClassSection.find({}).sort({ className: 1, section: 1 });
  const registers = await AttendanceRegister.find({ date: targetDate }).populate('takenBy', 'fullName employeeId');

  const registerMap = new Map();
  registers.forEach((reg) => {
    registerMap.set(`${reg.class}-${reg.section}`, reg);
  });

  let totalSchoolStudents = 0;
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLate = 0;
  let totalHalfDay = 0;
  let totalExcused = 0;

  const classBreakdown = [];

  for (const cs of classSections) {
    const key = `${cs.className}-${cs.section}`;
    const reg = registerMap.get(key);

    const studentCount = await Student.countDocuments({
      class: cs.className,
      section: cs.section,
      status: 'ACTIVE',
    });

    totalSchoolStudents += studentCount;

    if (reg) {
      totalPresent += reg.presentCount;
      totalAbsent += reg.absentCount;
      totalLate += reg.lateCount;
      totalHalfDay += reg.halfDayCount;
      totalExcused += reg.excusedCount;

      classBreakdown.push({
        class: cs.className,
        section: cs.section,
        roomNumber: cs.roomNumber,
        isMarked: true,
        totalStudents: reg.totalStudents,
        presentCount: reg.presentCount,
        absentCount: reg.absentCount,
        attendanceRate: reg.attendanceRate,
        takenBy: reg.takenBy ? reg.takenBy.fullName : 'Admin',
      });
    } else {
      classBreakdown.push({
        class: cs.className,
        section: cs.section,
        roomNumber: cs.roomNumber,
        isMarked: false,
        totalStudents: studentCount,
        presentCount: 0,
        absentCount: 0,
        attendanceRate: 0,
        takenBy: null,
      });
    }
  }

  const markedRegisters = registers.length;
  const totalClasses = classSections.length;
  const overallRate =
    totalPresent + totalAbsent > 0
      ? Math.round(((totalPresent + totalLate + totalExcused + totalHalfDay * 0.5) / (totalPresent + totalAbsent + totalLate + totalHalfDay + totalExcused)) * 1000) / 10
      : 0;

  return {
    date: targetDate,
    totalClasses,
    markedClasses: markedRegisters,
    submissionRate: totalClasses > 0 ? Math.round((markedRegisters / totalClasses) * 100) : 0,
    totalSchoolStudents,
    totalPresent,
    totalAbsent,
    totalLate,
    totalHalfDay,
    totalExcused,
    overallAttendanceRate: overallRate,
    classes: classBreakdown,
  };
};

/**
 * 10. Management: Attendance Reports & Low Attendance Alerts
 */
const getManagementReports = async (query = {}) => {
  const { threshold = 75, class: className, section } = query;
  const parsedThreshold = parseFloat(threshold) || 75;

  const studentFilter = { status: 'ACTIVE' };
  if (className) studentFilter.class = className;
  if (section) studentFilter.section = section;

  // Find students whose attendance is below threshold
  const lowAttendanceStudents = await Student.find({
    ...studentFilter,
    attendancePercentage: { $lt: parsedThreshold },
  }).select('admissionNo fullName class section rollNo parentName parentPhone attendancePercentage');

  // Overall attendance statistics by class
  const classStats = await Student.aggregate([
    { $match: { status: 'ACTIVE' } },
    {
      $group: {
        _id: { class: '$class', section: '$section' },
        avgAttendance: { $avg: '$attendancePercentage' },
        totalStudents: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        class: '$_id.class',
        section: '$_id.section',
        totalStudents: 1,
        avgAttendance: { $round: ['$avgAttendance', 1] },
      },
    },
    { $sort: { class: 1, section: 1 } },
  ]);

  return {
    threshold: parsedThreshold,
    lowAttendanceCount: lowAttendanceStudents.length,
    lowAttendanceList: lowAttendanceStudents,
    classPerformance: classStats,
  };
};

module.exports = {
  normalizeDate,
  getTeacherAssignedClasses,
  getClassStudentsForAttendance,
  markClassAttendance,
  updatePermittedAttendance,
  getAttendanceHistory,
  getStudentAttendanceSummary,
  getStudentDailyAttendance,
  getStudentMonthlyAttendance,
  getManagementSchoolOverview,
  getManagementReports,
};
