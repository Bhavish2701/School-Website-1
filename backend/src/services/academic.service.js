/**
 * Academic Business Logic Service Layer
 * Decouples Academic Years, Classes, Sections, Subjects, Teacher Allocations,
 * Class Assignments, and Academic Dashboard from HTTP transport.
 */
const mongoose = require('mongoose');
const AcademicYear = require('../models/academicYear.model');
const ClassSection = require('../models/classSection.model');
const { Subject } = require('../models/subject.model');
const { Teacher } = require('../models/teacher.model');
const { Student } = require('../models/student.model');
const Assignment = require('../models/assignment.model');
const QueryFeatures = require('../utils/queryFeatures');
const ApiError = require('../utils/apiError');

class AcademicService {
  // =========================================================================
  // 1. ACADEMIC YEARS
  // =========================================================================
  async getAcademicYears() {
    return await AcademicYear.find().sort({ startDate: -1 });
  }

  async createAcademicYear(yearData) {
    const existing = await AcademicYear.findOne({ name: yearData.name.trim() });
    if (existing) {
      throw ApiError.conflict(`Academic Year '${yearData.name}' already exists`, 'DUPLICATE_ACADEMIC_YEAR');
    }
    return await AcademicYear.create(yearData);
  }

  async setCurrentAcademicYear(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid ID format');
    const year = await AcademicYear.findById(id);
    if (!year) throw ApiError.notFound('Academic Year not found');

    year.isCurrent = true;
    year.status = 'ACTIVE';
    await year.save();

    return year;
  }

  // =========================================================================
  // 2. CLASSES & SECTIONS
  // =========================================================================
  async getClasses(queryString = {}) {
    const mongooseQuery = ClassSection.find()
      .populate('classTeacher', 'fullName employeeId phone specialization email')
      .populate('subjectAllocations.teacher', 'fullName employeeId specialization phone')
      .populate('subjectAllocations.subject', 'code name type');

    const queryFeatures = new QueryFeatures(mongooseQuery, queryString)
      .search(['className', 'section', 'roomNumber'])
      .filter()
      .sort('className:asc,section:asc')
      .paginate(20, 100);

    const result = await queryFeatures.execute();

    // Attach live enrolled student count per class-section
    const classesWithEnrollment = await Promise.all(
      result.records.map(async (cls) => {
        const enrolledCount = await Student.countDocuments({
          class: cls.className,
          section: cls.section,
          status: 'ACTIVE',
        });
        const clsObj = cls.toJSON();
        clsObj.enrolledCount = enrolledCount;
        clsObj.availableSeats = Math.max(0, cls.capacity - enrolledCount);
        return clsObj;
      })
    );

    return {
      classes: classesWithEnrollment,
      pagination: result.pagination,
    };
  }

  async getClassById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid ClassSection ID');

    const classSection = await ClassSection.findById(id)
      .populate('classTeacher', 'fullName employeeId phone specialization email')
      .populate('subjectAllocations.teacher', 'fullName employeeId specialization phone')
      .populate('subjectAllocations.subject', 'code name type');

    if (!classSection) throw ApiError.notFound('Class / Section not found');

    const enrolledStudents = await Student.find({
      class: classSection.className,
      section: classSection.section,
      status: 'ACTIVE',
    }).select('admissionNo fullName rollNo gender phone feeStatus attendancePercentage');

    const obj = classSection.toJSON();
    obj.enrolledCount = enrolledStudents.length;
    obj.students = enrolledStudents;

