/**
 * Explicit Database Reset & Seeding for RBAC Verification
 */
const mongoose = require('mongoose');
const config = require('../src/config/env');
const { User } = require('../src/models/user.model');
const StudentRecord = require('../src/models/studentRecord.model');

const resetAndSeed = async () => {
  await mongoose.connect(config.mongodbUri);
  console.log('[RBAC Seed] Connected to MongoDB');

  await User.deleteMany({});
  await StudentRecord.deleteMany({});
  console.log('[RBAC Seed] Cleared existing users and student records.');

  // 1. Super Admin
  const superadmin = await User.create({
    username: 'superadmin',
    email: 'superadmin@srividya.edu.in',
    password: 'SuperAdmin@123',
    fullName: 'System Super Administrator',
    role: 'SUPER_ADMIN',
    phone: '9876543210',
  });

  // 2. Principal
  const principal = await User.create({
    username: 'principal',
    email: 'principal@srividya.edu.in',
    password: 'Principal@123',
    fullName: 'Dr. K. S. Rao (Principal)',
    role: 'PRINCIPAL',
    phone: '9876543211',
  });

  // 3. Vice Principal
  const viceprincipal = await User.create({
    username: 'viceprincipal',
    email: 'viceprincipal@srividya.edu.in',
    password: 'VicePrincipal@123',
    fullName: 'Mrs. L. Vani (Vice Principal)',
    role: 'VICE_PRINCIPAL',
    phone: '9876543212',
  });

  // 4. Office Staff
  const office = await User.create({
    username: 'officestaff',
    email: 'office@srividya.edu.in',
    password: 'Office@123',
    fullName: 'M. Ramesh (Office Head)',
    role: 'OFFICE',
    phone: '9876543213',
  });

  // 5. Teacher (assigned to Class 10-A only)
  const teacher1 = await User.create({
    username: 'teacher1',
    email: 'teacher@srividya.edu.in',
    password: 'Teacher@123',
    fullName: 'P. Sunitha (Senior Teacher)',
    role: 'TEACHER',
    phone: '9876543214',
    assignedClasses: [
      { class: '10', section: 'A', subject: 'Mathematics' },
    ],
  });

  // 6. Parents
  const parent1 = await User.create({
    username: 'parent1',
    email: 'parent1@srividya.edu.in',
    password: 'Parent@123',
    fullName: 'A. Srinivasa Rao (Parent of Rahul)',
    role: 'PARENT',
    phone: '9876543216',
    children: [],
  });

  const parent2 = await User.create({
    username: 'parent2',
    email: 'parent2@srividya.edu.in',
    password: 'Parent@123',
    fullName: 'B. Venkat (Parent of Priya)',
    role: 'PARENT',
    phone: '9876543217',
    children: [],
  });

  // 7. Students
  const student1 = await User.create({
    username: 'student1',
    email: 'student1@srividya.edu.in',
    password: 'Student@123',
    fullName: 'A. Rahul (Student 1 - Class 10-A)',
    role: 'STUDENT',
    phone: '9876543215',
    studentProfile: {
      class: '10',
      section: 'A',
      rollNumber: '1001',
      admissionNo: 'ADM-2025-001',
      parentUser: parent1._id,
    },
  });

  const student2 = await User.create({
    username: 'student2',
    email: 'student2@srividya.edu.in',
    password: 'Student@123',
    fullName: 'B. Priya (Student 2 - Class 8-C)',
    role: 'STUDENT',
    phone: '9876543218',
    studentProfile: {
      class: '8',
      section: 'C',
      rollNumber: '8024',
      admissionNo: 'ADM-2025-045',
      parentUser: parent2._id,
    },
  });

  // Link children to parents
  parent1.children = [student1._id];
  await parent1.save({ validateBeforeSave: false });

  parent2.children = [student2._id];
  await parent2.save({ validateBeforeSave: false });

  // 8. Academic Student Records
  // Record 1: belongs to student1 (Class 10-A)
  const rec1 = await StudentRecord.create({
    student: student1._id,
    class: '10',
    section: 'A',
    academicYear: '2025-2026',
    term: 'Term-1',
    attendancePercentage: 96,
    subjects: [
      { subject: 'Mathematics', score: 94, maxScore: 100, grade: 'A+' },
      { subject: 'Science', score: 88, maxScore: 100, grade: 'A' },
    ],
    teacherRemarks: 'Excellent analytical aptitude in Mathematics.',
  });

  // Record 2: belongs to student2 (Class 8-C)
  const rec2 = await StudentRecord.create({
    student: student2._id,
    class: '8',
    section: 'C',
    academicYear: '2025-2026',
    term: 'Term-1',
    attendancePercentage: 92,
    subjects: [
      { subject: 'Mathematics', score: 78, maxScore: 100, grade: 'B+' },
      { subject: 'Social Studies', score: 85, maxScore: 100, grade: 'A' },
    ],
    teacherRemarks: 'Consistent performance.',
  });

  console.log('[RBAC Seed] Seeded successfully:');
  console.log(`- student1 ID: ${student1._id}`);
  console.log(`- student2 ID: ${student2._id}`);
  console.log(`- Record 1 (Student1, Class 10-A) ID: ${rec1._id}`);
  console.log(`- Record 2 (Student2, Class 8-C) ID: ${rec2._id}`);

  await mongoose.disconnect();
};

resetAndSeed().catch(console.error);
