import { useApi, useMutation } from "./use-api";

export interface Supplier { id: string; name: string; contactPerson?: string; phone?: string; email?: string; address?: string; state?: string; city?: string; licenseNumber?: string; paymentTerms?: string; rating?: number; notes?: string; _count?: { purchaseOrders: number }; }
export interface RFQ { id: string; rfqNumber: string; title: string; status: string; deadline?: string; items?: { product?: { name: string }; quantity: number }[]; responses?: unknown[]; }
export interface PurchaseOrder { id: string; poNumber: string; status: string; totalAmount: number; supplier?: { name: string }; warehouse?: { name: string }; _count?: { items: number }; createdAt: string; expectedDeliveryDate?: string; }

export function useProcurementStats() {
  return useApi<{ totalSuppliers?: number; openRFQs?: number; pendingApproval?: number; totalPOs?: number; totalSpend?: number }>(
    "/procurement/stats", {}
  );
}
export function useSuppliers(search?: string) { return useApi<Supplier[]>("/procurement/suppliers", [], search ? { search } : undefined); }
export function useSupplier(id: string) { return useApi<Supplier>(`/procurement/suppliers/${id}`, {} as Supplier); }
export function useRFQs(status?: string) { return useApi<RFQ[]>("/procurement/rfq", [], status ? { status } : undefined); }
export function useRFQ(id: string) { return useApi<RFQ>(`/procurement/rfq/${id}`, {} as RFQ); }
export function usePurchaseOrders(params?: { status?: string; supplierId?: string; page?: number }) {
  return useApi<{ orders?: PurchaseOrder[]; total?: number; totalPages?: number }>("/procurement/purchase-orders", {}, params);
}
export function usePurchaseOrder(id: string) { return useApi<PurchaseOrder>(`/procurement/purchase-orders/${id}`, {} as PurchaseOrder); }
export function useCreateSupplier() { return useMutation<Partial<Supplier>, Supplier>("post", "/procurement/suppliers"); }
export function useUpdateSupplier(id: string) { return useMutation<Partial<Supplier>, Supplier>("patch", `/procurement/suppliers/${id}`); }
export function useCreateRFQ() {
  return useMutation<{ title: string; description?: string; deadline: string; items: { productId: string; quantity: number; specifications?: string }[]; supplierIds: string[]; notes?: string }, RFQ>(
    "post", "/procurement/rfq"
  );
}
export function useRespondToRFQ() {
  return useMutation<{ rfqId: string; items: { productId: string; unitPrice: number; availableQuantity: number; leadTimeDays: number }[]; notes?: string }, unknown>(
    "post", "/procurement/rfq/respond"
  );
}
export function useCloseRFQ(id: string) { return useMutation<void, RFQ>("patch", `/procurement/rfq/${id}/close`); }
export function useCreatePO() {
  return useMutation<{ supplierId: string; warehouseId: string; rfqId?: string; items: { productId: string; quantity: number; unitPrice: number }[]; expectedDeliveryDate?: string; notes?: string }, PurchaseOrder>(
    "post", "/procurement/purchase-orders"
  );
}
export function useSubmitPO(id: string) { return useMutation<void, PurchaseOrder>("patch", `/procurement/purchase-orders/${id}/submit`); }
export function useApprovePO(id: string) {
  return useMutation<{ decision: "APPROVED" | "REJECTED"; comments?: string }, PurchaseOrder>(
    "patch", `/procurement/purchase-orders/${id}/approve`
  );
}
export function useReceivePO(id: string) {
  return useMutation<{ items: { productId: string; batchNumber: string; quantityReceived: number; expiryDate: string }[]; notes?: string }, { message: string }>(
    "post", `/procurement/purchase-orders/${id}/receive`
  );
}