    return obj;
  }

  async createClass(classData) {
    const className = classData.className.trim();
    const section = (classData.section || 'A').trim().toUpperCase();
    const academicYear = classData.academicYear || '2025-2026';

    const existing = await ClassSection.findOne({ className, section, academicYear });
    if (existing) {
      throw ApiError.conflict(
        `Class ${className}-${section} already exists for Academic Year ${academicYear}`,
        'DUPLICATE_CLASS_SECTION'
      );
    }

    return await ClassSection.create({
      ...classData,
      className,
      section,
      academicYear,
    });
  }

  async updateClass(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid ClassSection ID');

    const classSection = await ClassSection.findById(id);
    if (!classSection) throw ApiError.notFound('Class / Section not found');

    Object.assign(classSection, updateData);
    await classSection.save();

    return classSection;
  }

  // =========================================================================
  // 3. SUBJECTS
  // =========================================================================
  async getSubjects(queryString = {}) {
    const mongooseQuery = Subject.find();
    const queryFeatures = new QueryFeatures(mongooseQuery, queryString)
      .search(['code', 'name', 'description'])
      .filter()
      .sort('name:asc')
      .paginate(50, 100);

    const result = await queryFeatures.execute();
    return {
      subjects: result.records,
      pagination: result.pagination,
    };
  }

  async createSubject(subjectData) {
    const code = subjectData.code.trim().toUpperCase();
    const existing = await Subject.findOne({ code });
    if (existing) {
      throw ApiError.conflict(`Subject with code '${code}' already exists`, 'DUPLICATE_SUBJECT_CODE');
    }

    return await Subject.create({
      ...subjectData,
      code,
    });
  }

  async updateSubject(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid Subject ID');

    const subject = await Subject.findById(id);
    if (!subject) throw ApiError.notFound('Subject not found');

    if (updateData.code) {
      const code = updateData.code.trim().toUpperCase();
      if (code !== subject.code) {
        const dup = await Subject.findOne({ code });
        if (dup) throw ApiError.conflict(`Subject code '${code}' is already registered`);
        updateData.code = code;
      }
    }

    Object.assign(subject, updateData);
    await subject.save();
    return subject;
  }

  async deleteSubject(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid Subject ID');

    const subject = await Subject.findById(id);
    if (!subject) throw ApiError.notFound('Subject not found');

    await Subject.findByIdAndDelete(id);
    return { id: subject._id, code: subject.code, name: subject.name, deleted: true };
  }

  // =========================================================================
  // 4. TEACHER ALLOCATIONS (Class Teacher & Subject Allocation)
  // =========================================================================
  async assignTeacher(classSectionId, { teacherId, subjectId, isClassTeacher = false, weeklyPeriods = 5 }) {
    if (!mongoose.Types.ObjectId.isValid(classSectionId)) throw ApiError.badRequest('Invalid ClassSection ID');
    if (!mongoose.Types.ObjectId.isValid(teacherId)) throw ApiError.badRequest('Invalid Teacher ID');

    const classSection = await ClassSection.findById(classSectionId);
    if (!classSection) throw ApiError.notFound('Class / Section not found');

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw ApiError.notFound('Teacher not found');

    let assignedSubjectName = 'General';

    // 1. Assign as Class Teacher
    if (isClassTeacher) {
      classSection.classTeacher = teacher._id;
    }

    // 2. Assign as Subject Teacher
    if (subjectId) {
      if (!mongoose.Types.ObjectId.isValid(subjectId)) throw ApiError.badRequest('Invalid Subject ID');
      const subject = await Subject.findById(subjectId);
      if (!subject) throw ApiError.notFound('Subject not found');

      assignedSubjectName = subject.name;

      // Remove existing allocation for this subject in the class if present
      classSection.subjectAllocations = classSection.subjectAllocations.filter(
        (alloc) => alloc.subject.toString() !== subjectId.toString()
      );

      classSection.subjectAllocations.push({
        subject: subject._id,
        subjectName: subject.name,
        teacher: teacher._id,
        weeklyPeriods: parseInt(weeklyPeriods, 10) || 5,
      });
    }

    await classSection.save();

    // 3. Update Teacher's assignedClasses array for consistency
    const alreadyAssigned = (teacher.assignedClasses || []).some(
      (a) =>
        a.class === classSection.className &&
        a.section === classSection.section &&
        a.subject === assignedSubjectName
    );

    if (!alreadyAssigned) {
      teacher.assignedClasses.push({
        class: classSection.className,
        section: classSection.section,
        subject: assignedSubjectName,
        isClassTeacher: Boolean(isClassTeacher),
      });
      await teacher.save();
    }

    return await ClassSection.findById(classSectionId)
      .populate('classTeacher', 'fullName employeeId specialization phone')
      .populate('subjectAllocations.teacher', 'fullName employeeId specialization phone')
      .populate('subjectAllocations.subject', 'code name type');
  }

  // =========================================================================
  // 5. CLASS ASSIGNMENTS (Homework / Projects)
  // =========================================================================
  async getAssignments(queryString = {}) {
    const mongooseQuery = Assignment.find().populate('teacher', 'fullName employeeId specialization');

    const queryFeatures = new QueryFeatures(mongooseQuery, queryString)
      .search(['title', 'description', 'subject', 'class'])
      .filter()
      .sort('dueDate:asc')
      .paginate(10, 50);

    const result = await queryFeatures.execute();
    return {
      assignments: result.records,
      pagination: result.pagination,
    };
  }

  async getAssignmentById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid Assignment ID');
    const assignment = await Assignment.findById(id).populate('teacher', 'fullName employeeId specialization');
    if (!assignment) throw ApiError.notFound('Assignment not found');
    return assignment;
  }

  async createAssignment(assignmentData, currentUser = null) {
    return await Assignment.create(assignmentData);
  }

  async updateAssignment(id, updateData, currentUser = null) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid Assignment ID');

    const assignment = await Assignment.findById(id);
    if (!assignment) throw ApiError.notFound('Assignment not found');

    Object.assign(assignment, updateData);
    await assignment.save();
    return assignment;
  }

  async deleteAssignment(id, currentUser = null) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw ApiError.badRequest('Invalid Assignment ID');

    const assignment = await Assignment.findById(id);
    if (!assignment) throw ApiError.notFound('Assignment not found');

    await Assignment.findByIdAndDelete(id);
    return { id: assignment._id, title: assignment.title, deleted: true };
  }

  // =========================================================================
  // 6. ACADEMIC DASHBOARD
  // =========================================================================
  async getAcademicDashboard() {
    const currentYear = await AcademicYear.findOne({ isCurrent: true }) || { name: '2025-2026' };

    const totalClassesCount = await ClassSection.distinct('className').then((cls) => cls.length);
    const totalSectionsCount = await ClassSection.countDocuments({ status: 'ACTIVE' });
    const totalSubjectsCount = await Subject.countDocuments({ status: 'ACTIVE' });
    const activeAssignmentsCount = await Assignment.countDocuments({ status: 'ACTIVE' });

    // Calculate class teacher allocation rate
    const sectionsWithClassTeacher = await ClassSection.countDocuments({
      status: 'ACTIVE',
      classTeacher: { $exists: true, $ne: null },
    });
    const teacherAllocationRate = totalSectionsCount > 0
      ? Math.round((sectionsWithClassTeacher / totalSectionsCount) * 100)
      : 100;

    // Class enrollment overview
    const sections = await ClassSection.find({ status: 'ACTIVE' }).select('className section capacity');
    const classEnrollmentOverview = await Promise.all(
      sections.map(async (s) => {
        const enrolled = await Student.countDocuments({ class: s.className, section: s.section, status: 'ACTIVE' });
        return {
          classSection: `${s.className}-${s.section}`,
          capacity: s.capacity,
          enrolledCount: enrolled,
          occupancyPercentage: Math.round((enrolled / s.capacity) * 100),
        };
      })
    );

    return {
      academicYear: currentYear.name,
      metrics: {
        totalClasses: totalClassesCount,
        totalSections: totalSectionsCount,
        totalSubjects: totalSubjectsCount,
        activeAssignments: activeAssignmentsCount,
        teacherAllocationRate: `${teacherAllocationRate}%`,
      },
      classEnrollmentOverview,
    };
  }
}

module.exports = new AcademicService();
