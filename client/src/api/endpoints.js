import api from './axios';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

export const batchApi = {
  list: (params) => api.get('/batches', { params }),
  get: (id) => api.get(`/batches/${id}`),
  create: (data) => api.post('/batches', data),
  update: (id, data) => api.put(`/batches/${id}`, data),
  updateStatus: (id, status) => api.patch(`/batches/${id}/status`, { status }),
  archive: (id) => api.delete(`/batches/${id}`),
};

export const enrollmentApi = {
  enroll: (data) => api.post('/enrollments', data),
  my: () => api.get('/enrollments/my'),
  batch: (batchId) => api.get(`/enrollments/batch/${batchId}`),
  remove: (id) => api.delete(`/enrollments/${id}`),
};

export const paymentApi = {
  createOrder: (enrollmentId) => api.post('/payments/create-order', { enrollmentId }),
  verify: (data) => api.post('/payments/verify', data),
  history: () => api.get('/payments/history'),
};

export const attendanceApi = {
  mark: (data) => api.post('/attendance', data),
  batch: (batchId) => api.get(`/attendance/batch/${batchId}`),
  my: () => api.get('/attendance/my'),
};

export const noticeApi = {
  create: (data) => api.post('/notices', data),
  list: (params) => api.get('/notices', { params }),
};

export const dashboardApi = {
  admin: () => api.get('/dashboard/admin'),
  teacher: () => api.get('/dashboard/teacher'),
  student: () => api.get('/dashboard/student'),
};

export const userApi = {
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  list: (params) => api.get('/users', { params }),
};