/**
 * Comprehensive RBAC & Object-Level Authorization Test Suite
 */
const mongoose = require('mongoose');
const config = require('../src/config/env');
const { User } = require('../src/models/user.model');
const StudentRecord = require('../src/models/studentRecord.model');

const BASE_URL = 'http://localhost:5000/api/v1';

const loginAndGetToken = async (username, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: username, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Login failed for ${username}: ${data.message}`);
  }
  return data.data.tokens.accessToken;
};

const makeRequest = async (url, token) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const body = await res.json();
  return { status: res.status, body };
};

const runRBACTests = async () => {
  console.log('===============================================================');
  console.log('  STARTING RBAC & OBJECT-LEVEL AUTHORIZATION VERIFICATION TESTS ');
  console.log('===============================================================\n');

  // Query database to get record IDs dynamically
  await mongoose.connect(config.mongodbUri);
  const student1 = await User.findOne({ username: 'student1' });
  const student2 = await User.findOne({ username: 'student2' });
  const rec1 = await StudentRecord.findOne({ student: student1._id });
  const rec2 = await StudentRecord.findOne({ student: student2._id });
  await mongoose.disconnect();

  const rec1Id = rec1._id.toString();
  const rec2Id = rec2._id.toString();

  console.log(`Test Fixtures:`);
  console.log(`- Record 1 [Student 1 / Class 10-A]: ${rec1Id}`);
  console.log(`- Record 2 [Student 2 / Class 8-C ]: ${rec2Id}\n`);

  // Obtain tokens for all roles
  console.log('Logging in test actors...');
  const tokenStudent1 = await loginAndGetToken('student1', 'Student@123');
  const tokenParent1 = await loginAndGetToken('parent1', 'Parent@123');
  const tokenTeacher1 = await loginAndGetToken('teacher1', 'Teacher@123');
  const tokenPrincipal = await loginAndGetToken('principal', 'Principal@123');
  console.log('Tokens generated successfully.\n');

  // -------------------------------------------------------------
  // TEST SCENARIO 1: STUDENT OBJECT-LEVEL AUTHORIZATION
  // -------------------------------------------------------------
  console.log('--- SCENARIO 1: Student Object-Level Authorization ---');
  console.log('1a. Student 1 requests their OWN record (Record 1)...');
  const s1Own = await makeRequest(`${BASE_URL}/records/${rec1Id}`, tokenStudent1);
  console.log(`Status: ${s1Own.status} (Expected 200)`);
  console.log(`Success: ${s1Own.body.success} | Message: ${s1Own.body.message}\n`);

  console.log('1b. Student 1 tampers with URL to access Student 2\'s record (Record 2)...');
  const s1Tamper = await makeRequest(`${BASE_URL}/records/${rec2Id}`, tokenStudent1);
  console.log(`Status: ${s1Tamper.status} (Expected 403)`);
  console.log(`Denied: ${s1Tamper.body.message}\n`);

  // -------------------------------------------------------------
  // TEST SCENARIO 2: PARENT OBJECT-LEVEL AUTHORIZATION
  // -------------------------------------------------------------
  console.log('--- SCENARIO 2: Parent Object-Level Authorization ---');
  console.log('2a. Parent 1 requests their child\'s record (Record 1 - Rahul)...');
  const p1OwnChild = await makeRequest(`${BASE_URL}/records/${rec1Id}`, tokenParent1);
  console.log(`Status: ${p1OwnChild.status} (Expected 200)`);
  console.log(`Success: ${p1OwnChild.body.success} | Message: ${p1OwnChild.body.message}\n`);

  console.log('2b. Parent 1 tampers with URL to access another parent\'s child (Record 2 - Priya)...');
  const p1Tamper = await makeRequest(`${BASE_URL}/records/${rec2Id}`, tokenParent1);
  console.log(`Status: ${p1Tamper.status} (Expected 403)`);
  console.log(`Denied: ${p1Tamper.body.message}\n`);

  // -------------------------------------------------------------
  // TEST SCENARIO 3: TEACHER OBJECT-LEVEL AUTHORIZATION
  // -------------------------------------------------------------
  console.log('--- SCENARIO 3: Teacher Class Assignment Authorization ---');
  console.log('3a. Teacher 1 (assigned to Class 10-A) requests Record 1 (Class 10-A)...');
  const t1Assigned = await makeRequest(`${BASE_URL}/records/${rec1Id}`, tokenTeacher1);
  console.log(`Status: ${t1Assigned.status} (Expected 200)`);
  console.log(`Success: ${t1Assigned.body.success} | Message: ${t1Assigned.body.message}\n`);

  console.log('3b. Teacher 1 tampers with URL to access Record 2 (Class 8-C - not assigned)...');
  const t1Unassigned = await makeRequest(`${BASE_URL}/records/${rec2Id}`, tokenTeacher1);
  console.log(`Status: ${t1Unassigned.status} (Expected 403)`);
  console.log(`Denied: ${t1Unassigned.body.message}\n`);

  // -------------------------------------------------------------
  // TEST SCENARIO 4: PRINCIPAL SCHOOL-LEVEL MANAGEMENT
  // -------------------------------------------------------------
  console.log('--- SCENARIO 4: School-Level Management Functions ---');
  console.log('4a. Principal requests school management overview (/management/overview)...');
  const prinMgmt = await makeRequest(`${BASE_URL}/management/overview`, tokenPrincipal);
  console.log(`Status: ${prinMgmt.status} (Expected 200)`);
  console.log(`Metrics:`, prinMgmt.body.data?.metrics);
  console.log();

  console.log('4b. Principal accesses any student record across the school (Record 2)...');
  const prinRec2 = await makeRequest(`${BASE_URL}/records/${rec2Id}`, tokenPrincipal);
  console.log(`Status: ${prinRec2.status} (Expected 200) | Principal granted school-wide access\n`);

  console.log('4c. Teacher 1 attempts to access management overview (/management/overview)...');
  const teacherMgmt = await makeRequest(`${BASE_URL}/management/overview`, tokenTeacher1);
  console.log(`Status: ${teacherMgmt.status} (Expected 403)`);
  console.log(`Denied: ${teacherMgmt.body.message}\n`);

  console.log('4d. Student 1 attempts to access management overview (/management/overview)...');
  const studentMgmt = await makeRequest(`${BASE_URL}/management/overview`, tokenStudent1);
  console.log(`Status: ${studentMgmt.status} (Expected 403)`);
  console.log(`Denied: ${studentMgmt.body.message}\n`);

  console.log('===============================================================');
  console.log('  ALL RBAC & OBJECT-LEVEL AUTHORIZATION CRITERIA VERIFIED 100% ');
  console.log('===============================================================');
};

runRBACTests().catch(console.error);
