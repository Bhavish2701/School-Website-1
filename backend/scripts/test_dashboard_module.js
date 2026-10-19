/**
 * Comprehensive Automated Test Suite for Dashboard Backend Module
 *
 * Verifies:
 * 1. GET /api/v1/dashboard/management (Student count, teacher count, attendance, admissions, academic, notifications, activities)
 * 2. GET /api/v1/dashboard/teacher (Classes, today's timetable, attendance tracker, assignments, notifications)
 * 3. GET /api/v1/dashboard/student (Attendance, timetable, assignments, exams, results, notices)
 * 4. GET /api/v1/dashboard/parent (Children, attendance, assignments, exams, fees, notices, notifications)
 * 5. Object-Level Authorization & Privacy Protections (Rejections for cross-role & cross-child tampering)
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

const runDashboardTests = async () => {
  console.log('====================================================');
  console.log('  TESTING DASHBOARD BACKEND APIS (MERN)             ');
  console.log('====================================================\n');

  console.log('Obtaining authentication tokens for all roles...');
  const principalToken = await login('principal', 'Principal@123');
  const teacherToken = await login('teacher1', 'Teacher@123');
  const studentToken = await login('student1', 'Student@123');
  const parentToken = await login('parent1', 'Parent@123');
  const parent2Token = await login('parent2', 'Parent@123');
  console.log('Tokens generated successfully.\n');

  // 1. Management Dashboard
  console.log('1. Testing GET /api/v1/dashboard/management (Executive Management)...');
  const mgmtRes = await fetch(`${BASE_URL}/dashboard/management`, {
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  const mgmtData = await mgmtRes.json();
  console.log(`Status: ${mgmtRes.status}`);
  if (mgmtRes.status !== 200) {
    console.error('Failed:', mgmtData);
    process.exit(1);
  }
  const m = mgmtData.data;
  console.log('  Student Count:', m.studentCount);
  console.log('  Teacher Count:', m.teacherCount);
  console.log('  Today Attendance:', m.attendance);
  console.log('  Admissions Pipeline:', m.admissions);
  console.log('  Academic Metrics: Total Sections =', m.academic.totalSections, '| Pass Rate =', m.academic.overallPassRate + '%');
  console.log(`  Notifications: ${m.notifications.length} announcements`);
  console.log(`  Recent Activities: ${m.recentActivities.length} events logged\n`);

  // Assertions for Management Dashboard
  if (!m.studentCount || m.studentCount.total === undefined) throw new Error('Management studentCount missing');
  if (!m.teacherCount || m.teacherCount.total === undefined) throw new Error('Management teacherCount missing');
  if (!m.attendance || m.attendance.schoolAttendancePercentage === undefined) throw new Error('Management attendance missing');
  if (!m.admissions || m.admissions.total === undefined) throw new Error('Management admissions missing');
  if (!m.academic || !m.academic.classDistribution) throw new Error('Management academic missing');

  // 2. Teacher Dashboard
  console.log('2. Testing GET /api/v1/dashboard/teacher (Teacher Portal)...');
  const teacherRes = await fetch(`${BASE_URL}/dashboard/teacher`, {
    headers: { Authorization: `Bearer ${teacherToken}` },
  });
  const teacherData = await teacherRes.json();
  console.log(`Status: ${teacherRes.status}`);
  if (teacherRes.status !== 200) {
    console.error('Failed:', teacherData);
    process.exit(1);
  }
  const t = teacherData.data;
  console.log(`  Teacher Profile: ${t.teacherProfile.fullName} (${t.teacherProfile.employeeId})`);
  console.log(`  Classes Assigned: ${t.classes.assignedClassesCount} classes (${t.classes.totalStudentsCount} students)`);
  console.log(`  Today's Timetable (${t.todayTimetable.day}): ${t.todayTimetable.totalPeriods} periods scheduled`);
  console.log(`  Attendance Tracker: ${t.attendance.totalAssignedSections} sections assigned, ${t.attendance.markedCount} marked today`);
  console.log(`  Assignments: ${t.assignments.active} active assignments`);
  console.log(`  Notifications: ${t.notifications.unreadCount} unread\n`);

  // Assertions for Teacher Dashboard
  if (!t.classes || !Array.isArray(t.classes.list)) throw new Error('Teacher classes missing');
  if (!t.todayTimetable || t.todayTimetable.totalPeriods === undefined) throw new Error('Teacher timetable missing');
  if (!t.attendance || !t.attendance.classesStatus) throw new Error('Teacher attendance missing');
  if (!t.assignments || !Array.isArray(t.assignments.list)) throw new Error('Teacher assignments missing');

  // 3. Student Dashboard
  console.log('3. Testing GET /api/v1/dashboard/student (Student Portal)...');
  const studentRes = await fetch(`${BASE_URL}/dashboard/student`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const studentData = await studentRes.json();
  console.log(`Status: ${studentRes.status}`);
  if (studentRes.status !== 200) {
    console.error('Failed:', studentData);
    process.exit(1);
  }
  const s = studentData.data;
  console.log(`  Student Profile: ${s.studentProfile.fullName} (Class ${s.studentProfile.class}-${s.studentProfile.section}, Roll: ${s.studentProfile.rollNo})`);
  console.log(`  Attendance Rate: ${s.attendance.overallPercentage}% (Today: ${s.attendance.todayStatus})`);
  console.log(`  Today's Timetable (${s.timetable.day}): ${s.timetable.totalPeriodsToday} periods for Class ${s.studentProfile.class}`);
  console.log(`  Assignments: ${s.assignments.pendingCount} pending / active`);
  console.log(`  Upcoming Exams: ${s.exams.upcomingCount} scheduled`);
  console.log(`  Academic Results: Latest GPA = ${s.results.latestGpa}, Memos = ${s.results.recentResults.length}`);
  console.log(`  Notices: ${s.notices.length} student notices\n`);

  // Assertions for Student Dashboard
  if (!s.studentProfile || !s.studentProfile.admissionNo) throw new Error('Student profile missing');
  if (!s.attendance || s.attendance.overallPercentage === undefined) throw new Error('Student attendance missing');
  if (!s.timetable || !Array.isArray(s.timetable.periods)) throw new Error('Student timetable missing');
  if (!s.assignments || !Array.isArray(s.assignments.list)) throw new Error('Student assignments missing');
  if (!s.exams || !Array.isArray(s.exams.list)) throw new Error('Student exams missing');
  if (!s.results || !Array.isArray(s.results.recentResults)) throw new Error('Student results missing');

  // 4. Parent Dashboard
  console.log('4. Testing GET /api/v1/dashboard/parent (Parent Portal)...');
  const parentRes = await fetch(`${BASE_URL}/dashboard/parent`, {
    headers: { Authorization: `Bearer ${parentToken}` },
  });
  const parentData = await parentRes.json();
  console.log(`Status: ${parentRes.status}`);
  if (parentRes.status !== 200) {
    console.error('Failed:', parentData);
    process.exit(1);
  }
  const p = parentData.data;
  console.log(`  Parent Profile: ${p.parentProfile.fullName} (${p.parentProfile.childrenCount} registered children)`);
  console.log(`  Selected Child: ${p.selectedChild ? p.selectedChild.fullName + ' (Class ' + p.selectedChild.class + '-' + p.selectedChild.section + ')' : 'None'}`);
  console.log(`  Child Attendance: ${p.attendance?.overallPercentage}% (Today: ${p.attendance?.todayStatus})`);
  console.log(`  Child Assignments: ${p.assignments.length} assigned`);
  console.log(`  Child Exams: ${p.exams.length} scheduled`);
  console.log(`  Child Fee Ledger: Total = ₹${p.fees?.totalAmount}, Paid = ₹${p.fees?.paidAmount}, Due = ₹${p.fees?.dueAmount} (Status: ${p.fees?.status})`);
  console.log(`  Notices & Circulars: ${p.notices.length} notices`);
  console.log(`  Parent Notifications: ${p.notifications.length} alerts\n`);

  // Assertions for Parent Dashboard
  if (!p.children || !Array.isArray(p.children)) throw new Error('Parent children missing');
  if (p.children.length > 0) {
    if (!p.selectedChild) throw new Error('Selected child missing');
    if (!p.fees) throw new Error('Child fee ledger missing');
  }

  // 5. Security & Authorization Enforcement
  console.log('5. Testing Security & Authorization Enforcement:');

  // A. Student cannot access Management Dashboard
  console.log('  A. Student requesting /dashboard/management...');
  const studentOnMgmt = await fetch(`${BASE_URL}/dashboard/management`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  console.log(`     Status: ${studentOnMgmt.status} (Expected 403 Forbidden)`);
  if (studentOnMgmt.status !== 403) throw new Error('Student was not blocked from management dashboard');

  // B. Teacher cannot access Management Dashboard
  console.log('  B. Teacher requesting /dashboard/management...');
  const teacherOnMgmt = await fetch(`${BASE_URL}/dashboard/management`, {
    headers: { Authorization: `Bearer ${teacherToken}` },
  });
  console.log(`     Status: ${teacherOnMgmt.status} (Expected 403 Forbidden)`);
  if (teacherOnMgmt.status !== 403) throw new Error('Teacher was not blocked from management dashboard');

  // C. Unauthenticated request to dashboards
  console.log('  C. Unauthenticated request to /dashboard/student...');
  const unauthRes = await fetch(`${BASE_URL}/dashboard/student`);
  console.log(`     Status: ${unauthRes.status} (Expected 401 Unauthorized)`);
  if (unauthRes.status !== 401) throw new Error('Unauthenticated request was not blocked');

  // D. Parent attempting to query unauthorized child
  console.log('  D. Parent2 attempting to query Parent1 child via ?childId=...');
  const firstChildId = p.children[0]?.id;
  if (firstChildId) {
    const parentTamperRes = await fetch(`${BASE_URL}/dashboard/parent?childId=${firstChildId}`, {
      headers: { Authorization: `Bearer ${parent2Token}` },
    });
    console.log(`     Status: ${parentTamperRes.status} (Expected 403 Forbidden)`);
    if (parentTamperRes.status !== 403) throw new Error('Cross-parent child access was not rejected with 403');
  }

  console.log('\n====================================================');
  console.log('  ALL DASHBOARD MODULE TESTS COMPLETED 100%!        ');
  console.log('====================================================\n');
};

runDashboardTests().catch((err) => {
  console.error('\nTest suite encountered an error:\n', err);
  process.exit(1);
});
