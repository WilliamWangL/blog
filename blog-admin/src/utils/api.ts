import axios from 'axios'
import type { ApiResponse, PageResult, Article, Category, User, LoginCredentials, AuthResponse } from '@/types'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', credentials),

  logout: () => {
    localStorage.removeItem('token')
  },
}

export const articleApi = {
  getArticles: (page = 1, size = 10) =>
    api.get<ApiResponse<PageResult<Article>>>('/admin/articles', {
      params: { page, size },
    }),

  getArticle: (id: number) =>
    api.get<ApiResponse<Article>>(`/admin/articles/${id}`),

  createArticle: (data: Partial<Article>) =>
    api.post<ApiResponse<Article>>('/admin/articles', data),

  updateArticle: (id: number, data: Partial<Article>) =>
    api.put<ApiResponse<Article>>(`/admin/articles/${id}`, data),

  deleteArticle: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/articles/${id}`),
}

export const categoryApi = {
  getCategories: () =>
    api.get<ApiResponse<Category[]>>('/admin/categories'),

  createCategory: (data: Partial<Category>) =>
    api.post<ApiResponse<Category>>('/admin/categories', data),

  updateCategory: (id: number, data: Partial<Category>) =>
    api.put<ApiResponse<Category>>(`/admin/categories/${id}`, data),

  deleteCategory: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/categories/${id}`),
}

export const userApi = {
  getUsers: (page = 1, size = 10) =>
    api.get<ApiResponse<PageResult<User>>>('/admin/users', {
      params: { page, size },
    }),

  createUser: (data: Partial<User>) =>
    api.post<ApiResponse<User>>('/admin/users', data),

  updateUser: (id: number, data: Partial<User>) =>
    api.put<ApiResponse<User>>(`/admin/users/${id}`, data),

  deleteUser: (id: number) =>
    api.delete<ApiResponse<void>>(`/admin/users/${id}`),
}

export default api