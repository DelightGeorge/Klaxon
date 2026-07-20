import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, tokenStore, setLogoutCallback } from "./api";

// ── Types ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  organizationId?: string;
  organizationName?: string;
}

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: string;
}

interface AuthState {
  user:            AuthUser | null;
  accessToken:     string | null;
  refreshToken:    string | null;
  isAuthenticated: boolean;
  isLoading:       boolean;

  // Actions
  setUser:     (user: AuthUser) => void;
  setTokens:   (access: string, refresh: string) => void;
  setLoading:  (v: boolean) => void;
  login:       (email: string, password: string) => Promise<string>;
  register:    (data: RegisterData) => Promise<void>;
  logout:      () => Promise<void>;
  hydrate:     () => void;
  hasRole:     (...roles: string[]) => boolean;
  getDashboard:() => string;
}

// ── Role → dashboard map ─────────────────────────────────────────────────────
export const ROLE_DASHBOARD: Record<string, string> = {
  SUPER_ADMIN:        "/dashboard",
  ORG_ADMIN:          "/dashboard",
  DOCTOR:             "/dashboard",
  NURSE:              "/dashboard",
  RECEPTIONIST:       "/dashboard",
  PHARMACIST:         "/inventory/products",
  LAB_TECHNICIAN:     "/dashboard",
  RADIOLOGIST:        "/dashboard",
  BILLING_OFFICER:    "/admin/billing",
  INSURANCE_OFFICER:  "/admin/billing",
  HR_MANAGER:         "/admin/users",
  INVENTORY_MANAGER:  "/inventory/products",
  PATIENT:            "/dashboard",
  DISTRIBUTOR_ADMIN:  "/fulfillment/orders",
  WAREHOUSE_MANAGER:  "/inventory/warehouses",
  DELIVERY_AGENT:     "/fulfillment/tracking",
  PPMV_OWNER:         "/ppmv/dashboard",
};

// ── Store ────────────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:            null,
      accessToken:     null,
      refreshToken:    null,
      isAuthenticated: false,
      isLoading:       false,

      // ── Setters ────────────────────────────────────────────────────────────
      setUser: (user) => set({ user, isAuthenticated: true }),

      setTokens: (access, refresh) => {
        tokenStore.set(access, refresh);
        set({ accessToken: access, refreshToken: refresh });
      },

      setLoading: (v) => set({ isLoading: v }),

      // ── Hydrate tokens from localStorage into memory ────────────────────────
      hydrate: () => {
        const { accessToken, refreshToken } = get();
        if (accessToken && refreshToken) {
          tokenStore.set(accessToken, refreshToken);
        }
      },

      // ── Login ──────────────────────────────────────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post<{
            message:      string;
            user:         AuthUser;
            accessToken:  string;
            refreshToken: string;
          }>("/auth/login", { email, password });

          const { user, accessToken, refreshToken } = res.data;

          tokenStore.set(accessToken, refreshToken);

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading:       false,
          });

          const role = user?.roles?.[0] ?? "";
          return ROLE_DASHBOARD[role] ?? "/dashboard";

        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      // ── Register ───────────────────────────────────────────────────────────
      register: async (data) => {
        set({ isLoading: true });
        try {
          await api.post("/auth/register", data);
          set({ isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      // ── Logout ─────────────────────────────────────────────────────────────
      logout: async () => {
        try { await api.post("/auth/logout"); } catch { /* ignore */ }
        tokenStore.clear();
        set({
          user:            null,
          accessToken:     null,
          refreshToken:    null,
          isAuthenticated: false,
          isLoading:       false,
        });
      },

      // ── Helpers ────────────────────────────────────────────────────────────
      hasRole: (...roles) => {
        const { user } = get();
        if (!user) return false;
        return roles.some(r => user.roles.includes(r));
      },

      getDashboard: () => {
        const { user } = get();
        if (!user) return "/login";
        const role = user.roles[0];
        return ROLE_DASHBOARD[role] ?? "/dashboard";
      },
    }),
    {
      name: "klaxon-auth",
      partialize: (s) => ({
        user:            s.user,
        accessToken:     s.accessToken,
        refreshToken:    s.refreshToken,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);

// ── Boot: hydrate tokens + register logout callback ──────────────────────────
if (typeof window !== "undefined") {
  useAuthStore.getState().hydrate();

  setLogoutCallback(() => {
    useAuthStore.getState().logout();
    window.location.href = "/login";
  });
}