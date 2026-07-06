// ============================================================
// Funnel Builders — TypeScript Type Definitions
// ============================================================

// ── User & Auth ──────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  role: UserRole;
  date_joined: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

export interface RegisterResponse {
  email: string;
  first_name: string;
  last_name: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface TokenRefreshPayload {
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
}

// ── Category ─────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
}

export interface CategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  image?: File | null;
}

// ── Video ────────────────────────────────────────────────────

export interface Video {
  id: number;
  title: string;
  description: string;
  video_file: string | null;
  youtube_url: string | null;
  thumbnail: string | null;
  duration: string | null;
  order: number;
  free_preview: boolean;
}

export interface VideoPayload {
  title: string;
  description?: string;
  video_file?: File;
  youtube_url?: string;
  thumbnail?: File | null;
  duration?: string;
  order?: number;
  free_preview?: boolean;
  module: number;
}

// ── Module ───────────────────────────────────────────────────

export interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  videos: Video[];
}

export interface ModulePayload {
  title: string;
  description?: string;
  order?: number;
  course: number;
}

// ── Course ───────────────────────────────────────────────────

export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type CourseStatus = 'DRAFT' | 'PUBLISHED';

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  price: string;
  category: number | null;
  total_duration: string | null;
  level: CourseLevel;
  status: CourseStatus;
  instructor: number | null;
  created_at: string;
  updated_at: string;
  modules: Module[];
}

export interface CoursePayload {
  title: string;
  slug?: string;
  description: string;
  thumbnail?: File | null;
  price?: string;
  category?: number | null;
  total_duration?: string;
  level?: CourseLevel;
  status?: CourseStatus;
}

// ── User Progress ────────────────────────────────────────────

export interface UserProgress {
  course: number;
  last_watched_video: number | null;
  position_in_seconds: number;
  progress_percentage: string;
  updated_at: string;
}

export interface UserProgressPayload {
  course: number;
  last_watched_video?: number | null;
  position_in_seconds?: number;
  progress_percentage?: string;
}

// ── Pagination ───────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── Course Filters ───────────────────────────────────────────

export interface CourseFilters {
  page?: number;
  category?: number;
  level?: CourseLevel;
  status?: CourseStatus;
  search?: string;
}

// ── API Error ────────────────────────────────────────────────

export interface ApiFieldErrors {
  [field: string]: string[];
}

export interface ApiDetailError {
  detail: string;
}

export type ApiError = ApiFieldErrors | ApiDetailError;
