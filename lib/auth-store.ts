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

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login:    (email: string, password: string) => Promise<string>;
  register: (data: RegisterData) => Promise<void>;
  logout:   () => Promise<void>;
  hydrate:  () => void;
  hasRole:  (...roles: string[]) => boolean;
  getDashboard: () => string;
}

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: string;
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

      hydrate: () => {
        const { accessToken, refreshToken } = get();
        if (accessToken && refreshToken) {
          tokenStore.set(accessToken, refreshToken);
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post<{
            message: string;
            user: AuthUser;
            accessToken: string;
            refreshToken: string;
          }>("/auth/login", { email, password });

          tokenStore.set(res.data.accessToken, res.data.refreshToken);
          set({
            user:            res.data.user,
            accessToken:     res.data.accessToken,
            refreshToken:    res.data.refreshToken,
            isAuthenticated: true,
            isLoading:       false,
          });

          const role = res.data.user.roles[0];
          return role ? (ROLE_DASHBOARD[role] ?? "/dashboard") : "/dashboard";
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

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

      logout: async () => {
        try { await api.post("/auth/logout"); } catch { /* ignore */ }
        tokenStore.clear();
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      hasRole: (...roles) => {
        const { user } = get();
        if (!user) return false;
        return roles.some(r => user.roles.includes(r));
      },

      getDashboard: () => {
        const { user } = get();
        if (!user) return "/login";
        const role = user.roles[0];
        return role ? (ROLE_DASHBOARD[role] ?? "/dashboard") : "/dashboard";
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

// Hydrate tokens + register logout callback on app start
if (typeof window !== "undefined") {
  useAuthStore.getState().hydrate();
  setLogoutCallback(() => {
    useAuthStore.getState().logout();
    window.location.href = "/login";
  });
}