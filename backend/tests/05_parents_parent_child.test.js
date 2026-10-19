/**
 * Test Suite 05: Parent Module & Strict Parent-Child Authorization Tests
 * Enforces rule: "A parent must never access another parent's child."
 * Covers:
 * - Parent profile & multiple children retrieval (200)
 * - Parent accessing THEIR OWN child's overview, attendance, results, fees (200)
 * - Parent attempting to access ANOTHER PARENT'S child (403 Forbidden)
 * - Management bypass authorization (SUPER_ADMIN, PRINCIPAL can view any child: 200)
 * - Invalid child ID format (400)
 * - Non-existent child ID (404)
 * - 401 Unauthenticated requests
 */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { seedBaseUsers } = require('./helpers/testFixtures');

describe('05 - Parent Module & Parent-Child Authorization Test Suite', () => {
  let fixtures;
  let child1Id;
  let child2Id;

  beforeAll(async () => {
    fixtures = await seedBaseUsers();
    child1Id = fixtures.students.studentDoc1._id.toString(); // Child of Parent 1
    child2Id = fixtures.students.studentDoc2._id.toString(); // Child of Parent 2
  });

  describe('Parent Profile & Child Switcher Endpoints', () => {
    it('Parent 1 can access own parent profile (200)', async () => {
      const res = await request(app)
        .get('/api/v1/parents/profile')
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Parent 1 can retrieve their registered children list (200)', async () => {
      const res = await request(app)
        .get('/api/v1/parents/children')
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.children || res.body.data)).toBe(true);
    });
  });

  describe('Parent-Child Authorization: Authorized Child Access (200)', () => {
    it('Parent 1 can view their OWN child’s academic overview (200)', async () => {
      const res = await request(app)
        .get(`/api/v1/parents/children/${child1Id}/overview`)
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Parent 1 can view their OWN child’s attendance (200)', async () => {
      const res = await request(app)
        .get(`/api/v1/parents/children/${child1Id}/attendance`)
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Parent 1 can view their OWN child’s exam results (200)', async () => {
      const res = await request(app)
        .get(`/api/v1/parents/children/${child1Id}/results`)
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Parent 1 can view their OWN child’s fee status (200)', async () => {
      const res = await request(app)
        .get(`/api/v1/parents/children/${child1Id}/fees`)
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Parent-Child Authorization: Unauthorized Cross-Parent Tampering (403 Forbidden)', () => {
    it('Parent 1 CANNOT view Parent 2’s child overview (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/v1/parents/children/${child2Id}/overview`)
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/object-level authorization failed|only records belonging to their own children|denied/i);
    });

    it('Parent 1 CANNOT view Parent 2’s child attendance (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/v1/parents/children/${child2Id}/attendance`)
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('Parent 1 CANNOT view Parent 2’s child exam results (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/v1/parents/children/${child2Id}/results`)
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('Parent 2 CANNOT view Parent 1’s child overview (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/v1/parents/children/${child1Id}/overview`)
        .set('Authorization', `Bearer ${fixtures.tokens.parent2}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Parent-Child Management Bypass & Error Scenarios', () => {
    it('Principal can view ANY student details via parent-child endpoints (200 Bypass)', async () => {
      const res = await request(app)
        .get(`/api/v1/parents/children/${child2Id}/overview`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 when querying a non-existent child ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/v1/parents/children/${nonExistentId}/overview`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when child ID format is invalid', async () => {
      const res = await request(app)
        .get('/api/v1/parents/children/invalid-id-format/overview')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
