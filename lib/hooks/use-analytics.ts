import { useApi } from "./use-api";

export function useAnalyticsOverview() {
  return useApi("/analytics/overview", {});
}

export function useRevenueAnalytics() {
  return useApi("/analytics/revenue", {});
}

export function usePharmacyAnalytics() {
  return useApi("/analytics/pharmacy", {});
}