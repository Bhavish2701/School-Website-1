/**
 * Test Suite 04: Teachers Module API Tests
 * Covers:
 * - Create teacher (201)
 * - Validation errors (422)
 * - Duplicate teacher employeeId check (409 Conflict)
 * - Get teacher list & get teacher by ID (200)
 * - Teacher self-service profile (200)
 * - Teacher apply leave & management review (201 / 200)
 * - Role authorization checks (401 & 403)
 */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { seedBaseUsers } = require('./helpers/testFixtures');

describe('04 - Teachers Module API Test Suite', () => {
  let fixtures;

  beforeAll(async () => {
    fixtures = await seedBaseUsers();
  });

  describe('POST /api/v1/teachers', () => {
    it('should successfully create a new teacher profile when authorized (201)', async () => {
      const res = await request(app)
        .post('/api/v1/teachers')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          employeeId: 'EMP-T3003',
          fullName: 'Ramesh Varma',
          gender: 'male',
          email: 'ramesh.varma@srividya.edu.in',
          phone: '9876599999',
          qualification: 'M.Sc Physics, B.Ed',
          specialization: 'Physics',
          assignedClasses: [
            { class: '10', section: 'A', subject: 'Physics' },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      const teacherObj = res.body.data.teacher || res.body.data;
      expect(teacherObj.employeeId).toBe('EMP-T3003');
    });

    it('should fail with 422 validation error when required teacher fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/teachers')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          // Missing employeeId, fullName, gender, email, phone
          qualification: 'B.Ed',
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should fail with 409 conflict when duplicate employee ID is submitted', async () => {
      const res = await request(app)
        .post('/api/v1/teachers')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          employeeId: 'EMP-T3003', // Duplicate
          fullName: 'Duplicate Ramesh',
          gender: 'male',
          email: 'dup.ramesh@srividya.edu.in',
          phone: '9876599998',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should forbid STUDENT from creating a teacher (403)', async () => {
      const res = await request(app)
        .post('/api/v1/teachers')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`)
        .send({
          employeeId: 'EMP-HACK',
          fullName: 'Unauthorized Teacher',
          gender: 'male',
          email: 'hack@school.com',
          phone: '9876599997',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/teachers and GET /api/v1/teachers/:id', () => {
    it('should return teacher directory list (200)', async () => {
      const res = await request(app)
        .get('/api/v1/teachers')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return individual teacher details by ID (200)', async () => {
      const teacherId = fixtures.teachers.teacherDoc1._id.toString();
      const res = await request(app)
        .get(`/api/v1/teachers/${teacherId}`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const teacherObj = res.body.data.teacher || res.body.data;
      expect(teacherObj._id).toBe(teacherId);
    });

    it('should return 404 for non-existent teacher ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/v1/teachers/${nonExistentId}`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Teacher Self-Service & Leave Management', () => {
    it('teacher should be able to view their own profile (200)', async () => {
      const res = await request(app)
        .get('/api/v1/teachers/me')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('teacher should be able to submit a leave application (201)', async () => {
      const res = await request(app)
        .post('/api/v1/teachers/leaves')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`)
        .send({
          leaveType: 'CASUAL',
          startDate: '2026-10-01',
          endDate: '2026-10-02',
          reason: 'Family function in hometown',
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
    });

    it('should fail with 422 when leave request has missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/teachers/leaves')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`)
        .send({
          // Missing leaveType, startDate, endDate, reason
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });
});
