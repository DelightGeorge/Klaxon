import { useApi } from "./use-api";

export function useOrgStaff() {
  return useApi<{ staff?: unknown[] }>("/organizations/staff", { staff: [] });
}

export function useCurrentUser() {
  return useApi<{ user?: unknown }>("/auth/me", {});
}