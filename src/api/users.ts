// ============================================================
// Funnel Builders — Users API Endpoints (Admin)
// ============================================================

import apiClient from './client';
import type { User, PaginatedResponse } from '../types';

export interface UserFilters {
  page?: number;
  role?: string;
  search?: string;
}

export async function getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
  const params: Record<string, string | number> = {};
  if (filters?.page) params.page = filters.page;
  if (filters?.role) params.role = filters.role;
  if (filters?.search) params.search = filters.search;

  const { data } = await apiClient.get<PaginatedResponse<User>>('accounts/users/', { params });
  return data;
}

export async function getUser(id: number): Promise<User> {
  const { data } = await apiClient.get<User>(`accounts/users/${id}/`);
  return data;
}

export async function updateUser(id: number, payload: Partial<Pick<User, 'role' | 'first_name' | 'last_name'>>): Promise<User> {
  const { data } = await apiClient.patch<User>(`accounts/users/${id}/`, payload);
  return data;
}
