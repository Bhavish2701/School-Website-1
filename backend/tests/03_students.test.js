/**
 * Test Suite 03: Students Module API Tests
 * Covers:
 * - Successful student creation (201)
 * - Validation errors (422)
 * - Duplicate student admission number handling (409 Conflict)
 * - List students with pagination/filters (200)
 * - Get student by ID (200)
 * - Non-existent student ID (404)
 * - Invalid ID format (400)
 * - Role authorization checks (401 & 403)
 */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { seedBaseUsers } = require('./helpers/testFixtures');

describe('03 - Students Module API Test Suite', () => {
  let fixtures;

  beforeAll(async () => {
    fixtures = await seedBaseUsers();
  });

  describe('POST /api/v1/students', () => {
    it('should successfully create a student when authorized management calls (201)', async () => {
      const res = await request(app)
        .post('/api/v1/students')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          admissionNo: 'ADM-2026-999',
          fullName: 'Kiran Kumar',
          gender: 'male',
          class: '10',
          section: 'B',
          rollNo: '1099',
          parentName: 'Suresh Kumar',
          parentPhone: '9876500000',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      const studentObj = res.body.data.student || res.body.data;
      expect(studentObj.admissionNo).toBe('ADM-2026-999');
      expect(studentObj.fullName).toBe('Kiran Kumar');
    });

    it('should fail with 422 validation error when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/students')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          // Missing admissionNo, fullName, gender, class
          section: 'A',
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should fail with 409 conflict when duplicate admission number is used', async () => {
      const res = await request(app)
        .post('/api/v1/students')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          admissionNo: 'ADM-2026-999', // Already created in earlier test
          fullName: 'Duplicate Kiran',
          gender: 'male',
          class: '10',
          section: 'B',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should deny student creation by a STUDENT with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/v1/students')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`)
        .send({
          admissionNo: 'ADM-HACK-001',
          fullName: 'Hacker Student',
          gender: 'other',
          class: '10',
          section: 'A',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should deny unauthenticated student creation with 401', async () => {
      const res = await request(app)
        .post('/api/v1/students')
        .send({
          admissionNo: 'ADM-NOAUTH',
          fullName: 'No Auth Student',
          gender: 'male',
          class: '10',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/students', () => {
    it('should return paginated students list (200)', async () => {
      const res = await request(app)
        .get('/api/v1/students?page=1&limit=10')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.students || res.body.data)).toBe(true);
    });

    it('should support search query parameter (200)', async () => {
      const res = await request(app)
        .get('/api/v1/students?search=Rahul')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/students/:id', () => {
    it('should return student details for valid student ID (200)', async () => {
      const studentId = fixtures.students.studentDoc1._id.toString();
      const res = await request(app)
        .get(`/api/v1/students/${studentId}`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const studentObj = res.body.data.student || res.body.data;
      expect(studentObj._id).toBe(studentId);
    });

    it('should return 404 Not Found for non-existent student ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/v1/students/${nonExistentId}`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 Bad Request for malformed student ID', async () => {
      const res = await request(app)
        .get('/api/v1/students/not-a-valid-object-id')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
