import { env } from '@/core/config/env';
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  storeSession,
  type StoredUser,
} from '@/core/services/tokenStorage';

const BASE = env.apiUrl.replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let refreshing: Promise<void> | null = null;

async function doRefresh(): Promise<void> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    await clearSession();
    return;
  }
  try {
    const res = await fetch(`${BASE}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) {
      await clearSession();
      return;
    }
    const { access_token, refresh_token } = (await res.json()) as {
      access_token: string;
      refresh_token: string;
    };
    const existingUser = await getStoredUser();
    if (!access_token || !refresh_token || !existingUser) {
      await clearSession();
      return;
    }
    await storeSession(access_token, refresh_token, existingUser);
  } catch {
    await clearSession();
  }
}

const API_TIMEOUT_MS = 15_000;

function withTimeout(signal?: AbortSignal): { signal: AbortSignal; clear: () => void } {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), API_TIMEOUT_MS);
  const clear = () => clearTimeout(tid);
  if (signal) signal.addEventListener('abort', () => ctrl.abort());
  return { signal: ctrl.signal, clear };
}

async function apiFetch<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
  auth = true,
  isRetry = false,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = await getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const { signal, clear } = withTimeout();
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (e) {
    clear();
    if (e instanceof Error && e.name === 'AbortError') {
      throw new ApiError(408, 'Request timed out — please check your connection and try again.');
    }
    throw e;
  }
  clear();

  if (res.status === 401 && auth && !isRetry) {
    if (!refreshing) refreshing = doRefresh().finally(() => { refreshing = null; });
    await refreshing;
    return apiFetch(method, path, body, auth, true);
  }

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const j = JSON.parse(text) as { error?: string; message?: string };
      message = j.error ?? j.message ?? text;
    } catch { /* keep raw text */ }
    throw new ApiError(res.status, message);
  }

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

async function apiFetchFormData<T = unknown>(
  method: string,
  path: string,
  formData: FormData,
  isRetry = false,
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = await getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const { signal, clear } = withTimeout();
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: formData, signal });
  } catch (e) {
    clear();
    if (e instanceof Error && e.name === 'AbortError') {
      throw new ApiError(408, 'Request timed out — please check your connection and try again.');
    }
    throw e;
  }
  clear();

  if (res.status === 401 && !isRetry) {
    if (!refreshing) refreshing = doRefresh().finally(() => { refreshing = null; });
    await refreshing;
    return apiFetchFormData(method, path, formData, true);
  }

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const j = JSON.parse(text) as { error?: string; message?: string };
      message = j.error ?? j.message ?? text;
    } catch { /* keep raw text */ }
    throw new ApiError(res.status, message);
  }

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

type ProfileData = { role: string; phone: string | null; push_token: string | null };
type ProfileResponse = { profile: ProfileData };
type CandidateResponse = { candidate: Record<string, unknown> | null };
type EmployerResponse = { employer: Record<string, unknown> | null };
type BrowseFiltersPayload = Record<string, unknown> & { page?: number };
type BrowseResponse = {
  candidates: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
};

export const api = {
  auth: {
    sendOtp: (phone: string) =>
      apiFetch<{ message: string }>('POST', '/api/v1/auth/send-otp', { phone }, false),

    verifyOtp: (phone: string, code: string) =>
      apiFetch<{ access_token: string; refresh_token: string; user: StoredUser }>(
        'POST', '/api/v1/auth/verify-otp', { phone, code }, false,
      ),

    logout: () => apiFetch<void>('POST', '/api/v1/auth/logout'),

    me: () => apiFetch<{ user: StoredUser }>('GET', '/api/v1/auth/me'),
  },

  profiles: {
    me: () => apiFetch<ProfileResponse | null>('GET', '/api/v1/profiles/me'),
    upsert: (data: { role: string; phone?: string | null }) =>
      apiFetch<ProfileResponse>('PUT', '/api/v1/profiles/me', data),
  },

  candidates: {
    me: () => apiFetch<CandidateResponse>('GET', '/api/v1/candidates/me'),
    create: (data: Record<string, unknown>) =>
      apiFetch<{ candidate: Record<string, unknown> }>('POST', '/api/v1/candidates', data),
    update: (data: Record<string, unknown>) =>
      apiFetch<{ candidate: Record<string, unknown> }>('PUT', '/api/v1/candidates/me', data),
    getById: (id: string) =>
      apiFetch<{ candidate: Record<string, unknown> }>('GET', `/api/v1/candidates/${id}`),
  },

  employers: {
    me: () => apiFetch<EmployerResponse>('GET', '/api/v1/employers/me'),
    create: (data: Record<string, unknown>) =>
      apiFetch<{ employer: Record<string, unknown> }>('POST', '/api/v1/employers', data),
    update: (data: Record<string, unknown>) =>
      apiFetch<{ employer: Record<string, unknown> }>('PUT', '/api/v1/employers/me', data),
    checkCompanyName: (name: string) =>
      apiFetch<{ available: boolean }>(
        'GET',
        `/api/v1/employers/check-company-name?name=${encodeURIComponent(name)}`,
      ),
  },

  browse: {
    candidates: (filters: BrowseFiltersPayload, page = 1) =>
      apiFetch<BrowseResponse>('POST', '/api/v1/browse/candidates', { ...filters, page }),
    roleCounts: () =>
      apiFetch<{ roles: { role: string; count: number }[] }>('GET', '/api/v1/browse/role-counts'),
  },

  unlocks: {
    unlock: (candidate_id: string) =>
      apiFetch<{ unlock: Record<string, unknown> }>('POST', '/api/v1/unlocks', { candidate_id }),
    list: () => apiFetch<{ unlocks: Record<string, unknown>[] }>('GET', '/api/v1/unlocks'),
    status: (candidateId: string) =>
      apiFetch<{ unlocked: boolean }>('GET', `/api/v1/unlocks/${candidateId}/status`),
  },

  notifications: {
    registerToken: (push_token: string) =>
      apiFetch<void>('POST', '/api/v1/notifications/token', { push_token }),
    removeToken: () => apiFetch<void>('DELETE', '/api/v1/notifications/token'),
  },

  storage: {
    uploadPhoto: (formData: FormData) =>
      apiFetchFormData<{ photo_url: string }>('POST', '/api/v1/storage/photo', formData),
    deletePhoto: () => apiFetch<void>('DELETE', '/api/v1/storage/photo'),
    uploadCv: (formData: FormData) =>
      apiFetchFormData<{ cv_url: string; cv_file_name: string }>('POST', '/api/v1/storage/cv', formData),
    deleteCv: () => apiFetch<void>('DELETE', '/api/v1/storage/cv'),
    downloadCv: (candidateId: string) =>
      apiFetch<{ url: string }>('GET', `/api/v1/storage/cv/${candidateId}`),
    uploadLogo: (formData: FormData) =>
      apiFetchFormData<{ logo_url: string }>('POST', '/api/v1/storage/logo', formData),
  },
};
