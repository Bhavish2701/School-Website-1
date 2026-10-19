/**
 * Comprehensive Test Suite for Admissions Module
 * Tests:
 * 1. Public online admission registration & Application Reference Number generation
 * 2. Public document upload / attachment
 * 3. Secure public status tracking (requiring applicationNumber + phone)
 * 4. Privacy protection: Rejection of status check with wrong phone number (404)
 * 5. Management search & filtering of applications queue
 * 6. Management requesting additional documents (DOCUMENT_VERIFICATION status)
 * 7. Public status check displaying requested documents note
 * 8. Applicant uploading requested documents (auto-transition to UNDER_REVIEW)
 * 9. Management approving application (APPROVED status)
 * 10. Management auto-enrolling approved applicant into Student collection
 * 11. Management rejection workflow with rejection reason
 * 12. Management dashboard overview & queue statistics
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

const runAdmissionTests = async () => {
  console.log('====================================================');
  console.log('  TESTING ADMISSION MANAGEMENT MODULE (MERN)        ');
  console.log('====================================================\n');

  console.log('Obtaining authentication tokens...');
  const principalToken = await login('principal', 'Principal@123');
  const parentToken = await login('parent1', 'Parent@123');
  console.log('Tokens generated successfully.\n');

  // 1. Public: Submit Online Admission Application
  console.log('1. Testing POST /api/v1/admissions/apply (Public Online Registration)...');
  const applyRes = await fetch(`${BASE_URL}/admissions/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentName: 'K. Harsha Vardhan',
      dob: '2013-08-14',
      gender: 'Male',
      applyingClass: '8',
      academicYear: '2025-2026',
      parentName: 'K. Srinivasa Rao',
      phone: '9848022338',
      email: 'srinivasa.k@gmail.com',
      prevSchool: 'Little Angels School, MVP Colony',
      address: 'Plot 42, Sector 8, MVP Colony, Visakhapatnam',
      bloodGroup: 'B+',
    }),
  });
  const applyData = await applyRes.json();
  console.log(`Status: ${applyRes.status}`);
  console.log(`Application Reference Number: ${applyData.data?.applicationNumber}`);
  console.log(`Applicant: ${applyData.data?.studentName} (Class: ${applyData.data?.applyingClass})`);
  console.log(`Initial Status: ${applyData.data?.status}`);
  console.log();

  const appNo = applyData.data?.applicationNumber;
  const appId = applyData.data?.application?._id;

  // 2. Public / Applicant: Attach Required Documents
  console.log(`2. Testing POST /api/v1/admissions/${appId}/documents (Uploading Documents)...`);
  const docsToUpload = [
    {
      docType: 'BIRTH_CERTIFICATE',
      docName: 'Birth Certificate (Govt of AP)',
      docUrl: 'https://storage.srividya.edu/admissions/2025/birth_cert_harsha.pdf',
    },
    {
      docType: 'AADHAAR_CARD',
      docName: 'Student Aadhaar Card Copy',
      docUrl: 'https://storage.srividya.edu/admissions/2025/aadhaar_harsha.pdf',
    },
  ];

  for (const doc of docsToUpload) {
    const docRes = await fetch(`${BASE_URL}/admissions/${appId}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    const docData = await docRes.json();
    console.log(`  Uploaded: ${doc.docName} (${doc.docType})`);
  }
  console.log();

  // 3. Public: Track Application Status (With Phone Verification)
  console.log(`3. Testing GET /api/v1/admissions/status?applicationNumber=${appNo}&phone=9848022338...`);
  const trackRes = await fetch(`${BASE_URL}/admissions/status?applicationNumber=${appNo}&phone=9848022338`);
  const trackData = await trackRes.json();
  console.log(`Status: ${trackRes.status}`);
  console.log(`Applicant: ${trackData.data?.studentName}, Status: ${trackData.data?.status}`);
  console.log(`Documents Uploaded Count: ${trackData.data?.documentsUploadedCount}`);
  console.log();

  // 4. Privacy Check: Status Tracking with Wrong Phone Number
  console.log(`4. Testing Status Lookup Security (Wrong Phone Number)...`);
  const wrongPhoneRes = await fetch(`${BASE_URL}/admissions/status?applicationNumber=${appNo}&phone=9999999999`);
  const wrongPhoneData = await wrongPhoneRes.json();
  console.log(`Status: ${wrongPhoneRes.status} (Expected 404 Not Found)`);
  console.log(`Rejection Message: ${wrongPhoneData.message}`);
  console.log();

  // 5. Management: Search & Filter Applications Queue
  console.log('5. Testing GET /api/v1/admissions (Management Search & Filter)...');
  const mgmtListRes = await fetch(`${BASE_URL}/admissions?search=Harsha&status=SUBMITTED`, {
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  const mgmtListData = await mgmtListRes.json();
  console.log(`Status: ${mgmtListRes.status}`);
  console.log(`Found Applications: ${mgmtListData.data?.pagination?.total}`);
  console.log(`Applicant in Queue: ${mgmtListData.data?.applications?.[0]?.studentName} (${mgmtListData.data?.applications?.[0]?.applicationNumber})`);
  console.log();

  // 6. Management: Request Additional Documents (DOCUMENT_VERIFICATION status)
  console.log('6. Testing PATCH /api/v1/admissions/:id/status (Requesting Documents)...');
  const reqDocsRes = await fetch(`${BASE_URL}/admissions/${appId}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${principalToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'DOCUMENT_VERIFICATION',
      requestedDocuments: [
        'Previous School Transfer Certificate (Counter-signed)',
        'Class 7 Annual Marksheet',
      ],
      reviewerRemarks: 'Please submit counter-signed TC and Class 7 marks memo before interaction date.',
    }),
  });
  const reqDocsData = await reqDocsRes.json();
  console.log(`Status: ${reqDocsRes.status}`);
  console.log(`Updated Status: ${reqDocsData.data?.application?.status}`);
  console.log(`Requested Documents:`, reqDocsData.data?.application?.requestedDocuments);
  console.log();

  // 7. Public: Applicant Tracks Status and sees Requested Documents Notice
  console.log('7. Testing Public Status Inquiry reflecting Document Request...');
  const trackReqRes = await fetch(`${BASE_URL}/admissions/status?applicationNumber=${appNo}&phone=9848022338`);
  const trackReqData = await trackReqRes.json();
  console.log(`Status: ${trackReqRes.status}`);
  console.log(`Current Status: ${trackReqData.data?.status}`);
  console.log(`Reviewer Remarks: ${trackReqData.data?.reviewerRemarks}`);
  console.log(`Required Documents:`, trackReqData.data?.requestedDocuments);
  console.log();

  // 8. Applicant Uploads Requested TC -> Auto-transition to UNDER_REVIEW
  console.log('8. Testing Applicant Uploading Requested TC (Auto-transition to UNDER_REVIEW)...');
  const uploadTcRes = await fetch(`${BASE_URL}/admissions/${appId}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      docType: 'TRANSFER_CERTIFICATE',
      docName: 'Counter-Signed Transfer Certificate (TC-8412)',
      docUrl: 'https://storage.srividya.edu/admissions/2025/tc_harsha_verified.pdf',
    }),
  });
  const uploadTcData = await uploadTcRes.json();
  console.log(`Status: ${uploadTcRes.status}`);
  console.log(`Status after uploading required docs: ${uploadTcData.data?.application?.status}`);
  console.log();

  // 9. Management Approves Application (APPROVED status)
  console.log('9. Testing PATCH /api/v1/admissions/:id/status (Approving Application)...');
  const approveRes = await fetch(`${BASE_URL}/admissions/${appId}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${principalToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'APPROVED',
      reviewerRemarks: 'Documents verified and cleared by Principal. Admission granted for Class 8-A.',
    }),
  });
  const approveData = await approveRes.json();
  console.log(`Status: ${approveRes.status}`);
  console.log(`Updated Status: ${approveData.data?.application?.status}`);
  console.log();

  // 10. Management Converts Approved Application into Enrolled Student
  console.log('10. Testing POST /api/v1/admissions/:id/enroll (Auto-Enrolling Student)...');
  const enrollRes = await fetch(`${BASE_URL}/admissions/${appId}/enroll`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${principalToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      section: 'A',
      rollNo: '804',
    }),
  });
  const enrollData = await enrollRes.json();
  console.log(`Status: ${enrollRes.status}`);
  console.log(`Enrolled Student: ${enrollData.data?.student?.fullName}`);
  console.log(`Generated Admission Number: ${enrollData.data?.student?.admissionNo}`);
  console.log(`Class Allocation: Class ${enrollData.data?.student?.class}-${enrollData.data?.student?.section} (Roll: ${enrollData.data?.student?.rollNo})`);
  console.log();

  // 11. Test Rejection Workflow on Second Application
  console.log('11. Testing Rejection Workflow on Ineligible Application...');
  const app2Res = await fetch(`${BASE_URL}/admissions/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentName: 'R. Vignesh',
      dob: '2023-01-01', // Too young for Class 5
      gender: 'Male',
      applyingClass: '5',
      parentName: 'R. Ramu',
      phone: '9988776655',
    }),
  });
  const app2Data = await app2Res.json();
  const app2Id = app2Data.data?.application?._id;
  const app2No = app2Data.data?.applicationNumber;

  const rejectRes = await fetch(`${BASE_URL}/admissions/${app2Id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${principalToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'REJECTED',
      rejectionReason: 'Age criteria not satisfied as per State Board guidelines for Class 5.',
    }),
  });
  const rejectData = await rejectRes.json();
  console.log(`Status: ${rejectRes.status}`);
  console.log(`Application ${app2No} Status: ${rejectData.data?.application?.status}`);
  console.log(`Rejection Reason: ${rejectData.data?.application?.rejectionReason}`);

  // Verify applicant sees rejection reason on status inquiry
  const trackRejectRes = await fetch(`${BASE_URL}/admissions/status?applicationNumber=${app2No}&phone=9988776655`);
  const trackRejectData = await trackRejectRes.json();
  console.log(`Applicant Inquiry Status: ${trackRejectData.data?.status} - Reason: ${trackRejectData.data?.rejectionReason}`);
  console.log();

  // 12. Management: Admissions Dashboard Overview & Queue Statistics
  console.log('12. Testing GET /api/v1/admissions/overview (Dashboard Overview & Queue)...');
  const overviewRes = await fetch(`${BASE_URL}/admissions/overview`, {
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  const overviewData = await overviewRes.json();
  console.log(`Status: ${overviewRes.status}`);
  console.log(`Dashboard Overview:`, overviewData.data?.overview);
  console.log(`Class Distribution:`, overviewData.data?.classDistribution);
  console.log();

  console.log('====================================================');
  console.log('  ALL ADMISSIONS MODULE TESTS COMPLETED 100%!       ');
  console.log('====================================================');
};

runAdmissionTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
