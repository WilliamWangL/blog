import axios from 'axios'
import type { ApiResponse, PageResult, Article, Category } from '@/types'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error)
  }
)

export const articleApi = {
  getArticles: (page = 1, size = 10, categoryId?: number) =>
    api.get<ApiResponse<PageResult<Article>>>('/articles', {
      params: { page, size, categoryId },
    }),

  getFeaturedArticles: (limit = 5) =>
    api.get<ApiResponse<Article[]>>(`/articles/featured?limit=${limit}`),

  getArticleBySlug: (slug: string) =>
    api.get<ApiResponse<Article>>(`/articles/${slug}`),

  searchArticles: (keyword: string, page = 1, size = 10) =>
    api.get<ApiResponse<PageResult<Article>>>('/articles/search', {
      params: { keyword, page, size },
    }),
}

export const categoryApi = {
  getCategories: () =>
    api.get<ApiResponse<Category[]>>('/categories'),

  getCategoryBySlug: (slug: string) =>
    api.get<ApiResponse<Category>>(`/categories/${slug}`),
}

export default api