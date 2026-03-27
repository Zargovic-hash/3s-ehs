import axios from 'axios';

// Axios instance
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── JWT interceptor ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── 401 interceptor ──
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ════════════════════════════════════════
//  Auth Service
// ════════════════════════════════════════
export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    // ✅ Stocker le token et l'utilisateur dans localStorage
    if (res.data.token) localStorage.setItem('token', res.data.token);
    if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },
  resetPassword: async (token, newPassword) => {
    const res = await api.post('/auth/reset-password', { token, newPassword });
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get('/auth/profile');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/auth/profile', data);
    return res.data;
  },
  changePassword: async (data) => {
    const res = await api.put('/auth/change-password', data);
    return res.data;
  },
  // ✅ FIX: logout() était appelé dans AuthContext mais n'existait pas
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// ════════════════════════════════════════
//  Document Service
// ════════════════════════════════════════
export const documentService = {
  getDocuments: async () => {
    const res = await api.get('/documents');
    return res.data;
  },
  uploadDocument: async (formData) => {
    const res = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getClientDocuments: async (clientId) => {
    const res = await api.get(`/documents/client/${clientId}`);
    return res.data;
  },
  downloadDocument: async (documentId) => {
    const res = await api.get(`/documents/download/${documentId}`, { responseType: 'blob' });
    return res;
  },
  deleteDocument: async (documentId) => {
    const res = await api.delete(`/documents/${documentId}`);
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/documents/stats');
    return res.data;
  },
};

// ════════════════════════════════════════
//  Article Service
// ════════════════════════════════════════
export const articleService = {
  getArticles: async (params = {}) => {
    const res = await api.get('/articles', { params });
    return res.data;
  },
  getArticle: async (id) => {
    const res = await api.get(`/articles/${id}`);
    return res.data;
  },
  createArticle: async (data) => {
    const res = await api.post('/articles', data);
    return res.data;
  },
  updateArticle: async (id, data) => {
    const res = await api.put(`/articles/${id}`, data);
    return res.data;
  },
  deleteArticle: async (id) => {
    const res = await api.delete(`/articles/${id}`);
    return res.data;
  },
  getCategories: async () => {
    const res = await api.get('/articles/categories');
    return res.data;
  },
  getTags: async () => {
    const res = await api.get('/articles/tags');
    return res.data;
  },
};

// ════════════════════════════════════════
//  Contact Service
// ════════════════════════════════════════
export const contactService = {
  sendContactForm: async (data) => {
    const res = await api.post('/contact', data);
    return res.data;
  },
  getContacts: async () => {
    const res = await api.get('/contact');
    return res.data;
  },
  getContact: async (id) => {
    const res = await api.get(`/contact/${id}`);
    return res.data;
  },
  updateStatus: async (id, statut) => {
    const res = await api.put(`/contact/${id}/status`, { statut });
    return res.data;
  },
  deleteContact: async (id) => {
    const res = await api.delete(`/contact/${id}`);
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/contact/stats');
    return res.data;
  },
};

// ════════════════════════════════════════
//  User Service
// ════════════════════════════════════════
export const userService = {
  getUsers: async () => {
    const res = await api.get('/users');
    return res.data;
  },
  getUser: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },
  updateUser: async (id, data) => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
  resetPassword: async (id, password) => {
    const res = await api.post(`/users/${id}/reset-password`, { newPassword: password });
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/users/stats');
    return res.data;
  },
};

export default api;