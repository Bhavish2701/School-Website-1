/**
 * Test Suite 02: RBAC (Role-Based Access Control) & Route Authorization Tests
 * Validates permission boundaries across:
 * - SUPER_ADMIN & PRINCIPAL (Management access)
 * - TEACHER (Faculty workspace)
 * - STUDENT (Student portal)
 * - PARENT (Parent gateway)
 * - OFFICE (Administrative staff)
 * - 401 Unauthenticated & 403 Forbidden scenarios
 */
const request = require('supertest');
const app = require('../src/app');
const { seedBaseUsers } = require('./helpers/testFixtures');

describe('02 - RBAC & Route Authorization Test Suite', () => {
  let fixtures;

  beforeAll(async () => {
    fixtures = await seedBaseUsers();
  });

  describe('Management Endpoints Authorization (/api/v1/management/*)', () => {
    it('SUPER_ADMIN should have full access to management overview (200)', async () => {
      const res = await request(app)
        .get('/api/v1/management/overview')
        .set('Authorization', `Bearer ${fixtures.tokens.superAdmin}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('PRINCIPAL should have full access to management overview (200)', async () => {
      const res = await request(app)
        .get('/api/v1/management/overview')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('OFFICE staff should be denied access to management overview with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/management/overview')
        .set('Authorization', `Bearer ${fixtures.tokens.office}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('TEACHER should be denied access to management overview with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/management/overview')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not authorized|forbidden|access denied/i);
    });

    it('STUDENT should be denied access to management overview with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/management/overview')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('PARENT should be denied access to management overview with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/management/overview')
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('Unauthenticated request should fail with 401 Unauthorized', async () => {
      const res = await request(app).get('/api/v1/management/overview');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Teacher Workspace Endpoints Authorization (/api/v1/teachers/*)', () => {
    it('TEACHER can access own workspace profile (200)', async () => {
      const res = await request(app)
        .get('/api/v1/teachers/me')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('STUDENT is denied access to teacher workspace profile (403)', async () => {
      const res = await request(app)
        .get('/api/v1/teachers/me')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('PARENT is denied access to teacher workspace profile (403)', async () => {
      const res = await request(app)
        .get('/api/v1/teachers/me')
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Parent Gateway Endpoints Authorization (/api/v1/parents/*)', () => {
    it('PARENT can access parent profile (200)', async () => {
      const res = await request(app)
        .get('/api/v1/parents/profile')
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('TEACHER is denied access to parent portal (403)', async () => {
      const res = await request(app)
        .get('/api/v1/parents/profile')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('STUDENT is denied access to parent portal (403)', async () => {
      const res = await request(app)
        .get('/api/v1/parents/profile')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });
});
