/**
 * Seed Teachers, Timetables, Leaves, and Notifications
 */
const mongoose = require('mongoose');
const config = require('../src/config/env');
const { Teacher } = require('../src/models/teacher.model');
const { User } = require('../src/models/user.model');
const { Leave } = require('../src/models/leave.model');
const { Notification } = require('../src/models/notification.model');

const seedTeachers = async () => {
  await mongoose.connect(config.mongodbUri);
  console.log('[Teacher Seed] Connected to MongoDB');

  await Teacher.deleteMany({});
  await Leave.deleteMany({});
  await Notification.deleteMany({});
  console.log('[Teacher Seed] Cleared teacher, leave, and notification collections.');

  // Find existing teacher user
  const teacherUser = await User.findOne({ username: 'teacher1' });
  const principalUser = await User.findOne({ username: 'principal' });

  // Standard Weekday Timetable Template
  const sampleTimetable = [
    {
      day: 'Monday',
      periods: [
        { periodNumber: 1, startTime: '09:00 AM', endTime: '09:45 AM', class: '10', section: 'A', subject: 'Mathematics', room: 'Room 101' },
        { periodNumber: 2, startTime: '09:45 AM', endTime: '10:30 AM', class: '9', section: 'B', subject: 'Mathematics', room: 'Room 203' },
        { periodNumber: 4, startTime: '11:30 AM', endTime: '12:15 PM', class: '10', section: 'A', subject: 'Maths Lab', room: 'Computer Lab 1' },
      ],
    },
    {
      day: 'Tuesday',
      periods: [
        { periodNumber: 1, startTime: '09:00 AM', endTime: '09:45 AM', class: '9', section: 'B', subject: 'Mathematics', room: 'Room 203' },
        { periodNumber: 3, startTime: '10:45 AM', endTime: '11:30 AM', class: '10', section: 'A', subject: 'Mathematics', room: 'Room 101' },
      ],
    },
    {
      day: 'Wednesday',
      periods: [
        { periodNumber: 2, startTime: '09:45 AM', endTime: '10:30 AM', class: '10', section: 'A', subject: 'Mathematics', room: 'Room 101' },
        { periodNumber: 5, startTime: '01:00 PM', endTime: '01:45 PM', class: '9', section: 'B', subject: 'Mathematics', room: 'Room 203' },
      ],
    },
    {
      day: 'Thursday',
      periods: [
        { periodNumber: 1, startTime: '09:00 AM', endTime: '09:45 AM', class: '10', section: 'A', subject: 'Mathematics', room: 'Room 101' },
        { periodNumber: 4, startTime: '11:30 AM', endTime: '12:15 PM', class: '9', section: 'B', subject: 'Mathematics', room: 'Room 203' },
      ],
    },
    {
      day: 'Friday',
      periods: [
        { periodNumber: 3, startTime: '10:45 AM', endTime: '11:30 AM', class: '10', section: 'A', subject: 'Mathematics', room: 'Room 101' },
        { periodNumber: 6, startTime: '01:45 PM', endTime: '02:30 PM', class: '9', section: 'B', subject: 'Problem Solving', room: 'Room 203' },
      ],
    },
  ];

  // 1. Teacher 1 (Linked to User teacher1)
  const teacher1 = await Teacher.create({
    employeeId: 'SV-TEA-001',
    fullName: 'P. Sunitha',
    gender: 'female',
    qualification: 'M.Sc (Mathematics), B.Ed',
    experienceYears: 8,
    specialization: 'Mathematics',
    email: 'teacher@srividya.edu.in',
    phone: '9848002001',
    address: 'Teachers Colony, Visakhapatnam',
    bloodGroup: 'B+',
    status: 'ACTIVE',
    user: teacherUser ? teacherUser._id : null,
    assignedClasses: [
      { class: '10', section: 'A', subject: 'Mathematics', isClassTeacher: true },
      { class: '9', section: 'B', subject: 'Mathematics', isClassTeacher: false },
    ],
    assignedSubjects: ['Mathematics', 'Statistics'],
    timetable: sampleTimetable,
    leaveBalance: { casual: 10, sick: 9, earned: 15 },
  });

  // 2. Teacher 2 (Science Faculty)
  const teacher2 = await Teacher.create({
    employeeId: 'SV-TEA-002',
    fullName: 'K. Ramesh',
    gender: 'male',
    qualification: 'M.Sc (Physics), B.Ed',
    experienceYears: 6,
    specialization: 'Physical Sciences',
    email: 'ramesh.physics@srividya.edu.in',
    phone: '9848002002',
    address: 'Gajuwaka, Visakhapatnam',
    bloodGroup: 'O+',
    status: 'ACTIVE',
    assignedClasses: [
      { class: '8', section: 'C', subject: 'Science', isClassTeacher: false },
      { class: '10', section: 'A', subject: 'Physics', isClassTeacher: false },
    ],
    assignedSubjects: ['Physics', 'General Science'],
    leaveBalance: { casual: 12, sick: 10, earned: 14 },
  });

  // 3. Seed Sample Leave Applications
  const leave1 = await Leave.create({
    teacher: teacher1._id,
    user: teacherUser ? teacherUser._id : null,
    leaveType: 'CASUAL',
    startDate: new Date('2026-10-05'),
    endDate: new Date('2026-10-06'),
    daysCount: 2,
    reason: 'Family function at hometown',
    status: 'PENDING',
  });

  // 4. Seed Sample Notifications
  await Notification.create({
    title: 'Staff Meeting on Formative Assessment (FA-2)',
    message: 'All secondary faculty members are requested to attend the academic review meeting on Friday at 3:30 PM in the Conference Hall.',
    type: 'ANNOUNCEMENT',
    recipientRole: 'TEACHER',
    senderUser: principalUser ? principalUser._id : null,
  });

  await Notification.create({
    title: 'Parent Inquiry - Rahul (10-A)',
    message: 'Parent A. Srinivasa Rao has requested an academic feedback update regarding Term-1 progress in Mathematics.',
    type: 'PARENT_MESSAGE',
    recipientUser: teacherUser ? teacherUser._id : null,
    recipientRole: 'TEACHER',
  });

  console.log('[Teacher Seed] Successfully seeded teachers, leaves, and notifications.');
  await mongoose.disconnect();
};

seedTeachers().catch(console.error);
