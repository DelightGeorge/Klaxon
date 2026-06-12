import { useApi } from "./use-api";

export interface DashboardStats {
  totalRevenue?: number;
  activeOrders?: number;
  pharmacies?: number;
  ppMVs?: number;
  lowStock?: number;
  expiring?: number;
  delivered?: number;
  inventoryValue?: number;
}

export interface AnalyticsOverview {
  revenue?: { month: string; revenue: number; orders: number }[];
  inventoryMix?: { name: string; value: number }[];
}

export function useDashboardStats() {
  return useApi<DashboardStats>("/analytics/overview", {});
}

export function useAnalyticsOverview() {
  return useApi<AnalyticsOverview>("/analytics/overview", {});
}

export function useBillingStats() {
  return useApi("/billing/stats", {});
}