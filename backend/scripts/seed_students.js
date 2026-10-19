/**
 * Seed Students Database for Student Module
 */
const mongoose = require('mongoose');
const config = require('../src/config/env');
const { Student } = require('../src/models/student.model');
const { User } = require('../src/models/user.model');

const seedStudents = async () => {
  await mongoose.connect(config.mongodbUri);
  console.log('[Student Seed] Connected to MongoDB');

  await Student.deleteMany({});
  console.log('[Student Seed] Cleared existing student collection.');

  // Find existing users to establish relationships
  const student1User = await User.findOne({ username: 'student1' });
  const student2User = await User.findOne({ username: 'student2' });
  const parent1User = await User.findOne({ username: 'parent1' });
  const parent2User = await User.findOne({ username: 'parent2' });

  const initialStudents = [
    {
      admissionNo: 'SV-0001',
      fullName: 'A. Rahul',
      gender: 'male',
      class: '10',
      section: 'A',
      rollNo: '1001',
      status: 'ACTIVE',
      academicYear: '2025-2026',
      bloodGroup: 'O+',
      dob: '12 May 2010',
      phone: '9848001001',
      email: 'rahul@srividya.edu.in',
      address: 'Plot 42, Sriharipuram, Visakhapatnam',
      parentName: 'A. Srinivasa Rao',
      parentPhone: '9876543216',
      parentUser: parent1User ? parent1User._id : null,
      user: student1User ? student1User._id : null,
      attendancePercentage: 96,
      gpa: 9.4,
      feeStatus: 'Paid',
      emergencyContact: {
        name: 'A. Srinivasa Rao',
        relation: 'Father',
        phone: '9876543216',
      },
    },
    {
      admissionNo: 'SV-0002',
      fullName: 'B. Priya',
      gender: 'female',
      class: '8',
      section: 'C',
      rollNo: '8024',
      status: 'ACTIVE',
      academicYear: '2025-2026',
      bloodGroup: 'B+',
      dob: '18 Aug 2012',
      phone: '9848001002',
      email: 'priya@srividya.edu.in',
      address: 'Door 12-4, Gajuwaka, Visakhapatnam',
      parentName: 'B. Venkat',
      parentPhone: '9876543217',
      parentUser: parent2User ? parent2User._id : null,
      user: student2User ? student2User._id : null,
      attendancePercentage: 92,
      gpa: 8.8,
      feeStatus: 'Paid',
      emergencyContact: {
        name: 'B. Venkat',
        relation: 'Father',
        phone: '9876543217',
      },
    },
    {
      admissionNo: 'SV-0003',
      fullName: 'K. Sai Teja',
      gender: 'male',
      class: '10',
      section: 'A',
      rollNo: '1002',
      status: 'ACTIVE',
      academicYear: '2025-2026',
      bloodGroup: 'A+',
      dob: '24 Jan 2010',
      phone: '9848001003',
      address: 'Flat 201, Kurmannapalem, Visakhapatnam',
      parentName: 'K. Appala Naidu',
      parentPhone: '9848112233',
      attendancePercentage: 88,
      gpa: 8.2,
      feeStatus: 'Partial',
    },
    {
      admissionNo: 'SV-0004',
      fullName: 'M. Divya Bharathi',
      gender: 'female',
      class: '10',
      section: 'A',
      rollNo: '1003',
      status: 'ACTIVE',
      academicYear: '2025-2026',
      bloodGroup: 'AB+',
      dob: '05 Mar 2010',
      phone: '9848001004',
      address: 'Sector 5, Steel Plant Township, VSP',
      parentName: 'M. Narayana Murthy',
      parentPhone: '9848112244',
      attendancePercentage: 98,
      gpa: 9.7,
      feeStatus: 'Paid',
    },
    {
      admissionNo: 'SV-0005',
      fullName: 'G. Karthik',
      gender: 'male',
      class: '9',
      section: 'B',
      rollNo: '901',
      status: 'ACTIVE',
      academicYear: '2025-2026',
      bloodGroup: 'O-',
      dob: '14 Jul 2011',
      phone: '9848001005',
      address: 'Main Road, Pedagantyada, VSP',
      parentName: 'G. Mohan Rao',
      parentPhone: '9848112255',
      attendancePercentage: 91,
      gpa: 8.5,
      feeStatus: 'Pending',
    },
    {
      admissionNo: 'SV-0006',
      fullName: 'V. Siri Varshini',
      gender: 'female',
      class: '9',
      section: 'B',
      rollNo: '902',
      status: 'ACTIVE',
      academicYear: '2025-2026',
      bloodGroup: 'B-',
      dob: '28 Sep 2011',
      phone: '9848001006',
      address: 'Teachers Colony, Visakhapatnam',
      parentName: 'V. Rambabu',
      parentPhone: '9848112266',
      attendancePercentage: 95,
      gpa: 9.1,
      feeStatus: 'Paid',
    },
    {
      admissionNo: 'SV-0007',
      fullName: 'CH. Hemanth',
      gender: 'male',
      class: '7',
      section: 'A',
      rollNo: '701',
      status: 'INACTIVE',
      academicYear: '2025-2026',
      bloodGroup: 'A-',
      dob: '11 Nov 2013',
      phone: '9848001007',
      address: 'BHPV Quarters, Visakhapatnam',
      parentName: 'CH. Suresh',
      parentPhone: '9848112277',
      attendancePercentage: 74,
      gpa: 6.9,
      feeStatus: 'Pending',
    },
    {
      admissionNo: 'SV-0008',
      fullName: 'S. Tanvi Sree',
      gender: 'female',
      class: '6',
      section: 'A',
      rollNo: '601',
      status: 'ACTIVE',
      academicYear: '2025-2026',
      bloodGroup: 'O+',
      dob: '02 Feb 2014',
      phone: '9848001008',
      address: 'Kanithi Road, Visakhapatnam',
      parentName: 'S. Satyanarayana',
      parentPhone: '9848112288',
      attendancePercentage: 93,
      gpa: 8.9,
      feeStatus: 'Paid',
    },
  ];

  const created = await Student.insertMany(initialStudents);
  console.log(`[Student Seed] Successfully seeded ${created.length} students across classes 10, 9, 8, 7, 6.`);

  await mongoose.disconnect();
};

seedStudents().catch(console.error);
