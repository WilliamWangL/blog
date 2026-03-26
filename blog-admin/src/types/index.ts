export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  categoryId: number;
  authorId: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  rating: number;
  status: number;
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  parentId: number | null;
  sortOrder: number;
  status: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  nickname: string;
  avatar: string;
  bio: string;
  role: string;
  status: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}