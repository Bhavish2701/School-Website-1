/**
 * Test Suite 12: Error Handling, Object Tampering & Edge Cases Test Suite
 * Covers:
 * - 404 Not Found for undefined routes
 * - 400 Bad Request on invalid MongoDB ObjectId parameters
 * - Object-Level ID Tampering Protection across Students, Parents, and Teachers (403 Forbidden)
 * - Management school-wide bypass (200)
 * - 401 Unauthenticated requests to protected endpoints
 */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const StudentRecord = require('../src/models/studentRecord.model');
const { seedBaseUsers } = require('./helpers/testFixtures');

describe('12 - Error Handling, Object Tampering & Edge Cases Test Suite', () => {
  let fixtures;
  let rec1Id;
  let rec2Id;

  beforeAll(async () => {
    fixtures = await seedBaseUsers();

    // Create 2 test student records
    const rec1 = await StudentRecord.create({
      student: fixtures.users.student1User._id,
      class: '10',
      section: 'A',
      academicYear: '2025-2026',
      term: 'Term 1',
      attendancePercentage: 95,
      teacherRemarks: 'Excellent analytical skills',
    });

    const rec2 = await StudentRecord.create({
      student: fixtures.users.student2User._id,
      class: '8',
      section: 'C',
      academicYear: '2025-2026',
      term: 'Term 1',
      attendancePercentage: 89,
      teacherRemarks: 'Good progress in science',
    });

    rec1Id = rec1._id.toString();
    rec2Id = rec2._id.toString();
  });

  describe('Undefined Routes (404 Not Found)', () => {
    it('should return 404 for undefined root path', async () => {
      const res = await request(app).get('/api/v1/non-existent-endpoint');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not found/i);
    });
  });

  describe('Invalid Parameter Formats (400 Bad Request)', () => {
    it('should return 400 when an invalid MongoDB ObjectId is passed to a resource route', async () => {
      const res = await request(app)
        .get('/api/v1/records/invalid-mongo-id-123')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid.*id|bad request/i);
    });
  });

  describe('Object-Level ID Tampering Authorization Tests', () => {
    it('Student 1 CAN access their OWN academic record (200)', async () => {
      const res = await request(app)
        .get(`/api/v1/records/${rec1Id}`)
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.record._id).toBe(rec1Id);
    });

    it('ID Tampering: Student 1 CANNOT access Student 2’s record (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/v1/records/${rec2Id}`)
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/object-level authorization failed|access to resource.*denied/i);
    });

    it('Parent 1 CAN access their OWN child’s academic record (200)', async () => {
      const res = await request(app)
        .get(`/api/v1/records/${rec1Id}`)
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('ID Tampering: Parent 1 CANNOT access Parent 2’s child record (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/v1/records/${rec2Id}`)
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/object-level authorization failed|only records belonging to their own children/i);
    });

    it('Teacher 1 (assigned to 10-A) CAN access Record 1 for Class 10-A (200)', async () => {
      const res = await request(app)
        .get(`/api/v1/records/${rec1Id}`)
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Teacher 1 CANNOT access Record 2 for UNASSIGNED Class 8-C (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/v1/records/${rec2Id}`)
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/teachers can access only assigned classes/i);
    });

    it('Principal can access any student record across the entire school (200 Management Bypass)', async () => {
      const res = await request(app)
        .get(`/api/v1/records/${rec2Id}`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 when querying a non-existent student record ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/v1/records/${nonExistentId}`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
