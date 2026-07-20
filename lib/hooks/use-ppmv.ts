import { useApi, useMutation } from "./use-api";

export interface PpmvDrug { id: string; name: string; genericName?: string; brand?: string; category?: string; type?: string; unit?: string; sellingPrice?: number; manufacturer?: string; distributor?: { businessName: string; state: string }; }
export interface PpmvOrder { id: string; status: string; totalAmount?: number; deliveryAddress?: string; createdAt?: string; items?: { drugCatalogueId: string; quantity: number }[]; }

export function usePpmvCatalogue(search?: string, category?: string) { return useApi<PpmvDrug[]>("/ppmv/catalogue", [], { search, category }); }
export function usePpmvStats() { return useApi<{ totalOrders?: number; pendingOrders?: number; totalInventory?: number; lowStock?: number; status?: string }>("/ppmv/stats", {}); }
export function usePpmvProfile() { return useApi<{ id?: string; businessName?: string; ownerName?: string; status?: string; city?: string; state?: string; _count?: { orders: number; inventory: number } }>("/ppmv/profile", {}); }
export function usePpmvOrders(status?: string) { return useApi<PpmvOrder[]>("/ppmv/orders", [], status ? { status } : undefined); }
export function usePpmvInventory() { return useApi<{ id: string; drugName: string; unit: string; quantity: number; unitPrice?: number; supplier?: string }[]>("/ppmv/inventory", []); }
export function usePlacePpmvOrder() {
  return useMutation<{ items: { drugCatalogueId: string; quantity: number }[]; deliveryAddress: string; notes?: string }, PpmvOrder>(
    "post", "/ppmv/orders"
  );
}
export function useAddPpmvInventory() {
  return useMutation<{ drugName: string; unit: string; unitPrice?: number; quantity: number; supplier?: string }, unknown>("post", "/ppmv/inventory");
}
export function useAdminPpmvList(status?: string) { return useApi<unknown[]>("/ppmv/admin/all", [], status ? { status } : undefined); }
export function useReviewPpmv() {
  return useMutation<{ status: string; reason?: string }, unknown>("patch", "/ppmv/admin/placeholder/review");
}