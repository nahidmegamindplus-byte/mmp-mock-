// API Service wrapper

const BASE_URL = '/api';

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

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.error || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
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
