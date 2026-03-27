import axios from 'axios';

const getAuthStorage = () => {
  const mode = (import.meta.env.VITE_AUTH_STORAGE || 'local').toLowerCase();
  return mode === 'session' ? window.sessionStorage : window.localStorage;
};

// Axios instance
const api = axios.create({
  // In dev/proxy: '/api'. In production (frontend hosted separately), set VITE_API_BASE_URL to your backend URL.
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── JWT interceptor ──
api.interceptors.request.use((config) => {
  const token = getAuthStorage().getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── 401 interceptor ──
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const storage = getAuthStorage();
      storage.removeItem('token');
      storage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ════════════════════════════════════════
//  Auth Service
// ════════════════════════════════════════
export const authService = {
  _validateAuthPayload: (data) => {
    // If we got HTML or other non-JSON, it's almost always a wrong base URL.
    if (typeof data !== 'object' || data === null) {
      throw new Error(
        "Réponse inattendue (non-JSON). Vérifiez VITE_API_BASE_URL = https://threes-ehs-server.onrender.com/api"
      );
    }
    // If API returns a JSON error payload, surface it.
    if (typeof data.error === 'string' && !data.user) {
      throw new Error(data.error);
    }
    if (!data.user) {
      throw new Error('Réponse serveur invalide (utilisateur manquant).');
    }
    return data;
  },
  _persistAuth: (data) => {
    const storage = getAuthStorage();
    if (data.token) storage.setItem('token', data.token);
    storage.setItem('user', JSON.stringify(data.user));
  },
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const data = authService._validateAuthPayload(res.data);
    authService._persistAuth(data);
    return data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    const data = authService._validateAuthPayload(res.data);
    authService._persistAuth(data);
    return data;
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
    const storage = getAuthStorage();
    storage.removeItem('token');
    storage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = getAuthStorage().getItem('user');
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
  resetPassword: async (id, newPassword) => {
    const res = await api.post(`/users/${id}/reset-password`, { newPassword });
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/users/stats');
    return res.data;
  },
};

export default api;