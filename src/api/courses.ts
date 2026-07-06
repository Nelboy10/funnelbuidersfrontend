// ============================================================
// Funnel Builders — Courses, Modules & Videos API Endpoints
// ============================================================

import apiClient from './client';
import type {
  Course,
  CoursePayload,
  CourseFilters,
  Module,
  ModulePayload,
  Video,
  VideoPayload,
  PaginatedResponse,
} from '../types';

// ── Courses ──────────────────────────────────────────────────

export async function getCourses(filters?: CourseFilters): Promise<PaginatedResponse<Course>> {
  const params: Record<string, string | number> = {};
  if (filters?.page) params.page = filters.page;
  if (filters?.category) params.category = filters.category;
  if (filters?.level) params.level = filters.level;
  if (filters?.status) params.status = filters.status;
  if (filters?.search) params.search = filters.search;

  const { data } = await apiClient.get<PaginatedResponse<Course>>('courses/', { params });
  return data;
}

export async function getCourse(slug: string): Promise<Course> {
  const { data } = await apiClient.get<Course>(`courses/${slug}/`);
  return data;
}

export async function createCourse(payload: CoursePayload): Promise<Course> {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('description', payload.description);
  if (payload.slug) formData.append('slug', payload.slug);
  if (payload.price) formData.append('price', payload.price);
  if (payload.category !== undefined) formData.append('category', payload.category === null ? '' : String(payload.category));
  if (payload.total_duration) formData.append('total_duration', payload.total_duration);
  if (payload.level) formData.append('level', payload.level);
  if (payload.status) formData.append('status', payload.status);
  if (payload.thumbnail) formData.append('thumbnail', payload.thumbnail);

  const { data } = await apiClient.post<Course>('courses/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateCourse(slug: string, payload: Partial<CoursePayload>): Promise<Course> {
  const formData = new FormData();
  if (payload.title !== undefined) formData.append('title', payload.title);
  if (payload.description !== undefined) formData.append('description', payload.description);
  if (payload.slug !== undefined) formData.append('slug', payload.slug);
  if (payload.price !== undefined) formData.append('price', payload.price);
  if (payload.category !== undefined) formData.append('category', payload.category === null ? '' : String(payload.category));
  if (payload.total_duration !== undefined) formData.append('total_duration', payload.total_duration);
  if (payload.level !== undefined) formData.append('level', payload.level);
  if (payload.status !== undefined) formData.append('status', payload.status);
  if (payload.thumbnail !== undefined && payload.thumbnail !== null) {
    formData.append('thumbnail', payload.thumbnail);
  }

  const { data } = await apiClient.patch<Course>(`courses/${slug}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteCourse(slug: string): Promise<void> {
  await apiClient.delete(`courses/${slug}/`);
}

// ── Modules ──────────────────────────────────────────────────

export async function getModules(courseId?: number, page?: number): Promise<PaginatedResponse<Module>> {
  const params: Record<string, string | number> = {};
  if (courseId) params.course = courseId;
  if (page) params.page = page;

  const { data } = await apiClient.get<PaginatedResponse<Module>>('courses/modules/', { params });
  return data;
}

export async function getModule(id: number): Promise<Module> {
  const { data } = await apiClient.get<Module>(`courses/modules/${id}/`);
  return data;
}

export async function createModule(payload: ModulePayload): Promise<Module> {
  const { data } = await apiClient.post<Module>('courses/modules/', payload);
  return data;
}

export async function updateModule(id: number, payload: Partial<ModulePayload>): Promise<Module> {
  const { data } = await apiClient.patch<Module>(`courses/modules/${id}/`, payload);
  return data;
}

export async function deleteModule(id: number): Promise<void> {
  await apiClient.delete(`courses/modules/${id}/`);
}

// ── Videos ───────────────────────────────────────────────────

export async function getVideos(moduleId?: number, page?: number): Promise<PaginatedResponse<Video>> {
  const params: Record<string, string | number> = {};
  if (moduleId) params.module = moduleId;
  if (page) params.page = page;

  const { data } = await apiClient.get<PaginatedResponse<Video>>('courses/videos/', { params });
  return data;
}

export async function getVideo(id: number): Promise<Video> {
  const { data } = await apiClient.get<Video>(`courses/videos/${id}/`);
  return data;
}

export async function createVideo(payload: VideoPayload): Promise<Video> {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('module', String(payload.module));
  if (payload.description) formData.append('description', payload.description);
  if (payload.video_file) formData.append('video_file', payload.video_file);
  if (payload.youtube_url !== undefined) formData.append('youtube_url', payload.youtube_url);
  if (payload.thumbnail) formData.append('thumbnail', payload.thumbnail);
  if (payload.duration) formData.append('duration', payload.duration);
  if (payload.order !== undefined) formData.append('order', String(payload.order));
  if (payload.free_preview !== undefined) formData.append('free_preview', String(payload.free_preview));

  const { data } = await apiClient.post<Video>('courses/videos/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateVideo(id: number, payload: Partial<VideoPayload>): Promise<Video> {
  const formData = new FormData();
  if (payload.title !== undefined) formData.append('title', payload.title);
  if (payload.module !== undefined) formData.append('module', String(payload.module));
  if (payload.description !== undefined) formData.append('description', payload.description);
  if (payload.video_file) formData.append('video_file', payload.video_file);
  if (payload.youtube_url !== undefined) formData.append('youtube_url', payload.youtube_url);
  if (payload.thumbnail !== undefined && payload.thumbnail !== null) {
    formData.append('thumbnail', payload.thumbnail);
  }
  if (payload.duration !== undefined) formData.append('duration', payload.duration);
  if (payload.order !== undefined) formData.append('order', String(payload.order));
  if (payload.free_preview !== undefined) formData.append('free_preview', String(payload.free_preview));

  const { data } = await apiClient.patch<Video>(`courses/videos/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteVideo(id: number): Promise<void> {
  await apiClient.delete(`courses/videos/${id}/`);
}
