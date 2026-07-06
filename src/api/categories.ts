// ============================================================
// Funnel Builders — Categories API Endpoints
// ============================================================

import apiClient from './client';
import type { Category, CategoryPayload, PaginatedResponse } from '../types';

export async function getCategories(page?: number): Promise<PaginatedResponse<Category>> {
  const params: Record<string, number> = {};
  if (page) params.page = page;

  const { data } = await apiClient.get<PaginatedResponse<Category>>('categories/', { params });
  return data;
}

export async function getCategory(slug: string): Promise<Category> {
  const { data } = await apiClient.get<Category>(`categories/${slug}/`);
  return data;
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const formData = new FormData();
  formData.append('name', payload.name);
  if (payload.slug) formData.append('slug', payload.slug);
  if (payload.description) formData.append('description', payload.description);
  if (payload.image) formData.append('image', payload.image);

  const { data } = await apiClient.post<Category>('categories/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateCategory(slug: string, payload: Partial<CategoryPayload>): Promise<Category> {
  const formData = new FormData();
  if (payload.name !== undefined) formData.append('name', payload.name);
  if (payload.slug !== undefined) formData.append('slug', payload.slug);
  if (payload.description !== undefined) formData.append('description', payload.description);
  if (payload.image !== undefined && payload.image !== null) {
    formData.append('image', payload.image);
  }

  const { data } = await apiClient.patch<Category>(`categories/${slug}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteCategory(slug: string): Promise<void> {
  await apiClient.delete(`categories/${slug}/`);
}
