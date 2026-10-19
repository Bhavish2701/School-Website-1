/**
 * Seed Initial Users and Sample Student Records for all Roles
 */
const { User } = require('../models/user.model');
const StudentRecord = require('../models/studentRecord.model');

const seedData = async () => {
  try {
    const existingCount = await User.countDocuments();
    if (existingCount > 0) {
      // Check if student records exist; if not, populate them
      const recordCount = await StudentRecord.countDocuments();
      if (recordCount === 0) {
        await seedRecords();
      }
      return;
    }

    console.log('[Seed] Seeding initial role accounts and relationship mappings...');

    // 1. Create Super Admin
    await User.create({
      username: 'superadmin',
      email: 'superadmin@srividya.edu.in',
      password: 'SuperAdmin@123',
      fullName: 'System Super Administrator',
      role: 'SUPER_ADMIN',
      phone: '9876543210',
    });

    // 2. Create Principal
    await User.create({
      username: 'principal',
      email: 'principal@srividya.edu.in',
      password: 'Principal@123',
      fullName: 'Dr. K. S. Rao (Principal)',
      role: 'PRINCIPAL',
      phone: '9876543211',
    });

    // 3. Create Vice Principal
    await User.create({
      username: 'viceprincipal',
      email: 'viceprincipal@srividya.edu.in',
      password: 'VicePrincipal@123',
      fullName: 'Mrs. L. Vani (Vice Principal)',
      role: 'VICE_PRINCIPAL',
      phone: '9876543212',
    });

    // 4. Create Office Staff
    await User.create({
      username: 'officestaff',
      email: 'office@srividya.edu.in',
      password: 'Office@123',
      fullName: 'M. Ramesh (Office Head)',
      role: 'OFFICE',
      phone: '9876543213',
    });

    // 5. Create Teacher (assigned to 10-A and 9-B)
    await User.create({
      username: 'teacher1',
      email: 'teacher@srividya.edu.in',
      password: 'Teacher@123',
      fullName: 'P. Sunitha (Senior Teacher)',
      role: 'TEACHER',
      phone: '9876543214',
      assignedClasses: [
        { class: '10', section: 'A', subject: 'Mathematics' },
        { class: '9', section: 'B', subject: 'Mathematics' },
      ],
    });

    // 6. Create Parents first to get their IDs
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

    // 7. Create Students linked to their Parents
    const student1 = await User.create({
      username: 'student1',
      email: 'student1@srividya.edu.in',
      password: 'Student@123',
      fullName: 'A. Rahul (Class 10-A)',
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
      fullName: 'B. Priya (Class 8-C)',
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

    // Link children back to parents
    parent1.children = [student1._id];
    await parent1.save({ validateBeforeSave: false });

    parent2.children = [student2._id];
    await parent2.save({ validateBeforeSave: false });

    console.log('[Seed] Users seeded successfully with role relationships.');

    // 8. Seed sample Student Records for object-level authorization testing
    await seedRecords(student1, student2);
  } catch (error) {
    console.error(`[Seed Error] Could not seed data: ${error.message}`);
  }
};

const seedRecords = async (s1, s2) => {
  try {
    const student1 = s1 || (await User.findOne({ username: 'student1' }));
    const student2 = s2 || (await User.findOne({ username: 'student2' }));

    if (!student1 || !student2) return;

    await StudentRecord.deleteMany({});

    // Record for student1 (Class 10-A)
    await StudentRecord.create({
      student: student1._id,
      class: '10',
      section: 'A',
      academicYear: '2025-2026',
      term: 'Term-1',
      attendancePercentage: 96,
      subjects: [
        { subject: 'Mathematics', score: 94, maxScore: 100, grade: 'A+' },
        { subject: 'Science', score: 88, maxScore: 100, grade: 'A' },
        { subject: 'Social Studies', score: 90, maxScore: 100, grade: 'A+' },
        { subject: 'English', score: 92, maxScore: 100, grade: 'A+' },
      ],
      teacherRemarks: 'Excellent analytical aptitude in Mathematics and Science.',
    });

    // Record for student2 (Class 8-C - not assigned to teacher1)
    await StudentRecord.create({
      student: student2._id,
      class: '8',
      section: 'C',
      academicYear: '2025-2026',
      term: 'Term-1',
      attendancePercentage: 92,
      subjects: [
        { subject: 'Mathematics', score: 78, maxScore: 100, grade: 'B+' },
        { subject: 'Science', score: 85, maxScore: 100, grade: 'A' },
        { subject: 'English', score: 88, maxScore: 100, grade: 'A' },
      ],
      teacherRemarks: 'Consistent effort shown across all subjects.',
    });

    console.log('[Seed] Seeded academic records for object-level RBAC testing.');
  } catch (err) {
    console.error(`[Seed Error] Could not seed records: ${err.message}`);
  }
};

module.exports = seedData;
