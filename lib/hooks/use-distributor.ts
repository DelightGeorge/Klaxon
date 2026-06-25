import { useApi, useMutation } from "./use-api";

export interface DistributorDrug { id: string; name: string; genericName?: string; brand?: string; category?: string; type?: string; unit?: string; costPrice?: number; sellingPrice?: number; isActive?: boolean; }
export interface DistributorOrder { id: string; status: string; totalAmount?: number; trackingNumber?: string; ppmv?: { businessName: string; ownerName?: string; city?: string; state?: string }; items?: { quantity: number; drug?: { name: string } }[]; createdAt?: string; }

export function useDistributorStats() {
  return useApi<{ totalDrugs?: number; activeDrugs?: number; totalOrders?: number; pendingOrders?: number; ordersToday?: number; totalRevenue?: number; status?: string }>(
    "/distributor/stats", {}
  );
}
export function useDistributorProfile() { return useApi<{ businessName?: string; contactPerson?: string; status?: string; city?: string; state?: string }>("/distributor/profile", {}); }
export function useDistributorDrugs(search?: string) { return useApi<DistributorDrug[]>("/distributor/drugs", [], search ? { search } : undefined); }
export function useDistributorOrders(status?: string) { return useApi<DistributorOrder[]>("/distributor/orders", [], status ? { status } : undefined); }
export function useDistributorOrder(id: string) { return useApi<DistributorOrder>(`/distributor/orders/${id}`, {} as DistributorOrder); }
export function useCreateDistributorDrug() { return useMutation<Partial<DistributorDrug> & { name: string }, DistributorDrug>("post", "/distributor/drugs"); }
export function useUpdateDistributorDrug(id: string) { return useMutation<Partial<DistributorDrug>, DistributorDrug>("patch", `/distributor/drugs/${id}`); }
export function useToggleDistributorDrug(id: string) { return useMutation<void, DistributorDrug>("patch", `/distributor/drugs/${id}/toggle`); }
export function useUpdateDistributorOrderStatus(id: string) {
  return useMutation<{ status: string; trackingNumber?: string; notes?: string }, DistributorOrder>("patch", `/distributor/orders/${id}/status`);
}