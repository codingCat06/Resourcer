import axios from 'axios';
import { User, Post, SearchQuery } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string, fullName?: string) => {
    const response = await api.post('/auth/register', { username, email, password, fullName });
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// Posts API
export const postsAPI = {
  getAllPosts: async () => {
    const response = await api.get('/posts');
    return response.data;
  },

  getPostById: async (id: number) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (postData: Partial<Post>) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  updatePost: async (id: number, postData: Partial<Post>) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id: number) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  trackClick: async (postId: number) => {
    const response = await api.post(`/posts/${postId}/click`);
    return response.data;
  },
};

// Search API
export const searchAPI = {
  search: async (searchQuery: SearchQuery) => {
    const response = await api.post('/search', searchQuery);
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  getUserPosts: async () => {
    const response = await api.get('/user/posts');
    return response.data;
  },

  getUserEarnings: async () => {
    const response = await api.get('/user/earnings');
    return response.data;
  },
};

// Contact API
export const contactAPI = {
  submitContact: async (contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    const response = await api.post('/contact/submit', contactData);
    return response.data;
  },

  getContacts: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/contact/admin/list', { params });
    return response.data;
  },

  getContact: async (id: number) => {
    const response = await api.get(`/contact/admin/${id}`);
    return response.data;
  },

  updateContact: async (id: number, data: {
    status: string;
    admin_notes?: string;
  }) => {
    const response = await api.put(`/contact/admin/${id}`, data);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  processEarnings: async () => {
    const response = await api.post('/admin/process-earnings');
    return response.data;
  },

  getUsers: async (params?: {
    subscription_type?: string;
    is_active?: boolean;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getAllPosts: async (params?: {
    status?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/admin/posts', { params });
    return response.data;
  },

  updatePostStatus: async (id: number, status: string) => {
    const response = await api.put(`/admin/posts/${id}/status`, { status });
    return response.data;
  },

  deletePost: async (id: number) => {
    const response = await api.delete(`/admin/posts/${id}`);
    return response.data;
  },

  updateUserSubscription: async (id: number, subscription_type: string) => {
    const response = await api.put(`/admin/users/${id}/subscription`, { subscription_type });
    return response.data;
  },

  updateUserStatus: async (id: number, is_active: boolean) => {
    const response = await api.put(`/admin/users/${id}/status`, { is_active });
    return response.data;
  },

  updateUserAdminStatus: async (id: number, is_admin: boolean) => {
    const response = await api.put(`/admin/users/${id}/admin`, { is_admin });
    return response.data;
  },
};

export default api;