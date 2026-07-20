import axios, { type InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/proxy";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

// ── Token store (in-memory) ──────────────────────────────────────────────────
let _access: string | null = null;
let _refresh: string | null = null;
let _refreshPromise: Promise<string> | null = null;
let _onLogout: (() => void) | null = null;

export const tokenStore = {
  set:   (a: string, r: string) => { _access = a; _refresh = r; },
  clear: () => { _access = null; _refresh = null; },
  getAccess:  () => _access,
  getRefresh: () => _refresh,
};

export const setLogoutCallback = (fn: () => void) => { _onLogout = fn; };

// ── Request: attach token ────────────────────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: silent refresh on 401 ─────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = tokenStore.getRefresh();
      if (!refresh) { _onLogout?.(); return Promise.reject(error); }

      if (!_refreshPromise) {
        _refreshPromise = api
          .post<{ accessToken: string; refreshToken: string }>("/auth/refresh", { refreshToken: refresh })
          .then((r) => {
            tokenStore.set(r.data.accessToken, r.data.refreshToken);
            return r.data.accessToken;
          })
          .catch((err) => {
            tokenStore.clear();
            _onLogout?.();
            return Promise.reject(err);
          })
          .finally(() => { _refreshPromise = null; });
      }

      try {
        const newToken = await _refreshPromise;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);