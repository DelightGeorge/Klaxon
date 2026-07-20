import { useApi } from "./use-api";

export function usePlatformAnalytics() {
  return useApi<{
    totalOrganizations?: number; activeOrganizations?: number;
    pendingApplications?: number; totalUsers?: number; totalRevenue?: number;
  }>("/analytics/platform", {});
}

export function useAnalyticsOverview() {
  return useApi<{
    staff?: { total: number };
    revenue?: { thisMonth: number; lastMonth: number; growth: string };
    alerts?: { pendingPrescriptions: number; activeTelehealthSessions: number };
  }>("/analytics/overview", {});
}

export function useSalesAnalytics(period = 30) {
  return useApi<{
    summary?: { totalRevenue: number; previousRevenue: number; revenueGrowth: string; totalOrders: number; avgOrderValue: string; deliveredOrders: number };
    revenueByDay?: { date: string; amount: number }[];
    revenueByCustomerType?: { type: string; amount: number }[];
    revenueByCategory?: { category: string; amount: number }[];
  }>("/analytics/sales", {}, { period });
}

export function useRevenueChart() {
  return useApi<{ chart?: { month: string; revenue: number; transactions: number }[] }>(
    "/analytics/revenue", {}
  );
}

export function useInventoryHealth() {
  return useApi<{
    summary?: { total: number; healthy: number; low: number; critical: number; outOfStock: number; overstock: number };
    items?: { product: { name: string; unit: string }; warehouse: string; currentStock: number; availableStock: number; daysOfStockRemaining: number; status: string }[];
  }>("/analytics/inventory/health", {});
}

export function useProductPerformance() {
  return useApi<{
    topSellers?: { product: { id: string; name: string; category: string }; totalQuantity: number; totalRevenue: number; orderCount: number }[];
    slowMovers?: unknown[];
    totalProductsSold?: number;
  }>("/analytics/products/performance", {});
}

export function useRegionalAnalytics() {
  return useApi<{ regions?: { region: string; orders: number; revenue: number; units: number }[] }>(
    "/analytics/regions", {}
  );
}

export function useSupplyChainAnalytics() {
  return useApi<{
    procurement?: { totalPOs: number; approvedPOs: number; avgFulfillmentDays: string; totalSpend: number };
    fulfillment?: { totalOrders: number; deliveredOrders: number; fulfillmentRate: string; avgDeliveryHours: string };
  }>("/analytics/supply-chain", {});
}

export function useDemandForecast() {
  return useApi<{
    forecasts?: { product: { id: string; name: string; unit: string }; forecastNextMonth: number; trend: string; totalLast90Days: number }[];
  }>("/analytics/forecast", {});
}

export function usePpmvAnalytics() {
  return useApi<{
    summary?: { totalPPMVs: number; activePPMVs: number; pendingPPMVs: number; ordersLast30Days: number; revenueFromPPMVs: number };
    topPPMVs?: { name: string; location: string; orders: number; revenue: number }[];
  }>("/analytics/ppmv", {});
}