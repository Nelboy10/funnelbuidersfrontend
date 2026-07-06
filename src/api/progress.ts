// ============================================================
// Funnel Builders — User Progress API Endpoints
// ============================================================

import apiClient from './client';
import type { UserProgress, UserProgressPayload } from '../types';

export async function getProgress(courseId: number): Promise<UserProgress> {
  const { data } = await apiClient.get<UserProgress>('courses/progress/', {
    params: { course: courseId },
  });
  return data;
}

export async function updateProgress(payload: UserProgressPayload): Promise<UserProgress> {
  const { data } = await apiClient.put<UserProgress>('courses/progress/', payload);
  return data;
}
