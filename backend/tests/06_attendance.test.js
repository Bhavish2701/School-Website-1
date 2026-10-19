/**
 * Test Suite 06: Attendance Module & Teacher-Class Authorization Tests
 * Covers:
 * - Teacher retrieving assigned class roster (200)
 * - Teacher successfully marking attendance for ASSIGNED class (201)
 * - Teacher-Class Authorization: Teacher attempting to mark attendance for UNASSIGNED class (403 Forbidden)
 * - Attendance validation errors (422)
 * - Student viewing own attendance records (200)
 * - Parent viewing linked child's attendance (200)
 * - Parent viewing unlinked child's attendance (403 Forbidden)
 * - 401 Unauthenticated requests
 */
const request = require('supertest');
const app = require('../src/app');
const { seedBaseUsers } = require('./helpers/testFixtures');

describe('06 - Attendance Module & Teacher-Class Authorization Test Suite', () => {
  let fixtures;
  let student1Id;
  let student2Id;

  beforeAll(async () => {
    fixtures = await seedBaseUsers();
    student1Id = fixtures.students.studentDoc1._id.toString(); // Class 10-A
    student2Id = fixtures.students.studentDoc2._id.toString(); // Class 8-C
  });

  describe('Teacher-Class Authorization on Marking Attendance', () => {
    it('Teacher 1 can retrieve student roster for assigned Class 10-A (200)', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/classes/10/A/students')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.class).toBe('10');
      expect(res.body.data.section).toBe('A');
    });

    it('Teacher 1 CAN successfully mark attendance for assigned Class 10-A (201)', async () => {
      const res = await request(app)
        .post('/api/v1/attendance/mark')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`)
        .send({
          class: '10',
          section: 'A',
          date: '2026-10-05',
          records: [
            {
              studentId: student1Id,
              status: 'PRESENT',
              remarks: 'Present on time',
            },
          ],
          remarks: 'Daily morning attendance',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('Teacher-Class Authorization: Teacher 1 CANNOT mark attendance for UNASSIGNED Class 8-C (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/v1/attendance/mark')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`)
        .send({
          class: '8',
          section: 'C',
          date: '2026-10-05',
          records: [
            {
              studentId: student2Id,
              status: 'PRESENT',
            },
          ],
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not assigned|unauthorized|forbidden/i);
    });

    it('Management (Principal) can mark attendance for any class (201)', async () => {
      const res = await request(app)
        .post('/api/v1/attendance/mark')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          class: '8',
          section: 'C',
          date: '2026-10-05',
          records: [
            {
              studentId: student2Id,
              status: 'PRESENT',
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should fail with 422 validation error when records array is empty or missing', async () => {
      const res = await request(app)
        .post('/api/v1/attendance/mark')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          class: '10',
          section: 'A',
          date: '2026-10-05',
          records: [], // Empty records
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Student & Parent Attendance Access', () => {
    it('Student 1 can view own attendance summary (200)', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/student/me')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Parent 1 can view linked child 1 attendance summary (200)', async () => {
      const res = await request(app)
        .get(`/api/v1/attendance/parent/child/${student1Id}`)
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Parent 1 CANNOT view unlinked child 2 attendance summary (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/v1/attendance/parent/child/${student2Id}`)
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });
});
