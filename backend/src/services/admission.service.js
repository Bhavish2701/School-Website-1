/**
 * Admission Service
 *
 * Implements:
 * 1. Public online registration and unique Application Number generation
 * 2. Document upload and attachment tracking
 * 3. Secure public status tracking (requiring applicationNumber + phone)
 * 4. Management review, search, filtering, and status workflows:
 *    SUBMITTED -> UNDER_REVIEW -> DOCUMENT_VERIFICATION -> APPROVED -> REJECTED -> WAITLISTED
 * 5. Dashboard analytics & auto-enrollment into Student collection upon approval
 */
const mongoose = require('mongoose');
const { Admission } = require('../models/admission.model');
const { Student } = require('../models/student.model');
const ApiError = require('../utils/apiError');

/**
 * Generate unique Application Reference Number (e.g. SV202600001, SV202700001)
 */
const generateApplicationNumber = async (year = new Date().getFullYear().toString()) => {
  const prefix = `SV${year}`;
  const regex = new RegExp(`^${prefix}\\d{5}$`);
  const last = await Admission.findOne({ applicationNumber: regex }).sort({ applicationNumber: -1 });
  let nextSeq = (year === '2026') ? 7 : 1;
  if (last && last.applicationNumber) {
    const numPart = parseInt(last.applicationNumber.slice(prefix.length), 10);
    if (!isNaN(numPart) && numPart >= nextSeq) nextSeq = numPart + 1;
  }
  const padded = String(nextSeq).padStart(5, '0');
  return `${prefix}${padded}`;
};

/**
 * 1. Submit Online Admission Application (Public)
 */
const submitApplication = async (applicationData) => {
  const {
    studentName,
    dob,
    gender,
    applyingClass,
    academicYear = '2025-2026',
    parentName,
    phone,
    email,
    prevSchool,
    address,
    bloodGroup,
    documents = [],
  } = applicationData;

  const appYear = academicYear.split('-')[0] || '2025';
  const applicationNumber = await generateApplicationNumber(appYear);

  const application = await Admission.create({
    applicationNumber,
    studentName,
    dob: new Date(dob),
    gender,
    applyingClass,
    academicYear,
    parentName,
    phone: phone.trim(),
    email: email ? email.toLowerCase().trim() : '',
    prevSchool: prevSchool || '',
    address: address || '',
    bloodGroup: bloodGroup || '',
    status: 'SUBMITTED',
    reviewerRemarks: 'After filling this form, please visit the school and contact the Principal or Vice Principal for the confirmation of your admission.',
    documents: documents || [],
  });

  return application;
};

/**
 * 2. Check Application Status (Public)
 * Requires applicationNumber and registered phone for security
 */
const checkApplicationStatus = async (applicationNumber, phone) => {
  const application = await Admission.findOne({
    applicationNumber: applicationNumber.toUpperCase().trim(),
    phone: phone.trim(),
  }).select(
    'applicationNumber studentName applyingClass academicYear status requestedDocuments reviewerRemarks createdAt documents rejectionReason'
  );

  if (!application) {
    throw ApiError.notFound(
      `No admission application found matching reference '${applicationNumber}' and registered phone '${phone}'. Please verify your credentials.`
    );
  }

  return {
    applicationNumber: application.applicationNumber,
    studentName: application.studentName,
    applyingClass: application.applyingClass,
    academicYear: application.academicYear,
    status: application.status,
    submissionDate: application.createdAt,
    documentsUploadedCount: application.documents ? application.documents.length : 0,
    requestedDocuments: application.requestedDocuments || [],
    reviewerRemarks: application.reviewerRemarks || '',
    rejectionReason: application.status === 'REJECTED' ? application.rejectionReason : null,
  };
};

/**
 * 3. Upload / Attach Document to Application
 */
const uploadDocument = async (applicationId, docData) => {
  let application;
  if (mongoose.Types.ObjectId.isValid(applicationId)) {
    application = await Admission.findById(applicationId);
  } else {
    application = await Admission.findOne({ applicationNumber: applicationId.toUpperCase() });
  }

  if (!application) {
    throw ApiError.notFound('Admission application not found');
  }

  const { docType = 'OTHER', docName, docUrl } = docData;

  application.documents.push({
    docType,
    docName,
    docUrl,
    uploadedAt: new Date(),
    verified: false,
  });

  // If application was awaiting document verification, automatically transition to UNDER_REVIEW
  if (application.status === 'DOCUMENT_VERIFICATION') {
    application.status = 'UNDER_REVIEW';
    application.reviewerRemarks = 'Additional documents received from applicant. Under review by Admissions Office.';
  }

  await application.save();
  return application;
};

/**
 * 4. Get Applications List (Management: Search, Filter, Pagination)
 */
