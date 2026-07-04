import api from './api'

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/users/profile'),
}

export const reportService = {
  upload: (formData, onUploadProgress) =>
    api.post('/reports/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),
  getAll: (params) => api.get('/reports', { params }),
  getById: (id) => api.get(`/reports/${id}`),
  getDashboard: () => api.get('/reports/dashboard'),
  delete: (id) => api.delete(`/reports/${id}`),
}

export const summaryService = {
  generate: (reportId) => api.post(`/summaries/generate/${reportId}`),
  getById: (id) => api.get(`/summaries/${id}`),
  getAll: (params) => api.get('/summaries', { params }),
  delete: (id) => api.delete(`/summaries/${id}`),
  downloadPdf: (id) =>
    api.get(`/summaries/${id}/download`, { responseType: 'blob' }),
}
