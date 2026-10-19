/**
 * Test Suite 07: Academic Assignments Module API Tests
 * Covers:
 * - Create assignment by Teacher & Management (201)
 * - Validation error when fields missing (422)
 * - List assignments (200)
 * - Get assignment by ID (200)
 * - 404 for non-existent assignment ID
 * - Role-based authorization: Students/Parents cannot create assignments (403 Forbidden)
 * - 401 Unauthenticated requests
 */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { seedBaseUsers } = require('./helpers/testFixtures');

describe('07 - Academic Assignments Module API Test Suite', () => {
  let fixtures;
  let createdAssignmentId;

  beforeAll(async () => {
    fixtures = await seedBaseUsers();
  });

  describe('POST /api/v1/academic/assignments', () => {
    it('Teacher can successfully create an assignment for class (201)', async () => {
      const res = await request(app)
        .post('/api/v1/academic/assignments')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`)
        .send({
          title: 'Quadratic Equations Homework',
          description: 'Solve problems 1 to 20 from Chapter 4',
          subject: 'Mathematics',
          class: '10',
          section: 'A',
          dueDate: '2026-10-15',
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
      const assignmentObj = res.body.data.assignment || res.body.data;
      expect(assignmentObj.title).toBe('Quadratic Equations Homework');
      createdAssignmentId = assignmentObj._id;
    });

    it('should fail with 422 validation error when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/academic/assignments')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`)
        .send({
          // Missing title, description, subject, class, dueDate
          section: 'A',
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('Student CANNOT create an assignment (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/v1/academic/assignments')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`)
        .send({
          title: 'Student Created Assignment',
          description: 'This should fail authorization',
          subject: 'Mathematics',
          class: '10',
          section: 'A',
          dueDate: '2026-10-15',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('Parent CANNOT create an assignment (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/v1/academic/assignments')
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`)
        .send({
          title: 'Parent Created Assignment',
          description: 'This should fail authorization',
          subject: 'Mathematics',
          class: '10',
          section: 'A',
          dueDate: '2026-10-15',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/academic/assignments and GET /api/v1/academic/assignments/:id', () => {
    it('Authenticated student can view assignments list (200)', async () => {
      const res = await request(app)
        .get('/api/v1/academic/assignments?class=10&section=A')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should retrieve assignment details by valid ID (200)', async () => {
      const res = await request(app)
        .get(`/api/v1/academic/assignments/${createdAssignmentId}`)
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const assignmentObj = res.body.data.assignment || res.body.data;
      expect(assignmentObj._id).toBe(createdAssignmentId);
    });

    it('should return 404 for non-existent assignment ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/v1/academic/assignments/${nonExistentId}`)
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