const getApplications = async (query = {}) => {
  const {
    search,
    status,
    applyingClass,
    academicYear,
    startDate,
    endDate,
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = -1,
  } = query;

  const filter = {};

  if (status) filter.status = status;
  if (applyingClass) filter.applyingClass = applyingClass;
  if (academicYear) filter.academicYear = academicYear;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  if (search) {
    filter.$or = [
      { studentName: { $regex: search, $options: 'i' } },
      { applicationNumber: { $regex: search, $options: 'i' } },
      { parentName: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.max(1, parseInt(limit, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const sort = { [sortBy]: parseInt(sortOrder, 10) === 1 ? 1 : -1 };

  const [applications, total] = await Promise.all([
    Admission.find(filter)
      .populate('reviewedBy', 'fullName role')
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit),
    Admission.countDocuments(filter),
  ]);

  return {
    applications,
    pagination: {
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parsedLimit),
      limit: parsedLimit,
    },
  };
};

/**
 * 5. Get Application Details by ID (Management Review)
 */
const getApplicationById = async (applicationId) => {
  const application = await Admission.findById(applicationId)
    .populate('reviewedBy', 'fullName role employeeId email')
    .populate('enrolledStudent', 'admissionNo fullName class section rollNo');

  if (!application) {
    throw ApiError.notFound('Admission application not found');
  }

  return application;
};

/**
 * 6. Update Application Status (Management Action)
 * Supports: SUBMITTED, UNDER_REVIEW, DOCUMENT_VERIFICATION, APPROVED, REJECTED, WAITLISTED
 */
const updateApplicationStatus = async (applicationId, updateData, user) => {
  const application = await Admission.findById(applicationId);
  if (!application) {
    throw ApiError.notFound('Admission application not found');
  }

  const { status, reviewerRemarks, rejectionReason, requestedDocuments } = updateData;

  application.status = status;
  if (reviewerRemarks !== undefined) {
    application.reviewerRemarks = reviewerRemarks;
  } else if (status === 'APPROVED') {
    application.reviewerRemarks = 'Congratulations! Your application has been approved by the Principal / Vice Principal. Your admission is officially confirmed to go forward in Sri Vidya E.M High School.';
  }
  if (rejectionReason !== undefined) application.rejectionReason = rejectionReason;
  if (requestedDocuments && Array.isArray(requestedDocuments)) {
    application.requestedDocuments = requestedDocuments;
  }

  application.reviewedBy = user._id;
  application.reviewedAt = new Date();

  await application.save();

  return application;
};

/**
 * 7. Get Admissions Dashboard Overview & Queue Metrics (Management)
 */
const getAdmissionStatsOverview = async () => {
  const [
    totalApplications,
    submittedCount,
    underReviewCount,
    docVerificationCount,
    approvedCount,
    rejectedCount,
    waitlistedCount,
  ] = await Promise.all([
    Admission.countDocuments(),
    Admission.countDocuments({ status: 'SUBMITTED' }),
    Admission.countDocuments({ status: 'UNDER_REVIEW' }),
    Admission.countDocuments({ status: 'DOCUMENT_VERIFICATION' }),
    Admission.countDocuments({ status: 'APPROVED' }),
    Admission.countDocuments({ status: 'REJECTED' }),
    Admission.countDocuments({ status: 'WAITLISTED' }),
  ]);

  // Aggregate by applying class
  const classBreakdown = await Admission.aggregate([
    {
      $group: {
        _id: '$applyingClass',
        count: { $sum: 1 },
        approved: {
          $sum: { $cond: [{ $eq: ['$status', 'APPROVED'] }, 1, 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    overview: {
      totalApplications,
      submitted: submittedCount,
      underReview: underReviewCount,
      documentVerification: docVerificationCount,
      approved: approvedCount,
      rejected: rejectedCount,
      waitlisted: waitlistedCount,
    },
    classDistribution: classBreakdown,
  };
};

/**
 * 8. Convert Approved Application to Enrolled Student (Management)
 */
const convertToStudent = async (applicationId, enrollmentData = {}, user) => {
  const application = await Admission.findById(applicationId);
  if (!application) {
    throw ApiError.notFound('Admission application not found');
  }

  if (application.status !== 'APPROVED') {
    throw ApiError.badRequest(
      `Cannot enroll student: Application is currently in '${application.status}' status. Only APPROVED applications can be enrolled.`
    );
  }

  if (application.enrolledStudent) {
    const existingStudent = await Student.findById(application.enrolledStudent);
    return {
      alreadyEnrolled: true,
      application,
      student: existingStudent,
      message: 'Student was already enrolled for this application',
    };
  }

  const year = new Date().getFullYear();
  const randNum = Math.floor(100 + Math.random() * 900);
  const admissionNo = enrollmentData.admissionNo || `SV-${year}-${randNum}`;

  const student = await Student.create({
    admissionNo,
    fullName: application.studentName,
    gender: application.gender.toLowerCase(),
    class: enrollmentData.class || application.applyingClass,
    section: enrollmentData.section || 'A',
    rollNo: enrollmentData.rollNo || '',
    dob: application.dob.toISOString().split('T')[0],
    bloodGroup: application.bloodGroup || undefined,
    parentName: application.parentName,
    parentPhone: application.phone,
    email: application.email,
    address: application.address,
    academicYear: application.academicYear,
    status: 'ACTIVE',
  });

  application.enrolledStudent = student._id;
  await application.save();

  return {
    application,
    student,
    message: `Applicant ${application.studentName} enrolled successfully as Student (${student.admissionNo}, Class ${student.class}-${student.section})`,
  };
};

module.exports = {
  submitApplication,
  checkApplicationStatus,
  uploadDocument,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  getAdmissionStatsOverview,
  convertToStudent,
};
