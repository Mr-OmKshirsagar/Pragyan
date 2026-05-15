import { apiFetch } from './api';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  roadmapCount: number;
  skillCount: number;
  assessmentCount: number;
  resourceCount: number;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  xp: number;
  streak: number;
  createdAt: string;
  updatedAt: string;
}

export async function getAdminDashboard(): Promise<AdminStats> {
  const response = await apiFetch<{ data: AdminStats }>(
    '/api/admin/dashboard',
    undefined,
    { auth: true }
  );
  return response.data;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await apiFetch<{ data: AdminUser[] }>(
    '/api/admin/users',
    undefined,
    { auth: true }
  );
  return response.data ?? [];
}

export async function updateUserRole(userId: string, role: 'USER' | 'ADMIN'): Promise<AdminUser> {
  const response = await apiFetch<{ data: AdminUser }>(
    `/api/admin/users/${userId}/role`,
    {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    },
    { auth: true }
  );
  return response.data;
}

export async function getAssessmentAnalytics() {
  const response = await apiFetch<{ data: any[] }>(
    '/api/admin/assessments',
    undefined,
    { auth: true }
  );
  return response.data ?? [];
}

export async function getRoadmapStats() {
  const response = await apiFetch<{ data: any }>(
    '/api/admin/roadmaps',
    undefined,
    { auth: true }
  );
  return response.data;
}
