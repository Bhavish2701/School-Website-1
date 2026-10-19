/**
 * Test Fixture & Actor Generation Utilities
 * Provides standardized roles, JWT tokens, mock data, and database reset helpers.
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { User } = require('../../src/models/user.model');
const { Student } = require('../../src/models/student.model');
const { Teacher } = require('../../src/models/teacher.model');

const JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key_srividya_2026';

/**
 * Generate a valid signed JWT for a given user object
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Generate an intentionally expired JWT
 */
const generateExpiredToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '-10s' }
  );
};

/**
 * Generate an invalid / tampered JWT
 */
const generateInvalidToken = () => {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.tamperedsignature';
};

/**
 * Reset test database collections
 */
const resetCollections = async (...models) => {
  for (const model of models) {
    if (model && model.deleteMany) {
      await model.deleteMany({});
    }
  }
};

/**
 * Seed all primary role actors and relational links for RBAC, Parent-Child, and Teacher-Class tests
 */
const seedBaseUsers = async () => {
  // Clear base models
  await resetCollections(User, Student, Teacher);

  const passwordHash = await bcrypt.hash('Test@1234', 10);

  // 1. Super Admin
  const superAdmin = await User.create({
    username: 'superadmin_test',
    email: 'superadmin_test@srividya.edu.in',
    password: 'Test@1234',
    fullName: 'Super Administrator',
    role: 'SUPER_ADMIN',
  });

  // 2. Principal
  const principal = await User.create({
    username: 'principal_test',
    email: 'principal_test@srividya.edu.in',
    password: 'Test@1234',
    fullName: 'Principal Srividya',
    role: 'PRINCIPAL',
  });

  // 3. Office Staff
  const office = await User.create({
    username: 'office_test',
    email: 'office_test@srividya.edu.in',
    password: 'Test@1234',
    fullName: 'Office Admin Staff',
    role: 'OFFICE',
  });

  // 4. Student 1 (Class 10-A)
  const student1User = await User.create({
    username: 'student1_test',
    email: 'student1_test@srividya.edu.in',
    password: 'Test@1234',
    fullName: 'Rahul Sharma',
    role: 'STUDENT',
    studentProfile: {
      class: '10',
      section: 'A',
      rollNumber: '1001',
      admissionNo: 'ADM-TEST-1001',
    },
  });

  // 5. Student 2 (Class 8-C)
  const student2User = await User.create({
    username: 'student2_test',
    email: 'student2_test@srividya.edu.in',
    password: passwordHash,
    fullName: 'Priya Verma',
    role: 'STUDENT',
    studentProfile: {
      class: '8',
      section: 'C',
      rollNumber: '8001',
      admissionNo: 'ADM-TEST-8001',
    },
  });

  // 6. Parent 1 (Parent of Student 1 only)
  const parent1User = await User.create({
    username: 'parent1_test',
    email: 'parent1_test@srividya.edu.in',
    password: passwordHash,
    fullName: 'Mr. Rajesh Sharma',
    role: 'PARENT',
    children: [student1User._id],
  });

  // 7. Parent 2 (Parent of Student 2 only)
  const parent2User = await User.create({
    username: 'parent2_test',
    email: 'parent2_test@srividya.edu.in',
    password: passwordHash,
    fullName: 'Mrs. Sunita Verma',
    role: 'PARENT',
    children: [student2User._id],
  });

  // 8. Teacher 1 (Assigned to Class 10-A, subject Mathematics)
  const teacher1User = await User.create({
    username: 'teacher1_test',
    email: 'teacher1_test@srividya.edu.in',
    password: passwordHash,
    fullName: 'Ananya Rao',
    role: 'TEACHER',
    assignedClasses: [
      { class: '10', section: 'A', subject: 'Mathematics' },
    ],
  });

  // 9. Teacher 2 (Assigned to Class 9-B, subject Science; unassigned to 10-A)
  const teacher2User = await User.create({
    username: 'teacher2_test',
    email: 'teacher2_test@srividya.edu.in',
    password: passwordHash,
    fullName: 'Vikram Joshi',
    role: 'TEACHER',
    assignedClasses: [
      { class: '9', section: 'B', subject: 'Science' },
    ],
  });

  // Create corresponding Student profile documents
  const studentDoc1 = await Student.create({
    admissionNo: 'ADM-TEST-1001',
    fullName: 'Rahul Sharma',
    gender: 'male',
    class: '10',
    section: 'A',
    rollNo: '1001',
    parentName: 'Mr. Rajesh Sharma',
    parentPhone: '9876543210',
    parentUser: parent1User._id,
    user: student1User._id,
    attendancePercentage: 92,
  });

  const studentDoc2 = await Student.create({
    admissionNo: 'ADM-TEST-8001',
    fullName: 'Priya Verma',
    gender: 'female',
    class: '8',
    section: 'C',
    rollNo: '8001',
    parentName: 'Mrs. Sunita Verma',
    parentPhone: '9876543211',
    parentUser: parent2User._id,
    user: student2User._id,
    attendancePercentage: 88,
  });

  // Link children on parent users directly to Student model doc IDs as well as User IDs
  parent1User.children = [student1User._id, studentDoc1._id];
  await parent1User.save();

  parent2User.children = [student2User._id, studentDoc2._id];
  await parent2User.save();

  // Create corresponding Teacher profile documents
  const teacherDoc1 = await Teacher.create({
    employeeId: 'EMP-T1001',
    fullName: 'Ananya Rao',
    gender: 'female',
    email: 'teacher1_test@srividya.edu.in',
    phone: '9876543220',
    user: teacher1User._id,
    assignedClasses: [
      { class: '10', section: 'A', subject: 'Mathematics', isClassTeacher: true },
    ],
    assignedSubjects: ['Mathematics'],
  });

  const teacherDoc2 = await Teacher.create({
    employeeId: 'EMP-T2002',
    fullName: 'Vikram Joshi',
    gender: 'male',
    email: 'teacher2_test@srividya.edu.in',
    phone: '9876543221',
    user: teacher2User._id,
    assignedClasses: [
      { class: '9', section: 'B', subject: 'Science', isClassTeacher: false },
    ],
    assignedSubjects: ['Science'],
  });

  // Generate tokens dictionary
  const tokens = {
    superAdmin: generateToken(superAdmin),
    principal: generateToken(principal),
    office: generateToken(office),
    teacher1: generateToken(teacher1User),
    teacher2: generateToken(teacher2User),
    student1: generateToken(student1User),
    student2: generateToken(student2User),
    parent1: generateToken(parent1User),
    parent2: generateToken(parent2User),
  };

  return {
    users: {
      superAdmin,
      principal,
      office,
      teacher1User,
      teacher2User,
      student1User,
      student2User,
      parent1User,
      parent2User,
    },
    students: {
      studentDoc1,
      studentDoc2,
    },
    teachers: {
      teacherDoc1,
      teacherDoc2,
    },
    tokens,
  };
};

module.exports = {
  JWT_SECRET,
  generateToken,
  generateExpiredToken,
  generateInvalidToken,
  resetCollections,
  seedBaseUsers,
};
