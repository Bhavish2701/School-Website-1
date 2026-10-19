/**
 * Test Suite 01: Authentication & JWT Security Tests
 * Covers:
 * - Login (Success, Invalid credentials, Validation errors)
 * - Protected routes (/auth/me)
 * - JWT validation (Valid, Missing, Malformed, Expired)
 * - Password change (Success, Validation errors, Incorrect old password)
 * - Logout
 */
const request = require('supertest');
const app = require('../src/app');
const {
  seedBaseUsers,
  generateToken,
  generateExpiredToken,
  generateInvalidToken,
} = require('./helpers/testFixtures');

describe('01 - Authentication & JWT Security Test Suite', () => {
  let fixtures;

  beforeAll(async () => {
    fixtures = await seedBaseUsers();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should successfully authenticate user with valid username and password (200)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          identifier: 'principal_test',
          password: 'Test@1234',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('tokens');
      expect(res.body.data.tokens).toHaveProperty('accessToken');
      expect(res.body.data.tokens).toHaveProperty('refreshToken');
      expect(res.body.data.user.role).toBe('PRINCIPAL');
    });

    it('should successfully authenticate user with email and password (200)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          identifier: 'student1_test@srividya.edu.in',
          password: 'Test@1234',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.username).toBe('student1_test');
    });

    it('should reject login with wrong password with 401 error', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          identifier: 'principal_test',
          password: 'WrongPassword999',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid|incorrect/i);
    });

    it('should reject login for non-existent user with 401 error', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          identifier: 'ghost_user_does_not_exist',
          password: 'SomePassword@123',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject login without identifier/password with 422 validation error', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({});

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('JWT Verification & Protected Endpoint (/api/v1/auth/me)', () => {
    it('should return authenticated user profile when valid token provided (200)', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('PRINCIPAL');
      expect(res.body.data.user.username).toBe('principal_test');
    });

    it('should reject request when Authorization header is missing (401)', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject request with malformed or tampered token (401)', async () => {
      const invalidToken = generateInvalidToken();
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${invalidToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject request with expired token (401)', async () => {
      const expiredToken = generateExpiredToken(fixtures.users.principal);
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/expired/i);
    });
  });

  describe('POST /api/v1/auth/change-password', () => {
    it('should fail when passwords do not match with 422 validation error', async () => {
      const res = await request(app)
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`)
        .send({
          currentPassword: 'Test@1234',
          newPassword: 'NewSecurePassword@123',
          confirmPassword: 'MismatchPassword@123',
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });

    it('should fail with 400 when current password is wrong', async () => {
      const res = await request(app)
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`)
        .send({
          currentPassword: 'WrongOldPassword@123',
          newPassword: 'BrandNewPassword@123',
          confirmPassword: 'BrandNewPassword@123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should succeed with 200 when valid current password and matching new password provided', async () => {
      const res = await request(app)
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`)
        .send({
          currentPassword: 'Test@1234',
          newPassword: 'UpdatedPassword@2026',
          confirmPassword: 'UpdatedPassword@2026',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should return 200 success on logout', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
