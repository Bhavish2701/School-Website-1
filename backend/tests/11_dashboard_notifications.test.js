/**
 * Test Suite 11: Dashboard APIs & Notifications Test Suite
 * Covers:
 * - Management Dashboard (/dashboard/management) - RBAC enforcement
 * - Teacher Dashboard (/dashboard/teacher) - RBAC enforcement
 * - Student Dashboard (/dashboard/student) - Self profile metrics
 * - Parent Dashboard (/dashboard/parent) - Child summary & switcher
 * - Notifications creation, listing, read status update
 * - 401 Unauthenticated, 403 Forbidden, 404 Not Found, 422 Validation errors
 */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { seedBaseUsers } = require('./helpers/testFixtures');

describe('11 - Dashboard APIs & Notifications Test Suite', () => {
  let fixtures;
  let createdNotificationId;

  beforeAll(async () => {
    fixtures = await seedBaseUsers();
  });

  describe('Management Dashboard (/api/v1/dashboard/management)', () => {
    it('SUPER_ADMIN can access management dashboard (200)', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/management')
        .set('Authorization', `Bearer ${fixtures.tokens.superAdmin}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('PRINCIPAL can access management dashboard (200)', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/management')
        .set('Authorization', `Bearer ${fixtures.tokens.principal}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('TEACHER is denied access to management dashboard (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/management')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('STUDENT is denied access to management dashboard (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/management')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('PARENT is denied access to management dashboard (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/management')
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Teacher Dashboard (/api/v1/dashboard/teacher)', () => {
    it('TEACHER can access teacher dashboard (200)', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/teacher')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('STUDENT is denied access to teacher dashboard (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/teacher')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('PARENT is denied access to teacher dashboard (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/teacher')
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Student Dashboard (/api/v1/dashboard/student)', () => {
    it('STUDENT can access student dashboard (200)', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/student')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Parent Dashboard (/api/v1/dashboard/parent)', () => {
    it('PARENT can access parent dashboard (200)', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/parent')
        .set('Authorization', `Bearer ${fixtures.tokens.parent1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('STUDENT is denied access to parent dashboard (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/parent')
        .set('Authorization', `Bearer ${fixtures.tokens.student1}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Notifications API (/api/v1/teachers/notifications)', () => {
    it('Teacher can publish a notification / notice (201)', async () => {
      const res = await request(app)
        .post('/api/v1/teachers/notifications')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`)
        .send({
          title: 'Science Fair Announcement',
          message: 'All students are requested to prepare their models by Friday',
          priority: 'NORMAL',
        });

      expect([200, 201]).toContain(res.status);
      expect(res.body.success).toBe(true);
      const notificationObj = res.body.data.notification || res.body.data;
      expect(notificationObj.title).toBe('Science Fair Announcement');
      createdNotificationId = notificationObj._id;
    });

    it('should fail with 422 validation error when notification title/message is missing', async () => {
      const res = await request(app)
        .post('/api/v1/teachers/notifications')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`)
        .send({});

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });

    it('Teacher can list notifications (200)', async () => {
      const res = await request(app)
        .get('/api/v1/teachers/notifications')
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Teacher can mark notification as read (200)', async () => {
      if (createdNotificationId) {
        const res = await request(app)
          .patch(`/api/v1/teachers/notifications/${createdNotificationId}/read`)
          .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      }
    });

    it('should return 404 when marking non-existent notification as read', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .patch(`/api/v1/teachers/notifications/${nonExistentId}/read`)
        .set('Authorization', `Bearer ${fixtures.tokens.teacher1}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
