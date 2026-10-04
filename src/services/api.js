// API Service wrapper with seamless server & offline / Vercel serverless fallback
import { handleLocalApi } from './localBackend.js';

const REMOTE_BASE_URL = import.meta.env?.VITE_API_URL || '/api';

export function getToken() {
  return localStorage.getItem('mmp_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('mmp_token', token);
  } else {
    localStorage.removeItem('mmp_token');
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  // 1. Try real server request first
  try {
    const res = await fetch(`${REMOTE_BASE_URL}${endpoint}`, config);

    // If server responds with JSON and not 404 HTML
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        // If it's a real 401/400 from backend, throw error properly
        if (res.status === 400 || res.status === 401 || res.status === 403) {
          const error = new Error(data.error || `Request failed with status ${res.status}`);
          error.status = res.status;
          error.data = data;
          throw error;
        }
        // If 404/500 on static hosting, trigger local backend fallback
        if (res.status === 404 || res.status >= 500) {
          console.warn(`[API Fallback] Server returned ${res.status}, switching to local engine: ${endpoint}`);
          return await handleLocalApi(endpoint, options);
        }
      }
      return data;
    } else {
      // Returned HTML (e.g. Vercel SPA rewrite fallback for /api)
      console.info(`[API Fallback] Non-JSON response received from ${endpoint}, using built-in local engine.`);
      return await handleLocalApi(endpoint, options);
    }
  } catch (err) {
    // If it's an explicit validation/auth error from a working API or thrown from handler, propagate if appropriate
    if (err.status === 401 && err.message === 'Invalid email or password') {
      throw err;
    }
    if (err.status === 400 && err.message.includes('already exists')) {
      throw err;
    }

    // Network error or offline / Vercel environment without Node backend:
    try {
      console.info(`[API Fallback] Server unreachable (${err.message}). Handling via local engine: ${endpoint}`);
      return await handleLocalApi(endpoint, options);
    } catch (localErr) {
      console.error(`[Local Backend Error] ${endpoint}:`, localErr);
      throw localErr;
    }
  }
}

export const api = {
  // Auth
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: userData }),
  getMe: () => apiRequest('/auth/me'),
  updateProfile: (profile) => apiRequest('/auth/profile', { method: 'PUT', body: profile }),
  changePassword: (passwords) => apiRequest('/auth/change-password', { method: 'POST', body: passwords }),
  forgotPassword: (email) => apiRequest('/auth/forgot-password', { method: 'POST', body: { email } }),
  getNotifications: () => apiRequest('/auth/notifications'),
  markNotificationsRead: () => apiRequest('/auth/notifications/read-all', { method: 'PUT' }),

  // Tests
  getTests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/tests?${query}`);
  },
  getTestDetail: (id) => apiRequest(`/tests/${id}`),
  getExamPayload: (id) => apiRequest(`/tests/${id}/exam-payload`),

  // Attempts
  startAttempt: (testId) => apiRequest('/attempts/start', { method: 'POST', body: { testId } }),
  saveProgress: (id, progress) => apiRequest(`/attempts/${id}/save-progress`, { method: 'POST', body: progress }),
  uploadSpeaking: (id, payload) => apiRequest(`/attempts/${id}/upload-speaking`, { method: 'POST', body: payload }),
  submitAttempt: (id, finalData) => apiRequest(`/attempts/${id}/submit`, { method: 'POST', body: finalData }),
  getResult: (id) => apiRequest(`/attempts/${id}/result`),
  getAnalysis: (id) => apiRequest(`/attempts/${id}/analysis`),
  getHistory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/attempts/history?${query}`);
  },
  getStudentStats: () => apiRequest('/attempts/student-stats'),

  // Admin
  getAdminStats: () => apiRequest('/admin/dashboard-stats'),
  getAdminTests: () => apiRequest('/admin/tests'),
  createAdminTest: (test) => apiRequest('/admin/tests', { method: 'POST', body: test }),
  updateAdminTest: (id, test) => apiRequest(`/admin/tests/${id}`, { method: 'PUT', body: test }),
  deleteAdminTest: (id) => apiRequest(`/admin/tests/${id}`, { method: 'DELETE' }),
  getAdminTestSections: (testId) => apiRequest(`/admin/tests/${testId}/sections`),
  saveQuestion: (question) => apiRequest('/admin/questions', { method: 'POST', body: question }),
  deleteQuestion: (id) => apiRequest(`/admin/questions/${id}`, { method: 'DELETE' }),
  savePassage: (passage) => apiRequest('/admin/passages', { method: 'POST', body: passage }),
  getStudents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/students?${query}`);
  },
  updateStudentStatus: (id, status) => apiRequest(`/admin/students/${id}/status`, { method: 'PUT', body: { status } }),
  resetStudentPassword: (id, newPassword) => apiRequest(`/admin/students/${id}/reset-password`, { method: 'POST', body: { newPassword } }),
  getPendingEvaluations: () => apiRequest('/admin/evaluations/pending'),
  submitEvaluation: (evalData) => apiRequest('/admin/evaluations/submit', { method: 'POST', body: evalData }),
  getAdminAttempts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/attempts?${query}`);
  },
  overrideScores: (id, scores) => apiRequest(`/admin/attempts/${id}/override-scores`, { method: 'PUT', body: scores }),
  getSettings: () => apiRequest('/admin/settings'),
  saveSettings: (settings) => apiRequest('/admin/settings', { method: 'PUT', body: { settings } })
};
