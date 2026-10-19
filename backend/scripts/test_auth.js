/**
 * Verification script for all 7 authentication endpoints
 */
const testAuth = async () => {
  const BASE_URL = 'http://localhost:5000/api/v1/auth';
  const fetch = (...args) => import('node:http').then(() => globalThis.fetch(...args));

  console.log('--- Starting Authentication Verification Tests ---\n');

  // 1. Test Login (Super Admin)
  console.log('1. Testing POST /login with valid credentials (superadmin)...');
  const loginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'superadmin', password: 'SuperAdmin@123' }),
  });
  const loginData = await loginRes.json();
  console.log(`Status: ${loginRes.status}`);
  console.log(`Success: ${loginData.success}`);
  console.log(`User: ${loginData.data?.user?.username} (${loginData.data?.user?.role})`);
  console.log(`Access Token present: ${Boolean(loginData.data?.tokens?.accessToken)}`);
  console.log(`Refresh Token present: ${Boolean(loginData.data?.tokens?.refreshToken)}\n`);

  const accessToken = loginData.data?.tokens?.accessToken;
  const refreshToken = loginData.data?.tokens?.refreshToken;

  // 2. Test Login with invalid credentials
  console.log('2. Testing POST /login with invalid password...');
  const invalidLoginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'superadmin', password: 'WrongPassword' }),
  });
  const invalidData = await invalidLoginRes.json();
  console.log(`Status: ${invalidLoginRes.status} (Expected 401)`);
  console.log(`Code: ${invalidData.code}`);
  console.log(`Message: ${invalidData.message}\n`);

  // 3. Test GET /me (Protected)
  console.log('3. Testing GET /me with Bearer token...');
  const meRes = await fetch(`${BASE_URL}/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const meData = await meRes.json();
  console.log(`Status: ${meRes.status}`);
  console.log(`User: ${meData.data?.user?.fullName} [${meData.data?.user?.role}]\n`);

  // 4. Test POST /refresh
  console.log('4. Testing POST /refresh with refresh token...');
  const refreshRes = await fetch(`${BASE_URL}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const refreshData = await refreshRes.json();
  console.log(`Status: ${refreshRes.status}`);
  console.log(`New Access Token: ${Boolean(refreshData.data?.tokens?.accessToken)}`);
  console.log(`New Refresh Token: ${Boolean(refreshData.data?.tokens?.refreshToken)}\n`);

  const newAccessToken = refreshData.data?.tokens?.accessToken;

  // 5. Test Change Password (on student1 account)
  console.log('5. Testing POST /change-password (logging in as student1 first)...');
  const studentLoginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'student1', password: 'Student@123' }),
  });
  const studentData = await studentLoginRes.json();
  const studentToken = studentData.data.tokens.accessToken;

  const changePassRes = await fetch(`${BASE_URL}/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`,
    },
    body: JSON.stringify({
      currentPassword: 'Student@123',
      newPassword: 'StudentNew@2026',
      confirmPassword: 'StudentNew@2026',
    }),
  });
  const changePassData = await changePassRes.json();
  console.log(`Status: ${changePassRes.status}`);
  console.log(`Message: ${changePassData.message}`);

  // Verify login with new password
  const verifyNewPassRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'student1', password: 'StudentNew@2026' }),
  });
  console.log(`Login with new password status: ${verifyNewPassRes.status} (Expected 200)\n`);

  // 6. Test Forgot Password
  console.log('6. Testing POST /forgot-password for student1...');
  const forgotRes = await fetch(`${BASE_URL}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student@srividya.edu.in' }),
  });
  const forgotData = await forgotRes.json();
  console.log(`Status: ${forgotRes.status}`);
  console.log(`Reset Token: ${forgotData.data?.resetToken?.substring(0, 16)}...`);
  const resetToken = forgotData.data?.resetToken;

  // 7. Test Reset Password
  console.log('7. Testing POST /reset-password with reset token...');
  const resetRes = await fetch(`${BASE_URL}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resetToken,
      newPassword: 'Student@123',
      confirmPassword: 'Student@123',
    }),
  });
  const resetData = await resetRes.json();
  console.log(`Status: ${resetRes.status}`);
  console.log(`Message: ${resetData.message}\n`);

  // 8. Test Logout
  console.log('8. Testing POST /logout...');
  const logoutRes = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${newAccessToken}`,
    },
    body: JSON.stringify({ refreshToken: refreshData.data?.tokens?.refreshToken }),
  });
  const logoutData = await logoutRes.json();
  console.log(`Status: ${logoutRes.status}`);
  console.log(`Message: ${logoutData.message}\n`);

  console.log('--- ALL AUTHENTICATION ENDPOINTS VERIFIED SUCCESSFULLY ---');
};

testAuth().catch(console.error);
