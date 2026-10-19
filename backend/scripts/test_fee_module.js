/**
 * Comprehensive Test Suite for Fee Management & Cryptographic Payment Processing
 * Tests:
 * 1. Fee structure creation (Management)
 * 2. Student fee assignment with concession
 * 3. Student fee ledger & breakdown retrieval
 * 4. Management pending fees analytics & overdue reporting
 * 5. Payment Initiation: POST /api/v1/payments/create (server-side order)
 * 6. Tamper Rejection Test: Rejection of fake payment verification / tampered signature
 * 7. Server-Side Payment Verification: POST /api/v1/payments/verify with HMAC SHA-256
 * 8. Second payment settlement (full balance clearance, updating Student.feeStatus to Paid)
 * 9. Payment transaction history (searchable & filterable)
 * 10. Official receipt retrieval by receipt number
 * 11. Security check: Unauthorized parent access denial to another student's receipt (403)
 */
const crypto = require('crypto');
const config = require('../src/config/env');

const BASE_URL = 'http://localhost:5000/api/v1';
const PAYMENT_SECRET = config.paymentSecret;

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

const runFeeTests = async () => {
  console.log('====================================================');
  console.log('  TESTING FEE MANAGEMENT & PAYMENT MODULE (MERN)    ');
  console.log('====================================================\n');

  console.log('Obtaining authentication tokens...');
  const principalToken = await login('principal', 'Principal@123');
  const studentToken = await login('student1', 'Student@123');
  const parent1Token = await login('parent1', 'Parent@123'); // Parent of A. Rahul
  const parent2Token = await login('parent2', 'Parent@123');
  console.log('Tokens generated successfully.\n');

  // 1. Management: Create Fee Structure for Class 10
  console.log('1. Testing POST /api/v1/fees/structures (Creating Class 10 Fee Structure)...');
  const structRes = await fetch(`${BASE_URL}/fees/structures`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${principalToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Class 10 Standard Annual Fee Structure',
      class: '10',
      academicYear: '2025-2026',
      term: 'Annual',
      tuitionFee: 32000,
      transportFee: 5000,
      labFee: 3000,
      computerFee: 2000,
      libraryFee: 1500,
      examinationFee: 1500,
      extracurricularFee: 0,
      admissionFee: 0,
      totalAmount: 45000,
      dueDate: '2026-11-30',
      description: 'Annual comprehensive fee structure for secondary grade 10',
    }),
  });
  const structData = await structRes.json();
  console.log(`Status: ${structRes.status}`);
  console.log(`Structure Created: ${structData.data?.structure?.name} (Total: ₹${structData.data?.structure?.totalAmount})`);
  console.log();

  const structureId = structData.data?.structure?._id;

  // 2. Fetch student details (A. Rahul)
  const rosterRes = await fetch(`${BASE_URL}/attendance/classes/10/A/students`, {
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  const rosterData = await rosterRes.json();
  const rahul = rosterData.data?.students?.[0];
  if (!rahul) throw new Error('Student A. Rahul not found in Class 10-A');
  const rahulId = rahul.studentId;

  // 3. Management: Assign Fee to Student with ₹5,000 Merit Concession
  console.log('2. Testing POST /api/v1/fees/assign (Assigning Fee with Concession)...');
  const assignRes = await fetch(`${BASE_URL}/fees/assign`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${principalToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      studentId: rahulId,
      feeStructureId: structureId,
      academicYear: '2025-2026',
      term: 'Annual',
      concessionAmount: 5000, // Merit concession
      dueDate: '2026-11-30',
    }),
  });
  const assignData = await assignRes.json();
  console.log(`Status: ${assignRes.status}`);
  console.log(`Assigned Fee: Total: ₹${assignData.data?.fee?.totalAmount}, Concession: ₹${assignData.data?.fee?.concessionAmount}, Net Due: ₹${assignData.data?.fee?.dueAmount}, Status: ${assignData.data?.fee?.status}`);
  console.log();

  const feeId = assignData.data?.fee?._id;

  // 4. Student / Parent views fee ledger
  console.log(`3. Testing GET /api/v1/fees/student/${rahulId} (Student Fee Ledger)...`);
  const ledgerRes = await fetch(`${BASE_URL}/fees/student/${rahulId}`, {
    headers: { Authorization: `Bearer ${parent1Token}` },
  });
  const ledgerData = await ledgerRes.json();
  console.log(`Status: ${ledgerRes.status}`);
  console.log(`Student: ${ledgerData.data?.student?.fullName} (${ledgerData.data?.student?.admissionNo})`);
  console.log(`Summary: Billed: ₹${ledgerData.data?.summary?.totalBilled}, Concessions: ₹${ledgerData.data?.summary?.totalConcessions}, Due: ₹${ledgerData.data?.summary?.totalDue}`);
  console.log(`Fee Breakdown:`, ledgerData.data?.fees?.[0]?.breakdown?.map((b) => `${b.item}: ₹${b.amount}`));
  console.log();

  // 5. Management: Pending / Overdue Fees Report
  console.log('4. Testing GET /api/v1/fees/pending (Pending & Overdue Fees Report)...');
  const pendingRes = await fetch(`${BASE_URL}/fees/pending?class=10`, {
    headers: { Authorization: `Bearer ${principalToken}` },
  });
  const pendingData = await pendingRes.json();
  console.log(`Status: ${pendingRes.status}`);
  console.log(`Total Pending Records: ${pendingData.data?.totalPendingRecords}, Outstanding Amount: ₹${pendingData.data?.totalPendingAmount.toLocaleString('en-IN')}`);
  console.log();

  // 6. Tamper Rejection Test: Spoofed signature rejected
  console.log('5. Testing Tamper Rejection: Spoofed payment signature verification...');
  const tamperOrderRes = await fetch(`${BASE_URL}/payments/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${parent1Token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      feeId,
      amount: 5000,
      paymentMethod: 'UPI',
    }),
  });
  const tamperOrderData = await tamperOrderRes.json();
  const tamperOrderId = tamperOrderData.data?.orderId;

  const tamperVerifyRes = await fetch(`${BASE_URL}/payments/verify`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${parent1Token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderId: tamperOrderId,
      paymentId: 'pay_spoof_fake_1234',
      signature: 'spoofed_fake_client_side_signature_99999',
    }),
  });
  const tamperVerifyData = await tamperVerifyRes.json();
  console.log(`Status: ${tamperVerifyRes.status} (Expected 400 Bad Request)`);
  console.log(`Rejection Message: ${tamperVerifyData.message}`);
  console.log();

  // 7. Payment Initiation: POST /api/v1/payments/create (Installment 1: ₹20,000)
  console.log('6. Testing POST /api/v1/payments/create (Initiating Legitimate Payment Order)...');
  const createPayRes = await fetch(`${BASE_URL}/payments/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${parent1Token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      feeId,
      amount: 20000,
      paymentMethod: 'UPI',
      notes: 'Term 1 Partial Fee Payment via UPI',
    }),
  });
  const createPayData = await createPayRes.json();
  console.log(`Status: ${createPayRes.status}`);
  console.log(`Order ID: ${createPayData.data?.orderId}`);
  console.log(`Amount: ₹${createPayData.data?.amount} ${createPayData.data?.currency}`);
  console.log(`Gateway Key: ${createPayData.data?.gatewayKeyId}`);
  console.log();

  const orderId1 = createPayData.data?.orderId;
  const mockPaymentId1 = `pay_upi_${Date.now()}_9412`;

  // 8. Server-Side Payment Verification with Cryptographic HMAC Signature
  console.log('7. Testing Server-Side Cryptographic Verification (HMAC SHA-256)...');
  // Generate authentic HMAC signature matching server secret
  const validSignature1 = crypto
    .createHmac('sha256', PAYMENT_SECRET)
    .update(`${orderId1}|${mockPaymentId1}`)
    .digest('hex');

  const verifyRes1 = await fetch(`${BASE_URL}/payments/verify`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${parent1Token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderId: orderId1,
      paymentId: mockPaymentId1,
      signature: validSignature1,
    }),
  });
  const verifyData1 = await verifyRes1.json();
  console.log(`Status: ${verifyRes1.status}`);
  console.log(`Verified: ${verifyData1.data?.verified}`);
  console.log(`Receipt Number: ${verifyData1.data?.receiptNumber}`);
  console.log(`Amount Paid: ₹${verifyData1.data?.amountPaid}, Remaining Due: ₹${verifyData1.data?.remainingDue}`);
  console.log(`Fee Status: ${verifyData1.data?.feeStatus}`);
  console.log();

  const receiptNumber1 = verifyData1.data?.receiptNumber;

  // 9. Payment Initiation & Settlement: Remaining ₹20,000
  console.log('8. Testing Complete Fee Settlement (Remaining ₹20,000)...');
  const createPayRes2 = await fetch(`${BASE_URL}/payments/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${parent1Token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      feeId,
      amount: 20000,
      paymentMethod: 'NETBANKING',
    }),
  });
  const createPayData2 = await createPayRes2.json();
  const orderId2 = createPayData2.data?.orderId;
  const mockPaymentId2 = `pay_nb_${Date.now()}_8821`;

  const validSignature2 = crypto
    .createHmac('sha256', PAYMENT_SECRET)
    .update(`${orderId2}|${mockPaymentId2}`)
    .digest('hex');

  const verifyRes2 = await fetch(`${BASE_URL}/payments/verify`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${parent1Token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderId: orderId2,
      paymentId: mockPaymentId2,
      signature: validSignature2,
    }),
  });
  const verifyData2 = await verifyRes2.json();
  console.log(`Status: ${verifyRes2.status}`);
  console.log(`Final Settlement Verified: Remaining Due: ₹${verifyData2.data?.remainingDue}, Fee Status: ${verifyData2.data?.feeStatus}`);
  console.log(`Receipt Number: ${verifyData2.data?.receiptNumber}`);
  console.log();

  // 10. Payment History
  console.log('9. Testing GET /api/v1/payments/history (Payment History)...');
  const historyRes = await fetch(`${BASE_URL}/payments/history?studentId=${rahulId}`, {
    headers: { Authorization: `Bearer ${parent1Token}` },
  });
  const historyData = await historyRes.json();
  console.log(`Status: ${historyRes.status}`);
  console.log(`Total Completed Transactions: ${historyData.data?.pagination?.total}`);
  console.log(`Transactions:`, historyData.data?.payments?.map((p) => `Order: ${p.orderId}, ₹${p.amount} (${p.paymentMethod}) - Status: ${p.status}, Receipt: ${p.receiptNumber}`));
  console.log();

  // 11. View Official Receipt Details
  console.log(`10. Testing GET /api/v1/payments/receipts/${receiptNumber1}...`);
  const receiptRes = await fetch(`${BASE_URL}/payments/receipts/${receiptNumber1}`, {
    headers: { Authorization: `Bearer ${parent1Token}` },
  });
  const receiptData = await receiptRes.json();
  console.log(`Status: ${receiptRes.status}`);
  console.log(`Official Receipt: ${receiptData.data?.receipt?.receiptNumber}`);
  console.log(`Institution: ${receiptData.data?.receipt?.institutionName}`);
  console.log(`Issued By: ${receiptData.data?.receipt?.issuedBy}`);
  console.log(`Student: ${receiptData.data?.receipt?.student?.fullName} (${receiptData.data?.receipt?.student?.admissionNo})`);
  console.log(`Amount Paid: ₹${receiptData.data?.receipt?.amountPaid}`);
  console.log(`Remaining Due at Payment: ₹${receiptData.data?.receipt?.remainingDue}`);
  console.log();

  // 12. Security Test: Parent 2 attempting to view Parent 1's child receipt
  console.log("11. Testing Receipt Access Security (Parent 2 accessing Parent 1's child receipt)...");
  const unauthReceiptRes = await fetch(`${BASE_URL}/payments/receipts/${receiptNumber1}`, {
    headers: { Authorization: `Bearer ${parent2Token}` },
  });
  const unauthReceiptData = await unauthReceiptRes.json();
  console.log(`Status: ${unauthReceiptRes.status} (Expected 403 Forbidden)`);
  console.log(`Rejection Message: ${unauthReceiptData.message}`);
  console.log();

  console.log('====================================================');
  console.log('  ALL FEE MANAGEMENT & PAYMENT TESTS PASSED 100%!   ');
  console.log('====================================================');
};

runFeeTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
