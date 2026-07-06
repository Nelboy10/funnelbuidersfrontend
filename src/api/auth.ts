// ============================================================
// Funnel Builders — Auth API Endpoints
// ============================================================

import apiClient, { setTokens, clearTokens } from './client';
import type {
  User,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  ChangePasswordPayload,
} from '../types';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('accounts/login/', payload);
  setTokens(data.access, data.refresh);
  return data;
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>('accounts/register/', payload);
  return data;
}

export async function getProfile(): Promise<User> {
  const { data } = await apiClient.get<User>('accounts/profile/');
  return data;
}

export async function updateProfile(payload: Partial<Pick<User, 'first_name' | 'last_name'>>): Promise<User> {
  const { data } = await apiClient.patch<User>('accounts/profile/', payload);
  return data;
}

export async function uploadProfilePicture(file: File): Promise<User> {
  const formData = new FormData();
  formData.append('profile_picture', file);
  const { data } = await apiClient.patch<User>('accounts/profile/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<{ detail: string }> {
  const { data } = await apiClient.put<{ detail: string }>('accounts/change-password/', payload);
  return data;
}

export function logout(): void {
  clearTokens();
}
