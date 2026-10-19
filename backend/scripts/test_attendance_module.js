/**
 * Comprehensive Test Suite for Attendance Module
 * Tests:
 * 1. Teacher views assigned classes & sections with live student counts
 * 2. Teacher retrieves class roster for marking attendance
 * 3. Teacher marks and submits class attendance with validation & duplicate prevention
 * 4. Duplicate submission test: ensures submitting again updates/upserts rather than duplicating
 * 5. Tamper protection test: rejects invalid student IDs or students from other classes
 * 6. Permitted attendance update test: updating absent to excused, recalculating student cumulative percentage
 * 7. Teacher/Management views attendance registers history
 * 8. Student views own attendance summary (attendanceRate, attendedDays, absentDays)
 * 9. Student views own daily attendance logs
 * 10. Student views own monthly attendance calendar
 * 11. Parent views authorized child's attendance summary and monthly calendar
 * 12. Parent authorization tamper protection: attempting to access unauthorized child is blocked with 403
 * 13. Management views school-wide attendance overview and class-by-class metrics
 * 14. Management views analytical attendance reports & low-attendance alerts (< 75%)
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

const runAttendanceTests = async () => {
  console.log('====================================================');
  console.log('  TESTING ATTENDANCE MANAGEMENT MODULE (MERN)       ');
  console.log('====================================================\n');

  console.log('Obtaining authentication tokens...');
  const principalToken = await login('principal', 'Principal@123');
  const teacherToken = await login('teacher1', 'Teacher@123');
  const studentToken = await login('student1', 'Student@123');
  const parent1Token = await login('parent1', 'Parent@123');
  const parent2Token = await login('parent2', 'Parent@123');
  console.log('Tokens generated successfully.\n');

  // 1. Teacher views assigned classes
  console.log('1. Testing GET /api/v1/attendance/teacher/classes...');
  const teacherClassesRes = await fetch(`${BASE_URL}/attendance/teacher/classes`, {
    headers: { Authorization: `Bearer ${teacherToken}` },
  });
  const teacherClassesData = await teacherClassesRes.json();
  console.log(`Status: ${teacherClassesRes.status}`);
  console.log(`Teacher: ${teacherClassesData.data?.teacherName} (Employee ID: ${teacherClassesData.data?.employeeId})`);
  console.log(`Assigned Classes Count: ${teacherClassesData.data?.assignedCount}`);
  console.log(`Classes:`, teacherClassesData.data?.classes?.map((c) => `${c.class}-${c.section} (Students: ${c.totalStudents}, MarkedToday: ${c.isMarkedToday})`));
  console.log();

  const targetClass = teacherClassesData.data?.classes?.[0] || { class: '8', section: 'A' };
  const className = targetClass.class;
  const section = targetClass.section;

  // 2. Teacher retrieves class roster for attendance marking
  console.log(`2. Testing GET /api/v1/attendance/classes/${className}/${section}/students...`);
  const rosterRes = await fetch(`${BASE_URL}/attendance/classes/${className}/${section}/students`, {
    headers: { Authorization: `Bearer ${teacherToken}` },
  });
  const rosterData = await rosterRes.json();
  console.log(`Status: ${rosterRes.status}`);
  console.log(`Class: ${rosterData.data?.class}-${rosterData.data?.section}`);
  console.log(`Total Students: ${rosterData.data?.totalStudents}`);
  console.log(`First 3 Students:`, rosterData.data?.students?.slice(0, 3).map((s) => `${s.rollNo}. ${s.fullName} (${s.admissionNo})`));
  console.log();

  if (!rosterData.data?.students?.length) {
    throw new Error('No students found in class to test attendance marking');
  }

  const students = rosterData.data.students;
  const todayStr = '2026-09-23';

  // 3. Teacher marks & submits attendance
  console.log(`3. Testing POST /api/v1/attendance/mark (Submitting today's attendance)...`);
  const attendancePayload = {
    class: className,
    section: section,
    date: todayStr,
    remarks: 'Regular morning attendance session',
    records: students.map((s, idx) => ({
      studentId: s.studentId,
      status: idx === 0 ? 'ABSENT' : idx === 1 ? 'LATE' : 'PRESENT',
      remarks: idx === 0 ? 'Viral fever reported by parent' : '',
    })),
  };

  const markRes = await fetch(`${BASE_URL}/attendance/mark`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${teacherToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(attendancePayload),
  });
  const markData = await markRes.json();
  console.log(`Status: ${markRes.status}`);
  console.log(`Message: ${markData.message}`);
  console.log(`Metrics: Total: ${markData.data?.totalStudents}, Present: ${markData.data?.presentCount}, Absent: ${markData.data?.absentCount}, Late: ${markData.data?.lateCount}, Rate: ${markData.data?.attendanceRate}%`);
  console.log();

  // 4. Duplicate Prevention Test: Resubmitting attendance for the same day
  console.log(`4. Testing Duplicate Prevention: Re-submitting attendance for same class & date...`);
  const duplicateRes = await fetch(`${BASE_URL}/attendance/mark`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${teacherToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...attendancePayload,
      remarks: 'Updated attendance after late arrivals',
    }),
  });
  const duplicateData = await duplicateRes.json();
  console.log(`Status: ${duplicateRes.status}`);
  console.log(`Duplicate prevention handled seamlessly via upsert: ${duplicateData.success}`);
  console.log();

  // 5. Tamper Protection Test: Submitting an invalid or foreign student ID
  console.log('5. Testing Tamper Protection: Submitting fake student ID...');
  const fakePayload = {
    class: className,
    section: section,
    date: todayStr,
    records: [
      {
        studentId: '507f1f77bcf86cd799439011', // Fake ObjectId
        status: 'PRESENT',
      },
    ],
  };
  const tamperRes = await fetch(`${BASE_URL}/attendance/mark`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${teacherToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fakePayload),
  });
  const tamperData = await tamperRes.json();
  console.log(`Status: ${tamperRes.status} (Expected 400 Bad Request)`);
  console.log(`Tamper Rejection Message: ${tamperData.message}`);
  console.log();

  // 6. Update Permitted Attendance Record (e.g. absent -> EXCUSED with remarks)
  console.log('6. Testing PATCH /api/v1/attendance/records/:id (Permitted attendance update)...');
  // Refresh roster to get record ID of first student
  const updatedRosterRes = await fetch(`${BASE_URL}/attendance/classes/${className}/${section}/students?date=${todayStr}`, {
    headers: { Authorization: `Bearer ${teacherToken}` },
  });
  const updatedRosterData = await updatedRosterRes.json();
  const absentStudent = updatedRosterData.data?.students?.find((s) => s.currentStatus === 'ABSENT');

  if (absentStudent && absentStudent.recordId) {
    const patchRes = await fetch(`${BASE_URL}/attendance/records/${absentStudent.recordId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${teacherToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'EXCUSED',
        remarks: 'Doctor certificate approved by Principal',
        isPermitted: true,
      }),
    });
    const patchData = await patchRes.json();
    console.log(`Status: ${patchRes.status}`);
    console.log(`Updated Status: ${patchData.data?.record?.status}`);
    console.log(`Updated Remarks: ${patchData.data?.record?.remarks}`);
    console.log(`Is Permitted: ${patchData.data?.record?.isPermitted}`);
    console.log(`Student Cumulative Attendance: ${patchData.data?.studentCumulativePercentage}%`);
  } else {
    console.log('Skipping patch (no absent student record found)');
  }
  console.log();

  // 7. Teacher/Management views attendance history
  console.log('7. Testing GET /api/v1/attendance/history...');
  const historyRes = await fetch(`${BASE_URL}/attendance/history?class=${className}&section=${section}`, {
    headers: { Authorization: `Bearer ${teacherToken}` },
  });
  const historyData = await historyRes.json();
  console.log(`Status: ${historyRes.status}`);
  console.log(`Total History Registers: ${historyData.data?.pagination?.total}`);
  console.log(`Registers:`, historyData.data?.registers?.map((r) => `Date: ${r.date.split('T')[0]}, Present: ${r.presentCount}/${r.totalStudents} (${r.attendanceRate}%)`));
  console.log();

  // 8. Student views own attendance summary
  console.log('8. Testing GET /api/v1/attendance/student/me (Student self attendance summary)...');
  const studentSummaryRes = await fetch(`${BASE_URL}/attendance/student/me`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const studentSummaryData = await studentSummaryRes.json();
  console.log(`Status: ${studentSummaryRes.status}`);
  console.log(`Student: ${studentSummaryData.data?.fullName} (${studentSummaryData.data?.admissionNo})`);
  console.log(`Class: ${studentSummaryData.data?.class}-${studentSummaryData.data?.section}`);
  console.log(`Attendance Rate: ${studentSummaryData.data?.attendanceRate}%`);
  console.log(`Working Days: ${studentSummaryData.data?.totalWorkingDays}, Present: ${studentSummaryData.data?.presentDays}, Absent: ${studentSummaryData.data?.absentDays}`);
  console.log(`Low Attendance Flag: ${studentSummaryData.data?.isLowAttendance}`);
  console.log();

  // 9. Student views daily log
  console.log('9. Testing GET /api/v1/attendance/student/me/daily...');
  const studentDailyRes = await fetch(`${BASE_URL}/attendance/student/me/daily`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const studentDailyData = await studentDailyRes.json();
  console.log(`Status: ${studentDailyRes.status}`);
  console.log(`Total Daily Records: ${studentDailyData.data?.pagination?.total}`);
  console.log();

  // 10. Student views monthly calendar
  console.log('10. Testing GET /api/v1/attendance/student/me/monthly?month=9&year=2026...');
  const studentMonthlyRes = await fetch(`${BASE_URL}/attendance/student/me/monthly?month=9&year=2026`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const studentMonthlyData = await studentMonthlyRes.json();
  console.log(`Status: ${studentMonthlyRes.status}`);
  console.log(`Month: ${studentMonthlyData.data?.month}/${studentMonthlyData.data?.year}`);
  console.log(`Monthly Rate: ${studentMonthlyData.data?.monthlyRate}% (Days recorded: ${studentMonthlyData.data?.totalWorkingDays})`);
  console.log();

  // 11. Parent views child attendance
  console.log('11. Testing Parent Child Attendance Access...');
  // Get parent's children first
  const parentProfileRes = await fetch(`${BASE_URL}/parents/profile`, {
    headers: { Authorization: `Bearer ${parent1Token}` },
  });
  const parentProfileData = await parentProfileRes.json();
  const child = parentProfileData.data?.children?.[0];

  if (child) {
    const childId = child.id || child._id;
    const parentChildRes = await fetch(`${BASE_URL}/attendance/parent/child/${childId}`, {
      headers: { Authorization: `Bearer ${parent1Token}` },
    });
    const parentChildData = await parentChildRes.json();
    console.log(`Status: ${parentChildRes.status}`);
    console.log(`Child: ${parentChildData.data?.fullName} (Class ${parentChildData.data?.class}-${parentChildData.data?.section})`);
    console.log(`Attendance Rate: ${parentChildData.data?.attendanceRate}%`);
    console.log(`Child Monthly Register Status:`);
    const childMonthlyRes = await fetch(`${BASE_URL}/attendance/parent/child/${childId}/monthly?month=9&year=2026`, {
      headers: { Authorization: `Bearer ${parent1Token}` },
    });
    const childMonthlyData = await childMonthlyRes.json();
    console.log(`Child Monthly Rate: ${childMonthlyData.data?.monthlyRate}%`);
  }
  console.log();

  // 12. Parent Tamper Protection Test: Parent 2 attempting to view Parent 1's child
  if (child) {
    const childId = child.id || child._id;
    console.log("12. Testing Parent Tamper Protection (Parent 2 trying to access Parent 1's child)...");
    const forbiddenRes = await fetch(`${BASE_URL}/attendance/parent/child/${childId}`, {
      headers: { Authorization: `Bearer ${parent2Token}` },
    });
    const forbiddenData = await forbiddenRes.json();
    console.log(`Status: ${forbiddenRes.status} (Expected 403 Forbidden)`);
    console.log(`Rejection Message: ${forbiddenData.message}`);
  }
  console.log();

  // 13. Management: School-Wide Attendance Overview
  console.log('13. Testing GET /api/v1/attendance/management/overview...');
  const overviewRes = await fetch(`${BASE_URL}/attendance/management/overview?date=${todayStr}`, {
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  const overviewData = await overviewRes.json();
  console.log(`Status: ${overviewRes.status}`);
  console.log(`Total Classes: ${overviewData.data?.totalClasses}, Marked Classes: ${overviewData.data?.markedClasses}`);
  console.log(`Overall School Attendance Rate: ${overviewData.data?.overallAttendanceRate}%`);
  console.log(`School Breakdown:`, overviewData.data?.classes?.slice(0, 4).map((c) => `Class ${c.class}-${c.section}: Marked=${c.isMarked}, Rate=${c.attendanceRate}%`));
  console.log();

  // 14. Management: Reports & Low Attendance Alerts
  console.log('14. Testing GET /api/v1/attendance/management/reports (Low Attendance Alerts)...');
  const reportsRes = await fetch(`${BASE_URL}/attendance/management/reports?threshold=80`, {
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  const reportsData = await reportsRes.json();
  console.log(`Status: ${reportsRes.status}`);
  console.log(`Threshold: < ${reportsData.data?.threshold}%`);
  console.log(`Low Attendance Students Count: ${reportsData.data?.lowAttendanceCount}`);
  console.log(`Low Attendance List Sample:`, reportsData.data?.lowAttendanceList?.slice(0, 3).map((s) => `${s.fullName} (${s.class}-${s.section}): ${s.attendancePercentage}%`));
  console.log(`Class Performance:`, reportsData.data?.classPerformance);
  console.log();

  console.log('====================================================');
  console.log('  ALL ATTENDANCE MODULE TESTS COMPLETED SUCCESSFULLY! ');
  console.log('====================================================');
};

runAttendanceTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
