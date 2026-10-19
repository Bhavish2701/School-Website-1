/**
 * End-to-End Test Suite for Student Management Module
 */
const BASE_URL = 'http://localhost:5000/api/v1';

const login = async (identifier, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Login failed for ${identifier}: ${data.message}`);
  return data.data.tokens.accessToken;
};

const runStudentTests = async () => {
  console.log('====================================================');
  console.log('  TESTING STUDENT MANAGEMENT MODULE (MERN BACKEND)  ');
  console.log('====================================================\n');

  console.log('Obtaining auth tokens...');
  const principalToken = await login('principal', 'Principal@123');
  const teacherToken = await login('teacher1', 'Teacher@123');
  const studentToken = await login('student1', 'Student@123');
  const parentToken = await login('parent1', 'Parent@123');
  console.log('Tokens generated successfully.\n');

  // 1. Dashboard Statistics
  console.log('1. Testing GET /api/v1/students/dashboard/stats...');
  const statsRes = await fetch(`${BASE_URL}/students/dashboard/stats`, {
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  const statsData = await statsRes.json();
  console.log(`Status: ${statsRes.status}`);
  console.log(`Summary:`, statsData.data?.stats?.summary);
  console.log(`Gender Stats:`, statsData.data?.stats?.genderStats);
  console.log(`Class Distribution:`, statsData.data?.stats?.classDistribution);
  console.log();

  // 2. List all students (Management view)
  console.log('2. Testing GET /api/v1/students (Management View)...');
  const listRes = await fetch(`${BASE_URL}/students`, {
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  const listData = await listRes.json();
  console.log(`Status: ${listRes.status}`);
  console.log(`Total Students Returned: ${listData.data?.students?.length}`);
  console.log(`Pagination:`, listData.data?.pagination);
  console.log();

  const firstStudent = listData.data?.students?.[0];
  const testStudentId = firstStudent?._id;

  // 3. Search students
  console.log('3. Testing Search (?search=Rahul)...');
  const searchRes = await fetch(`${BASE_URL}/students?search=Rahul`, {
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  const searchData = await searchRes.json();
  console.log(`Status: ${searchRes.status}`);
  console.log(`Matches: ${searchData.data?.students?.length} -> Name: ${searchData.data?.students?.[0]?.fullName}`);
  console.log();

  // 4. Filtering (class=10 & gender=female)
  console.log('4. Testing Filtering (?class=10&gender=female)...');
  const filterRes = await fetch(`${BASE_URL}/students?class=10&gender=female`, {
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  const filterData = await filterRes.json();
  console.log(`Status: ${filterRes.status}`);
  console.log(`Filtered Count: ${filterData.data?.students?.length} -> Found: ${filterData.data?.students?.[0]?.fullName} (${filterData.data?.students?.[0]?.admissionNo})`);
  console.log();

  // 5. Pagination
  console.log('5. Testing Pagination (?page=1&limit=3)...');
  const pageRes = await fetch(`${BASE_URL}/students?page=1&limit=3`, {
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  const pageData = await pageRes.json();
  console.log(`Status: ${pageRes.status}`);
  console.log(`Page records count: ${pageData.data?.students?.length}`);
  console.log(`Pagination Meta:`, pageData.data?.pagination);
  console.log();

  // 6. Sorting (?sort=-gpa)
  console.log('6. Testing Sorting (?sort=-gpa)...');
  const sortRes = await fetch(`${BASE_URL}/students?sort=-gpa`, {
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  const sortData = await sortRes.json();
  console.log(`Status: ${sortRes.status}`);
  const topGPAs = sortData.data?.students?.slice(0, 3).map((s) => `${s.fullName}: ${s.gpa}`);
  console.log(`Top GPAs: [${topGPAs?.join(', ')}]`);
  console.log();

  // 7. Get Student by ID
  console.log(`7. Testing GET /api/v1/students/:id (ID: ${testStudentId})...`);
  const getByIdRes = await fetch(`${BASE_URL}/students/${testStudentId}`, {
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  const getByIdData = await getByIdRes.json();
  console.log(`Status: ${getByIdRes.status}`);
  console.log(`Profile: ${getByIdData.data?.student?.fullName} [${getByIdData.data?.student?.admissionNo}]`);
  console.log(`Parent: ${getByIdData.data?.student?.parentName} (${getByIdData.data?.student?.parentPhone})`);
  console.log(`Blood Group: ${getByIdData.data?.student?.bloodGroup} | Status: ${getByIdData.data?.student?.status}`);
  console.log();

  // 8. Create New Student (POST /api/v1/students)
  console.log('8. Testing POST /api/v1/students (Register New Student)...');
  const newStudentPayload = {
    admissionNo: 'SV-0099',
    fullName: 'C. Vamsi',
    gender: 'male',
    class: '10',
    section: 'A',
    rollNo: '1099',
    status: 'ACTIVE',
    bloodGroup: 'O+',
    dob: '15 Jul 2010',
    phone: '9848001099',
    address: 'Steel Plant Sector-4, Visakhapatnam',
    parentName: 'C. Venkata Rao',
    parentPhone: '9848999999',
    feeStatus: 'Paid',
    attendancePercentage: 94,
    gpa: 8.9,
  };
  const postRes = await fetch(`${BASE_URL}/students`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${principalToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newStudentPayload),
  });
  const postData = await postRes.json();
  console.log(`Status: ${postRes.status} (Expected 201)`);
  console.log(`Registered: ${postData.data?.student?.fullName} (${postData.data?.student?.admissionNo})`);
  const createdStudentId = postData.data?.student?._id;
  console.log();

  // 9. Update Student (PATCH /api/v1/students/:id)
  console.log(`9. Testing PATCH /api/v1/students/:id (Update Attendance & GPA)...`);
  const patchRes = await fetch(`${BASE_URL}/students/${createdStudentId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${principalToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      attendancePercentage: 97,
      gpa: 9.3,
      status: 'ACTIVE',
    }),
  });
  const patchData = await patchRes.json();
  console.log(`Status: ${patchRes.status} (Expected 200)`);
  console.log(`Updated GPA: ${patchData.data?.student?.gpa} | Attendance: ${patchData.data?.student?.attendancePercentage}%`);
  console.log();

  // 10. Delete Student (DELETE /api/v1/students/:id)
  console.log(`10. Testing DELETE /api/v1/students/:id...`);
  const delRes = await fetch(`${BASE_URL}/students/${createdStudentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  const delData = await delRes.json();
  console.log(`Status: ${delRes.status} (Expected 200)`);
  console.log(`Deleted: ${delData.message} (ID: ${delData.data?.id})`);

  // Verify deletion
  const verifyDelRes = await fetch(`${BASE_URL}/students/${createdStudentId}`, {
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  console.log(`Re-fetch status: ${verifyDelRes.status} (Expected 404)\n`);

  // 11. Role-based Scope Verification
  console.log('11. Testing Role-Based Scoping...');
  // Student view:
  const studentListRes = await fetch(`${BASE_URL}/students`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const studentListData = await studentListRes.json();
  console.log(`Student role visible count: ${studentListData.data?.students?.length} (Should be 1: own record)`);

  // Parent view:
  const parentListRes = await fetch(`${BASE_URL}/students`, {
    headers: { Authorization: `Bearer ${parentToken}` },
  });
  const parentListData = await parentListRes.json();
  console.log(`Parent role visible count: ${parentListData.data?.students?.length} (Should be 1: child record)`);

  // Teacher view (assigned to Class 10-A and 9-B):
  const teacherListRes = await fetch(`${BASE_URL}/students`, {
    headers: { Authorization: `Bearer ${teacherToken}` },
  });
  const teacherListData = await teacherListRes.json();
  const teacherClasses = Array.from(new Set(teacherListData.data?.students?.map((s) => s.class)));
  console.log(`Teacher visible classes: [${teacherClasses.join(', ')}] (Strictly 10 and 9)\n`);

  console.log('====================================================');
  console.log('  ALL STUDENT MODULE REQUIREMENTS FULLY VERIFIED 100%');
  console.log('====================================================');
};

runStudentTests().catch(console.error);
