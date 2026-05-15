const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const accessToken = data?.data?.accessToken;
  if (!accessToken) {
    return null;
  }

  localStorage.setItem('accessToken', accessToken);
  return accessToken;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  options?: { auth?: boolean; retryOnAuthFail?: boolean }
): Promise<T> {
  const auth = options?.auth ?? false;
  const retryOnAuthFail = options?.retryOnAuthFail ?? true;

  const headers = new Headers(init?.headers || {});
  headers.set('Content-Type', headers.get('Content-Type') || 'application/json');

  if (auth) {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401 && auth && retryOnAuthFail) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      return apiFetch<T>(path, init, { auth: true, retryOnAuthFail: false });
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.errors
      ? Object.values(data.errors).flat().join(', ')
      : data?.message || 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

export { API_BASE_URL };
