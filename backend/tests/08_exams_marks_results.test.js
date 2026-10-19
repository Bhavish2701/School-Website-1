/**
 * Test Suite 08: Exams, Marks & Results Module Tests
 * Covers:
 * - Create exam (Management: 201)
 * - Validation error when creating exam with missing fields (422)
 * - Create exam schedule (201)
 * - Teacher entering marks for ASSIGNED class & subject (200)
 * - Teacher-Class Authorization: Teacher entering marks for UNASSIGNED subject/class (403 Forbidden)
 * - Calculate exam results and publish (200)
 * - Student viewing published results (200)
 * - Parent viewing child results with Parent-Child Authorization (200 / 403)
 * - 404 for non-existent exam ID
 */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { seedBaseUsers } = require('./helpers/testFixtures');

describe('08 - Exams, Marks & Results Module Test Suite', () => {
  let fixtures;
  let examId;
  let student1Id;
  let student2Id;

  beforeAll(async () => {
    fixtures = await seedBaseUsers();
    student1Id = fixtures.students.studentDoc1._id.toString(); // Class 10-A
    student2Id = fixtures.students.studentDoc2._id.toString(); // Class 8-C
  });

  describe('POST /api/v1/exams (Exam Lifecycle)', () => {
    it('Management can create a new examination (201)', async () => {
      const res = await request(app)
        .post('/api/v1/exams')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          name: 'Mid-Term Examinations 2026',
          examType: 'MID_TERM',
          academicYear: '2025-2026',
          startDate: '2026-10-10',
          endDate: '2026-10-25',
          classes: ['10', '9', '8'],
          description: 'Official first term exams',
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
      expect(res.body.data.exam.name).toBe('Mid-Term Examinations 2026');
      examId = res.body.data.exam._id;
    });

    it('should fail with 422 validation error when exam fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/exams')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          // Missing name, startDate, endDate
          description: 'Incomplete exam payload',
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('Student CANNOT create an exam (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/v1/exams')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`)
        .send({
          name: 'Hacker Exam',
          startDate: '2026-10-10',
          endDate: '2026-10-20',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/exams/:id/schedule', () => {
    it('Management can schedule subject timetable for exam (201)', async () => {
      const res = await request(app)
        .post(`/api/v1/exams/${examId}/schedule`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          class: '10',
          subject: 'Mathematics',
          examDate: '2026-10-12',
          startTime: '09:30 AM',
          endTime: '12:30 PM',
          maxMarks: 100,
          passMarks: 35,
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Teacher-Class Authorization on Marks Entry', () => {
    it('Teacher 1 CAN enter marks for ASSIGNED Class 10-A Mathematics (200)', async () => {
      const res = await request(app)
        .post(`/api/v1/exams/${examId}/marks`)
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`)
        .send({
          class: '10',
          section: 'A',
          subject: 'Mathematics',
          marks: [
            {
              studentId: student1Id,
              marksObtained: 85,
              remarks: 'Excellent performance',
            },
          ],
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
    });

    it('Teacher-Class Authorization: Teacher 1 CANNOT enter marks for UNASSIGNED Class 8-C (403 Forbidden)', async () => {
      const res = await request(app)
        .post(`/api/v1/exams/${examId}/marks`)
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`)
        .send({
          class: '8',
          section: 'C',
          subject: 'Mathematics',
          marks: [
            {
              studentId: student2Id,
              marksObtained: 70,
            },
          ],
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/unauthorized|only permitted to enter or modify marks for your assigned classes/i);
    });

    it('Teacher-Class Authorization: Teacher 1 CANNOT enter marks for UNASSIGNED subject (Science) in 10-A (403 Forbidden)', async () => {
      const res = await request(app)
        .post(`/api/v1/exams/${examId}/marks`)
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`)
        .send({
          class: '10',
          section: 'A',
          subject: 'Science', // Teacher 1 only assigned to Mathematics
          marks: [
            {
              studentId: student1Id,
              marksObtained: 75,
            },
          ],
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Results Calculation, Publication & Secure Viewing', () => {
    it('Management can calculate exam results (200)', async () => {
      const res = await request(app)
        .post(`/api/v1/exams/${examId}/calculate-results?class=10&section=A`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Management can publish exam results (200)', async () => {
      const res = await request(app)
        .post(`/api/v1/exams/${examId}/publish`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Student 1 can view own published results (200)', async () => {
      const res = await request(app)
        .get('/api/v1/exams/student/me/results')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Parent 1 can view child 1 published results (200)', async () => {
      const res = await request(app)
        .get(`/api/v1/exams/parent/child/${student1Id}/results`)
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Parent 1 CANNOT view child 2 published results (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/v1/exams/parent/child/${student2Id}/results`)
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for non-existent exam ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/v1/exams/${nonExistentId}`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
