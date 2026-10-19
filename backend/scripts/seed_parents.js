/**
 * Seed Parents, Multiple Children, Fees, Assignments, and Messages
 */
const mongoose = require('mongoose');
const config = require('../src/config/env');
const { Student } = require('../src/models/student.model');
const { User } = require('../src/models/user.model');
const Assignment = require('../src/models/assignment.model');
const Fee = require('../src/models/fee.model');
const Message = require('../src/models/message.model');
const { Notification } = require('../src/models/notification.model');

const seedParents = async () => {
  await mongoose.connect(config.mongodbUri);
  console.log('[Parent Seed] Connected to MongoDB');

  // Find users
  const parent1User = await User.findOne({ username: 'parent1' });
  const parent2User = await User.findOne({ username: 'parent2' });
  const teacherUser = await User.findOne({ username: 'teacher1' });

  // 1. Ensure Parent 1 has MULTIPLE children
  // Child 1: A. Rahul (Class 10-A, SV-0001)
  let child1 = await Student.findOne({ admissionNo: 'SV-0001' });
  if (child1) {
    child1.parentUser = parent1User._id;
    child1.parentName = parent1User.fullName;
    child1.parentPhone = parent1User.phone;
    await child1.save();
  }

  // Child 2: A. Sneha (Class 6-A, SV-0010) - Second child for parent1!
  let child2 = await Student.findOne({ admissionNo: 'SV-0010' });
  if (!child2) {
    child2 = await Student.create({
      admissionNo: 'SV-0010',
      fullName: 'A. Sneha',
      gender: 'female',
      class: '6',
      section: 'A',
      rollNo: '6015',
      status: 'ACTIVE',
      academicYear: '2025-2026',
      bloodGroup: 'O+',
      dob: '22 Mar 2014',
      phone: '9848001010',
      parentName: parent1User.fullName,
      parentPhone: parent1User.phone,
      parentUser: parent1User._id,
      attendancePercentage: 98,
      gpa: 9.6,
      feeStatus: 'Paid',
    });
  } else {
    child2.parentUser = parent1User._id;
    await child2.save();
  }

  // Child of Parent 2: B. Priya (Class 8-C, SV-0002)
  let childPriya = await Student.findOne({ admissionNo: 'SV-0002' });
  if (childPriya) {
    childPriya.parentUser = parent2User._id;
    childPriya.parentName = parent2User.fullName;
    childPriya.parentPhone = parent2User.phone;
    await childPriya.save();
  }

  // Update parent users' children arrays
  parent1User.children = [child1._id, child2._id];
  await parent1User.save({ validateBeforeSave: false });

  parent2User.children = [childPriya._id];
  await parent2User.save({ validateBeforeSave: false });

  console.log(`[Parent Seed] Configured Parent 1 (${parent1User.fullName}) with 2 children: Rahul & Sneha.`);
  console.log(`[Parent Seed] Configured Parent 2 (${parent2User.fullName}) with 1 child: Priya.`);

  // 2. Seed Assignments for Class 10-A and Class 6-A
  await Assignment.deleteMany({});
  await Assignment.create([
    {
      title: 'Quadratic Equations Exercise 4.2',
      description: 'Solve questions 1 through 10 from NCERT Chapter 4 on Quadratic Factorization.',
      subject: 'Mathematics',
      class: '10',
      section: 'A',
      assignedDate: new Date('2026-09-20'),
      dueDate: new Date('2026-09-28'),
      totalMarks: 25,
      status: 'ACTIVE',
    },
    {
      title: 'Human Eye & Colourful World Lab Report',
      description: 'Complete prism refraction ray diagrams and submit laboratory observation sheet.',
      subject: 'Science',
      class: '10',
      section: 'A',
      assignedDate: new Date('2026-09-21'),
      dueDate: new Date('2026-09-30'),
      totalMarks: 20,
      status: 'ACTIVE',
    },
    {
      title: 'Fractions and Decimals Worksheet',
      description: 'Complete word problems on proper and improper fractions on sheet 3.',
      subject: 'Mathematics',
      class: '6',
      section: 'A',
      assignedDate: new Date('2026-09-22'),
      dueDate: new Date('2026-09-29'),
      totalMarks: 15,
      status: 'ACTIVE',
    },
  ]);
  console.log('[Parent Seed] Seeded class homework & assignments.');

  // 3. Seed Fees for Child 1 & Child 2
  await Fee.deleteMany({});
  await Fee.create([
    {
      student: child1._id,
      academicYear: '2025-2026',
      term: 'Annual Academic & Term 1',
      totalAmount: 26000,
      paidAmount: 26000,
      dueAmount: 0,
      status: 'Paid',
      dueDate: new Date('2026-10-30'),
      breakdown: [
        { item: 'Tuition Fee (Class 10)', amount: 19000 },
        { item: 'Laboratory & Digital Smart Board Fee', amount: 4000 },
        { item: 'Board Exam Preparation Materials', amount: 3000 },
      ],
      payments: [
        {
          transactionId: 'TXN-SV-847291',
          amount: 26000,
          date: new Date('2026-06-12'),
          method: 'UPI (Google Pay)',
          receiptNumber: 'REC-2025-0101',
        },
      ],
    },
    {
      student: child2._id,
      academicYear: '2025-2026',
      term: 'Annual Academic & Term 1',
      totalAmount: 22000,
      paidAmount: 22000,
      dueAmount: 0,
      status: 'Paid',
      dueDate: new Date('2026-10-30'),
      breakdown: [
        { item: 'Tuition Fee (Class 6)', amount: 16000 },
        { item: 'Computer Lab Fee', amount: 3000 },
        { item: 'Activity & Sports Fee', amount: 3000 },
      ],
      payments: [
        {
          transactionId: 'TXN-SV-847292',
          amount: 22000,
          date: new Date('2026-06-12'),
          method: 'UPI (PhonePe)',
          receiptNumber: 'REC-2025-0102',
        },
      ],
    },
  ]);
  console.log('[Parent Seed] Seeded student fees and payment records.');

  // 4. Seed Parent Message
  await Message.deleteMany({});
  await Message.create({
    sender: parent1User._id,
    recipient: teacherUser._id,
    student: child1._id,
    subject: 'Request for Mathematics extra practice sheets',
    body: 'Dear Sunitha ma’am, Rahul has shown great interest in Quadratic Equations. Could you please share additional practice problems for Chapter 4? Thank you.',
  });

  await mongoose.disconnect();
};

seedParents().catch(console.error);
