// src/hooks/useAuth.ts
import { useState, useCallback } from 'react';
import { apiFetch } from '../services/api';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  xp: number;
  streak: number;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMe = useCallback(async (): Promise<AuthUser | null> => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    setLoading(true);
    try {
      const res = await apiFetch<{ data: AuthUser }>('/api/auth/me', undefined, { auth: true });
      setUser(res.data);
      return res.data;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    // Best-effort server logout
    if (refreshToken) {
      apiFetch('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }, { auth: true }).catch(() => {});
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setUser(null);
  }, []);

  const isAuthenticated = !!localStorage.getItem('accessToken');

  return { user, loading, fetchMe, logout, isAuthenticated };
}
