/**
 * Sri Vidya E.M High School - Unified REST API Client
 * Reusable JavaScript API service connecting the frontend to Express.js / MERN backend.
 *
 * Capabilities:
 * 1. Base URL configuration with auto-detection fallback.
 * 2. Token management (localStorage & sessionStorage sync).
 * 3. Automatic JWT Authorization Bearer header injection.
 * 4. Silent token renewal on 401 Unauthorized / Token Expiration.
 * 5. Role-based & Object-Level 403 Forbidden interceptor.
 * 6. Centralized loading state dispatchers.
 * 7. Graceful offline / network error handling.
 * 8. Standardized API response unwrapping: { success, message, data, errors }.
 */
(function (global) {
  'use strict';

  const DEFAULT_API_BASE = 'http://localhost:5000/api/v1';

  // Storage Keys
  const STORAGE_ACCESS_TOKEN = 'sv_token_access';
  const STORAGE_REFRESH_TOKEN = 'sv_token_refresh';
  const STORAGE_USER = 'sv_user_profile';

  class ApiClientService {
    constructor() {
      this.baseUrl = (typeof window !== 'undefined' && window.API_BASE_URL) || DEFAULT_API_BASE;
      this.isRefreshing = false;
      this.failedQueue = [];
      this.activeRequestsCount = 0;
    }

    /* =========================================================================
     * TOKEN & CREDENTIAL MANAGEMENT
     * ========================================================================= */
    getAccessToken() {
      return localStorage.getItem(STORAGE_ACCESS_TOKEN) || sessionStorage.getItem(STORAGE_ACCESS_TOKEN) || null;
    }

    getRefreshToken() {
      return localStorage.getItem(STORAGE_REFRESH_TOKEN) || sessionStorage.getItem(STORAGE_REFRESH_TOKEN) || null;
    }

    getUser() {
      const u = localStorage.getItem(STORAGE_USER) || sessionStorage.getItem(STORAGE_USER);
      try {
        return u ? JSON.parse(u) : null;
      } catch (e) {
        return null;
      }
    }

    setSession(tokens, user, remember = true) {
      const storage = remember ? localStorage : sessionStorage;
      // Clear both first to avoid stale tokens in other storage
      localStorage.removeItem(STORAGE_ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_USER);
      sessionStorage.removeItem(STORAGE_ACCESS_TOKEN);
      sessionStorage.removeItem(STORAGE_REFRESH_TOKEN);
      sessionStorage.removeItem(STORAGE_USER);

      if (tokens && tokens.accessToken) {
        storage.setItem(STORAGE_ACCESS_TOKEN, tokens.accessToken);
      }
      if (tokens && tokens.refreshToken) {
        storage.setItem(STORAGE_REFRESH_TOKEN, tokens.refreshToken);
      }
      if (user) {
        storage.setItem(STORAGE_USER, JSON.stringify(user));
      }
    }

    updateAccessToken(newAccessToken) {
      if (localStorage.getItem(STORAGE_ACCESS_TOKEN)) {
        localStorage.setItem(STORAGE_ACCESS_TOKEN, newAccessToken);
      } else {
        sessionStorage.setItem(STORAGE_ACCESS_TOKEN, newAccessToken);
      }
    }

    updateTokens(tokens) {
      if (!tokens) return;
      if (tokens.accessToken) {
        if (localStorage.getItem(STORAGE_ACCESS_TOKEN)) {
          localStorage.setItem(STORAGE_ACCESS_TOKEN, tokens.accessToken);
        } else {
          sessionStorage.setItem(STORAGE_ACCESS_TOKEN, tokens.accessToken);
        }
      }
      if (tokens.refreshToken) {
        if (localStorage.getItem(STORAGE_REFRESH_TOKEN)) {
          localStorage.setItem(STORAGE_REFRESH_TOKEN, tokens.refreshToken);
        } else {
          sessionStorage.setItem(STORAGE_REFRESH_TOKEN, tokens.refreshToken);
        }
      }
    }

    clearSession() {
      localStorage.removeItem(STORAGE_ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_USER);
      sessionStorage.removeItem(STORAGE_ACCESS_TOKEN);
      sessionStorage.removeItem(STORAGE_REFRESH_TOKEN);
      sessionStorage.removeItem(STORAGE_USER);
    }

    isAuthenticated() {
      return !!this.getAccessToken();
    }

    /* =========================================================================
     * UI FEEDBACK & NOTIFICATION HELPERS
     * ========================================================================= */
    showToast(message, icon = 'fa-circle-check', isError = false) {
      if (typeof document === 'undefined') return;
      const existing = document.querySelector('.api-toast-banner');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.className = 'api-toast-banner';
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.right = '24px';
      toast.style.backgroundColor = isError ? '#DC2626' : '#15803D';
      toast.style.color = '#FFFFFF';
      toast.style.padding = '12px 20px';
      toast.style.borderRadius = '8px';
      toast.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.3)';
      toast.style.zIndex = '999999';
      toast.style.fontSize = '0.9rem';
      toast.style.fontWeight = '500';
      toast.style.display = 'flex';
      toast.style.alignItems = 'center';
      toast.style.gap = '10px';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

      toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }

    setLoading(isLoading) {
      if (isLoading) {
        this.activeRequestsCount++;
      } else {
        this.activeRequestsCount = Math.max(0, this.activeRequestsCount - 1);
      }

      if (typeof document === 'undefined') return;
      let spinner = document.getElementById('globalApiSpinner');
      if (this.activeRequestsCount > 0) {
        if (!spinner) {
          spinner = document.createElement('div');
          spinner.id = 'globalApiSpinner';
          spinner.style.position = 'fixed';
          spinner.style.top = '16px';
          spinner.style.right = '16px';
          spinner.style.zIndex = '999998';
          spinner.style.background = 'rgba(15, 23, 42, 0.85)';
          spinner.style.color = '#38BDF8';
          spinner.style.padding = '6px 12px';
          spinner.style.borderRadius = '20px';
          spinner.style.fontSize = '0.75rem';
          spinner.style.fontWeight = '600';
          spinner.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          spinner.style.display = 'flex';
          spinner.style.alignItems = 'center';
          spinner.style.gap = '8px';
          spinner.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Syncing...</span>';
          document.body.appendChild(spinner);
        }
      } else if (spinner) {
        spinner.remove();
      }
    }

    /* =========================================================================
     * CORE HTTP REQUEST WRAPPER WITH INTERCEPTORS
     * ========================================================================= */
    async request(endpoint, options = {}) {
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
      
      const headers = {
        'Accept': 'application/json',
        ...(options.headers || {}),
      };

      // Auto-set Content-Type if JSON payload
      if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(options.body);
      }

      // Attach Bearer Access Token
      const token = this.getAccessToken();
      if (token && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      options.headers = headers;

      this.setLoading(true);

      try {
        let res = await fetch(url, options);

        // 1. Handle 401 Unauthorized (Expired Token) -> Attempt Refresh
        if (res.status === 401 && !options._retry && this.getRefreshToken()) {
          options._retry = true;
          const refreshed = await this.silentRefreshToken();
          if (refreshed) {
            // Re-apply refreshed token and retry
            options.headers['Authorization'] = `Bearer ${this.getAccessToken()}`;
            res = await fetch(url, options);
          } else {
            this.handleSessionExpired();
            throw new Error('Your session has expired. Please sign in again.');
          }
        }

        // 2. Handle 403 Forbidden (RBAC / Object Level Access Violation)
        if (res.status === 403) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.message || 'Access denied: You are not authorized to view or edit this resource.';
          this.showToast(errMsg, 'fa-shield-halved', true);
          throw new Error(errMsg);
        }

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const errMsg = (data && data.message) || `Request failed with status ${res.status}`;
          throw new Error(errMsg);
        }

        return data;
      } catch (err) {
        // Network / Server connection errors
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          const offlineMsg = 'Unable to connect to school backend server. Please verify Express server is running on port 5000.';
          console.error('[ApiClient Network Error]:', err);
          this.showToast(offlineMsg, 'fa-network-wired', true);
          throw new Error(offlineMsg);
        }
        throw err;
      } finally {
        this.setLoading(false);
      }
    }

    async silentRefreshToken() {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return false;

      try {
        const res = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.data && data.data.tokens) {
          this.updateTokens(data.data.tokens);
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }

    handleSessionExpired() {
      this.clearSession();
      this.showToast('Session expired. Please sign in again.', 'fa-lock', true);
      // Reveal login overlay if present on the page
      const overlays = document.querySelectorAll('[id$="LoginOverlay"]');
      overlays.forEach((ov) => ov.classList.remove('hidden'));
    }

    /* =========================================================================
     * DOMAIN API SERVICES
     * ========================================================================= */

    // 1. Authentication Service
    get auth() {
      return {
        login: async (identifier, password, remember = true) => {
          const res = await this.request('/auth/login', {
            method: 'POST',
            body: { identifier, password },
          });
          if (res.success && res.data) {
            this.setSession(res.data.tokens, res.data.user, remember);
          }
          return res;
        },
        logout: async () => {
          try {
            await this.request('/auth/logout', { method: 'POST' });
          } catch (e) {
            // Ignore logout network errors
          } finally {
            this.clearSession();
          }
        },
        getMe: async () => {
          return await this.request('/auth/me');
        },
        changePassword: async (currentPassword, newPassword) => {
          return await this.request('/auth/change-password', {
            method: 'POST',
            body: { currentPassword, newPassword },
          });
        },
      };
    }

    // 2. Dashboard Service
    get dashboard() {
      return {
        getManagementDashboard: async () => {
          const res = await this.request('/dashboard/management');
          return res.data;
        },
        getTeacherDashboard: async (teacherId = null) => {
          const query = teacherId ? `?teacherId=${encodeURIComponent(teacherId)}` : '';
          const res = await this.request(`/dashboard/teacher${query}`);
          return res.data;
        },
        getStudentDashboard: async (studentId = null) => {
          const query = studentId ? `?studentId=${encodeURIComponent(studentId)}` : '';
          const res = await this.request(`/dashboard/student${query}`);
          return res.data;
        },
        getParentDashboard: async (childId = null) => {
          const query = childId ? `?childId=${encodeURIComponent(childId)}` : '';
          const res = await this.request(`/dashboard/parent${query}`);
          return res.data;
        },
      };
    }

    // 3. Students Service
    get students() {
      return {
        getStudents: async (params = {}) => {
          const q = new URLSearchParams(params).toString();
          return await this.request(`/students${q ? '?' + q : ''}`);
        },
        getStudent: async (id) => {
          return await this.request(`/students/${id}`);
        },
        createStudent: async (studentData) => {
          return await this.request('/students', {
            method: 'POST',
            body: studentData,
          });
        },
        updateStudent: async (id, studentData) => {
          return await this.request(`/students/${id}`, {
            method: 'PATCH',
            body: studentData,
          });
        },
        deleteStudent: async (id) => {
          return await this.request(`/students/${id}`, {
            method: 'DELETE',
          });
        },
      };
    }

    // 4. Teachers Service
    get teachers() {
      return {
        getTeachers: async (params = {}) => {
          const q = new URLSearchParams(params).toString();
          return await this.request(`/teachers${q ? '?' + q : ''}`);
        },
        getTeacher: async (id) => {
          return await this.request(`/teachers/${id}`);
        },
        updateTeacher: async (id, data) => {
          return await this.request(`/teachers/${id}`, {
            method: 'PATCH',
            body: data,
          });
        },
        applyLeave: async (leaveData) => {
          return await this.request('/teachers/leaves', {
            method: 'POST',
            body: leaveData,
          });
        },
      };
    }

    // 5. Parents Service
    get parents() {
      return {
        getProfile: async () => {
          return await this.request('/parents/profile');
        },
        getChildren: async () => {
          return await this.request('/parents/children');
        },
        getChildAttendance: async (childId, params = {}) => {
          const q = new URLSearchParams(params).toString();
          return await this.request(`/parents/children/${childId}/attendance${q ? '?' + q : ''}`);
        },
        getChildAssignments: async (childId) => {
          return await this.request(`/parents/children/${childId}/assignments`);
        },
        getChildExams: async (childId) => {
          return await this.request(`/parents/children/${childId}/exams`);
        },
        getChildFees: async (childId) => {
          return await this.request(`/parents/children/${childId}/fees`);
        },
      };
    }

    // 6. Attendance Service
    get attendance() {
      return {
        markAttendance: async (attendanceData) => {
          return await this.request('/attendance', {
            method: 'POST',
            body: attendanceData,
          });
        },
        getAttendanceReport: async (params = {}) => {
          const q = new URLSearchParams(params).toString();
          return await this.request(`/attendance/report${q ? '?' + q : ''}`);
        },
        getStudentAttendance: async (studentId, params = {}) => {
          const q = new URLSearchParams(params).toString();
          return await this.request(`/attendance/student/${studentId}${q ? '?' + q : ''}`);
        },
      };
    }

    // 7. Assignments Service
    get assignments() {
      return {
        getAssignments: async (params = {}) => {
          const q = new URLSearchParams(params).toString();
          return await this.request(`/academic/assignments${q ? '?' + q : ''}`);
        },
        createAssignment: async (data) => {
          return await this.request('/academic/assignments', {
            method: 'POST',
            body: data,
          });
        },
      };
    }

    // 8. Examinations Service
    get exams() {
      return {
        getExams: async (params = {}) => {
          const q = new URLSearchParams(params).toString();
          return await this.request(`/exams${q ? '?' + q : ''}`);
        },
        getExamSchedule: async (examId) => {
          return await this.request(`/exams/${examId}/schedules`);
        },
        getMarks: async (params = {}) => {
          const q = new URLSearchParams(params).toString();
          return await this.request(`/exams/marks${q ? '?' + q : ''}`);
        },
        enterMarks: async (data) => {
          return await this.request('/exams/marks', {
            method: 'POST',
            body: data,
          });
        },
        getStudentResults: async (studentId) => {
          return await this.request(`/exams/results/student/${studentId}`);
        },
      };
    }

    // 9. Fee & Payment Service
    get fees() {
      return {
        getStructures: async (params = {}) => {
          const q = new URLSearchParams(params).toString();
          return await this.request(`/fees/structures${q ? '?' + q : ''}`);
        },
        getPendingFees: async (params = {}) => {
          const q = new URLSearchParams(params).toString();
          return await this.request(`/fees/pending${q ? '?' + q : ''}`);
        },
        getStudentFee: async (studentId) => {
          return await this.request(`/fees/student/${studentId}`);
        },
        createPaymentOrder: async (data) => {
          return await this.request('/payments/create', {
            method: 'POST',
            body: data,
          });
        },
        verifyPayment: async (data) => {
          return await this.request('/payments/verify', {
            method: 'POST',
            body: data,
          });
        },
      };
    }

    // 10. Admissions Service
    get admissions() {
      return {
        submitApplication: async (applicationData) => {
          return await this.request('/admissions/apply', {
            method: 'POST',
            body: applicationData,
          });
        },
        checkStatus: async (applicationNumber, phone) => {
          const q = new URLSearchParams({ applicationNumber, phone }).toString();
          return await this.request(`/admissions/status?${q}`);
        },
        uploadDocument: async (admissionId, docData) => {
          return await this.request(`/admissions/${admissionId}/documents`, {
            method: 'POST',
            body: docData,
          });
        },
        getApplications: async (params = {}) => {
          const q = new URLSearchParams(params).toString();
          return await this.request(`/admissions${q ? '?' + q : ''}`);
        },
        getApplicationById: async (id) => {
          return await this.request(`/admissions/${id}`);
        },
        updateStatus: async (id, statusData) => {
          return await this.request(`/admissions/${id}/status`, {
            method: 'PATCH',
            body: statusData,
          });
        },
        enrollApplicant: async (id, enrollData = {}) => {
          return await this.request(`/admissions/${id}/enroll`, {
            method: 'POST',
            body: enrollData,
          });
        },
      };
    }

    // 11. Notifications Service
    get notifications() {
      return {
        getNotifications: async (params = {}) => {
          const q = new URLSearchParams(params).toString();
          return await this.request(`/management/notifications${q ? '?' + q : ''}`);
        },
        createNotification: async (data) => {
          return await this.request('/management/notifications', {
            method: 'POST',
            body: data,
          });
        },
        markRead: async (id) => {
          return await this.request(`/management/notifications/${id}/read`, {
            method: 'PATCH',
          });
        },
      };
    }

    // 12. Messages & Communication Service
    get messages() {
      return {
        sendMessage: async (data) => {
          return await this.request('/management/messages', {
            method: 'POST',
            body: data,
          });
        },
        getMessages: async (params = {}) => {
          const q = new URLSearchParams(params).toString();
          return await this.request(`/management/messages${q ? '?' + q : ''}`);
        },
      };
    }
  }

  // Export singleton instance
  const ApiClient = new ApiClientService();
  global.ApiClient = ApiClient;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiClient;
  }
})(typeof window !== 'undefined' ? window : this);
