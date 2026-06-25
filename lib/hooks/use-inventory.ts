import { useApi, useMutation } from "./use-api";

export interface StockItem {
  id: string; quantity: number; reservedQuantity: number;
  product: { name: string; genericName?: string; unit: string; category?: string; type?: string; isColdChain?: boolean; requiresPrescription?: boolean };
  warehouse: { name: string; type: string };
}
export interface Warehouse {
  id: string; name: string; type: string; address?: string; state?: string; city?: string;
  hasColdStorage?: boolean; isActive?: boolean; _count?: { stock: number };
}
export interface Batch {
  id: string; batchNumber: string; quantity: number; remainingQuantity: number;
  expiryDate: string; status: string; product?: { name: string; unit: string };
}

export function useInventoryStats() {
  return useApi<{ totalStockUnits?: number; lowStockCount?: number; expiringSoonCount?: number; totalWarehouses?: number; totalTransactions?: number }>(
    "/inventory/stats", {}
  );
}
export function useInventoryProducts(warehouseId?: string, search?: string) {
  return useApi<StockItem[]>("/inventory/products", [], { warehouseId, search });
}
export function useWarehouses() { return useApi<Warehouse[]>("/inventory/warehouses", []); }
export function useWarehouse(id: string) { return useApi<Warehouse & { stock?: StockItem[] }>(`/inventory/warehouses/${id}`, {} as Warehouse); }
export function useLowStock(threshold = 10) { return useApi<StockItem[]>("/inventory/low-stock", [], { threshold }); }
export function useExpiringBatches(days = 90) { return useApi<Batch[]>("/inventory/expiring", [], { days }); }
export function useInventoryTransactions(params?: { warehouseId?: string; productId?: string; type?: string; page?: number }) {
  return useApi<{ transactions?: { id: string; type: string; quantity: number; notes?: string; createdAt: string; product: { name: string }; warehouse: { name: string } }[]; total?: number; totalPages?: number }>(
    "/inventory/transactions", {}, { ...params, limit: 50 }
  );
}
export function useAddStock() {
  return useMutation<{ productId: string; warehouseId: string; batchNumber: string; quantity: number; expiryDate: string; manufacturingDate?: string; costPrice?: number; sellingPrice?: number; notes?: string }, { message: string; batch: Batch }>(
    "post", "/inventory/stock/add"
  );
}
export function useStockOut() {
  return useMutation<{ productId: string; warehouseId: string; quantity: number; reason: string; referenceId?: string; referenceType?: string }, { message: string }>(
    "post", "/inventory/stock/out"
  );
}
export function useStockTransfer() {
  return useMutation<{ productId: string; fromWarehouseId: string; toWarehouseId: string; quantity: number; notes?: string }, { message: string }>(
    "post", "/inventory/stock/transfer"
  );
}
export function useStockReconcile() {
  return useMutation<{ warehouseId: string; productId: string; actualQuantity: number; reason: string; notes?: string }, { message: string; previousQuantity: number; newQuantity: number; difference: number }>(
    "post", "/inventory/stock/reconcile"
  );
}
export function useCreateWarehouse() {
  return useMutation<{ name: string; type: string; address: string; state: string; city: string; contactPerson?: string; phone?: string; capacity?: number; hasColdStorage?: boolean; notes?: string }, Warehouse>(
    "post", "/inventory/warehouses"
  );
}