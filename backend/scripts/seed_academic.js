/**
 * Seed Academic Years, Subjects, Classes, Sections, and Teacher Allocations
 */
const mongoose = require('mongoose');
const config = require('../src/config/env');
const AcademicYear = require('../src/models/academicYear.model');
const ClassSection = require('../src/models/classSection.model');
const { Subject } = require('../src/models/subject.model');
const { Teacher } = require('../src/models/teacher.model');

const seedAcademic = async () => {
  await mongoose.connect(config.mongodbUri);
  console.log('[Academic Seed] Connected to MongoDB');

  await AcademicYear.deleteMany({});
  await Subject.deleteMany({});
  await ClassSection.deleteMany({});
  console.log('[Academic Seed] Cleared academic years, subjects, and class sections.');

  // Find faculty
  const teacherSunitha = await Teacher.findOne({ fullName: /Sunitha/i });
  const teacherRamesh = await Teacher.findOne({ fullName: /Ramesh/i });

  // 1. Seed Academic Year
  const currentYear = await AcademicYear.create({
    name: '2025-2026',
    startDate: new Date('2025-06-12'),
    endDate: new Date('2026-04-20'),
    isCurrent: true,
    status: 'ACTIVE',
    terms: [
      { name: 'Term 1', startDate: new Date('2025-06-12'), endDate: new Date('2025-10-31') },
      { name: 'Term 2', startDate: new Date('2025-11-01'), endDate: new Date('2026-04-20') },
    ],
  });
  console.log(`[Academic Seed] Seeded Academic Year: ${currentYear.name} (Current & Active)`);

  // 2. Seed Subjects
  const subjects = await Subject.insertMany([
    {
      code: 'MATH-10',
      name: 'Mathematics',
      type: 'CORE',
      applicableClasses: ['8', '9', '10'],
      description: 'Algebra, Trigonometry, Coordinate Geometry, Quadratic Equations',
    },
    {
      code: 'SCI-10',
      name: 'Physical Science',
      type: 'CORE',
      applicableClasses: ['8', '9', '10'],
      description: 'Mechanics, Optics, Electricity, Chemical Reactions',
    },
    {
      code: 'ENG-10',
      name: 'English Language & Literature',
      type: 'LANGUAGE',
      applicableClasses: ['6', '7', '8', '9', '10'],
      description: 'Grammar, Prose, Poetry, Reading Comprehension',
    },
    {
      code: 'TEL-10',
      name: 'Telugu (First Language)',
      type: 'LANGUAGE',
      applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      description: 'State Board Prescribed First Language Curriculum',
    },
    {
      code: 'SOC-10',
      name: 'Social Studies',
      type: 'CORE',
      applicableClasses: ['6', '7', '8', '9', '10'],
      description: 'Indian History, Geography, Economics, Civics',
    },
    {
      code: 'CS-LAB',
      name: 'Computer Science & Lab',
      type: 'LAB',
      applicableClasses: ['6', '7', '8', '9', '10'],
      description: 'Programming fundamentals, Office tools, Digital Literacy',
    },
  ]);
  console.log(`[Academic Seed] Seeded ${subjects.length} curriculum subjects.`);

  const mathSubject = subjects.find((s) => s.code === 'MATH-10');
  const sciSubject = subjects.find((s) => s.code === 'SCI-10');

  // 3. Seed ClassSections with Room Allocation, Class Teachers, and Subject Allocations
  const class10A = await ClassSection.create({
    className: '10',
    section: 'A',
    academicYear: '2025-2026',
    roomNumber: 'Room 101',
    capacity: 45,
    classTeacher: teacherSunitha ? teacherSunitha._id : null,
    subjectAllocations: [
      {
        subject: mathSubject._id,
        subjectName: mathSubject.name,
        teacher: teacherSunitha ? teacherSunitha._id : null,
        weeklyPeriods: 6,
      },
      {
        subject: sciSubject._id,
        subjectName: sciSubject.name,
        teacher: teacherRamesh ? teacherRamesh._id : null,
        weeklyPeriods: 5,
      },
    ],
  });

  const class9B = await ClassSection.create({
    className: '9',
    section: 'B',
    academicYear: '2025-2026',
    roomNumber: 'Room 203',
    capacity: 45,
    subjectAllocations: [
      {
        subject: mathSubject._id,
        subjectName: mathSubject.name,
        teacher: teacherSunitha ? teacherSunitha._id : null,
        weeklyPeriods: 5,
      },
    ],
  });

  const class8C = await ClassSection.create({
    className: '8',
    section: 'C',
    academicYear: '2025-2026',
    roomNumber: 'Room 108',
    capacity: 45,
    classTeacher: teacherRamesh ? teacherRamesh._id : null,
    subjectAllocations: [
      {
        subject: sciSubject._id,
        subjectName: sciSubject.name,
        teacher: teacherRamesh ? teacherRamesh._id : null,
        weeklyPeriods: 5,
      },
    ],
  });

  const class6A = await ClassSection.create({
    className: '6',
    section: 'A',
    academicYear: '2025-2026',
    roomNumber: 'Room 004',
    capacity: 40,
  });

  console.log(`[Academic Seed] Seeded Class Sections: 10-A (Class Teacher: Sunitha), 9-B, 8-C (Class Teacher: Ramesh), 6-A.`);
  await mongoose.disconnect();
};

seedAcademic().catch(console.error);
