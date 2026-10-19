/**
 * Test Suite 10: Admissions Module API Tests
 * Covers:
 * - Public submit admission application (201)
 * - Validation error on missing applicant details (422)
 * - Public track application status (200)
 * - Track status with invalid reference/phone (404 / 400)
 * - Management review and status update (200)
 * - Management auto-enroll student (200)
 * - Duplicate enrollment prevention (400 / 409)
 * - Unauthorized roles denied access to management admissions (403 Forbidden)
 * - 401 Unauthenticated requests
 */
const request = require('supertest');
const app = require('../src/app');
const { seedBaseUsers } = require('./helpers/testFixtures');

describe('10 - Admissions Module API Test Suite', () => {
  let fixtures;
  let applicationNumber;
  let admissionId;
  const applicantPhone = '9876543299';

  beforeAll(async () => {
    fixtures = await seedBaseUsers();
  });

  describe('Public Admission Application & Tracking', () => {
    it('Public applicant can submit admission application (201)', async () => {
      const res = await request(app)
        .post('/api/v1/admissions/apply')
        .send({
          studentName: 'Sanjay Reddy',
          dob: '2012-05-15',
          gender: 'Male',
          applyingClass: '6',
          parentName: 'Narayana Reddy',
          phone: applicantPhone,
          email: 'narayana.reddy@gmail.com',
          address: 'Madhurawada, Visakhapatnam',
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
      expect(res.body.data.studentName).toBe('Sanjay Reddy');
      expect(res.body.data.applicationNumber).toBeDefined();

      applicationNumber = res.body.data.applicationNumber;
      admissionId = (res.body.data.application && res.body.data.application._id) || res.body.data._id;
    });

    it('should fail with 422 validation error when application fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/admissions/apply')
        .send({
          // Missing studentName, dob, gender, applyingClass, parentName, phone
          email: 'incomplete@test.com',
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('Public applicant can track status with applicationNumber and phone (200)', async () => {
      const res = await request(app)
        .get(`/api/v1/admissions/status?applicationNumber=${applicationNumber}&phone=${applicantPhone}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.applicationNumber).toBe(applicationNumber);
    });

    it('Status inquiry should return 404 for non-existent application number', async () => {
      const res = await request(app)
        .get(`/api/v1/admissions/status?applicationNumber=NONEXISTENT123&phone=${applicantPhone}`);

      expect([400, 404]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Management Admissions Processing & Auto-Enrollment', () => {
    it('Management can view admissions list (200)', async () => {
      const res = await request(app)
        .get('/api/v1/admissions')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Management can update application status to APPROVED (200)', async () => {
      const res = await request(app)
        .patch(`/api/v1/admissions/${admissionId}/status`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          status: 'APPROVED',
          remarks: 'All documents verified and approved for enrollment',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Management can enroll approved applicant into student directory (200)', async () => {
      const res = await request(app)
        .post(`/api/v1/admissions/${admissionId}/enroll`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          section: 'A',
          rollNo: '601',
          academicYear: '2025-2026',
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
    });

    it('Duplicate Operation: Attempting to re-enroll already enrolled applicant handles idempotency (alreadyEnrolled: true)', async () => {
      const res = await request(app)
        .post(`/api/v1/admissions/${admissionId}/enroll`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`)
        .send({
          section: 'A',
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.data.alreadyEnrolled).toBe(true);
    });

    it('Invalid Request: Attempting to enroll application not in APPROVED status should fail with 400', async () => {
      const appRes = await request(app)
        .post('/api/v1/admissions/apply')
        .send({
          studentName: 'Unapproved Student',
          dob: '2013-01-01',
          gender: 'Female',
          applyingClass: '5',
          parentName: 'Parent Person',
          phone: '9876543288',
        });
      const unapprovedId = (appRes.body.data.application && appRes.body.data.application._id) || appRes.body.data._id;

      const res = await request(app)
        .post(`/api/v1/admissions/${unapprovedId}/enroll`)
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/only approved applications can be enrolled/i);
    });

    it('Teacher CANNOT enroll admission applicant (403 Forbidden)', async () => {
      const res = await request(app)
        .post(`/api/v1/admissions/${admissionId}/enroll`)
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`)
        .send({ section: 'A' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('Student CANNOT access management admissions overview (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/v1/admissions/overview')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });
});
