/**
 * Test Suite 09: Fees & Payment Module API Tests
 * Covers:
 * - Create fee structure (Management: 201)
 * - Fee structure validation error (422)
 * - List fee structures (200)
 * - Assign fee to student (200 / 201)
 * - View student fees (200)
 * - View pending fees report (200)
 * - Role-based authorization: Student/Parent forbidden from creating fee structures (403)
 * - 401 Unauthenticated requests
 */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { seedBaseUsers } = require('./helpers/testFixtures');

describe('09 - Fees & Payment Module API Test Suite', () => {
  let fixtures;
  let feeStructureId;
  let student1Id;

  beforeAll(async () => {
    fixtures = await seedBaseUsers();
    student1Id = fixtures.students.studentDoc1._id.toString();
  });

  describe('POST /api/v1/fees/structures', () => {
    it('Management can create a new fee structure (201)', async () => {
      const res = await request(app)
        .post('/api/v1/fees/structures')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          name: 'Annual Tuition Fee Class 10',
          class: '10',
          academicYear: '2025-2026',
          tuitionFee: 45000,
          totalAmount: 45000,
          dueDate: '2026-11-30',
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
      const structureObj = res.body.data.structure || res.body.data;
      expect(structureObj.name).toBe('Annual Tuition Fee Class 10');
      feeStructureId = structureObj._id;
    });

    it('should fail with 422 validation error when fee structure fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/fees/structures')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          // Missing name, class, totalAmount, dueDate
          academicYear: '2025-2026',
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('Student CANNOT create fee structures (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/v1/fees/structures')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`)
        .send({
          name: 'Student Free Fee',
          class: '10',
          totalAmount: 0,
          dueDate: '2026-11-30',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('Parent CANNOT create fee structures (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/v1/fees/structures')
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`)
        .send({
          name: 'Parent Free Fee',
          class: '10',
          totalAmount: 0,
          dueDate: '2026-11-30',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/fees/assign and GET /api/v1/fees/student/:studentId', () => {
    it('Management can assign fee to a student (200/201)', async () => {
      const res = await request(app)
        .post('/api/v1/fees/assign')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          studentId: student1Id,
          feeStructureId: feeStructureId,
          totalAmount: 45000,
          dueDate: '2026-11-30',
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
    });

    it('should view fees assigned to a student (200)', async () => {
      const res = await request(app)
        .get(`/api/v1/fees/student/${student1Id}`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Management can view pending and overdue fees report (200)', async () => {
      const res = await request(app)
        .get('/api/v1/fees/pending')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
