import { useApi, useMutation } from "./use-api";

export function useSuppliers() {
  return useApi<{ suppliers?: unknown[] }>("/pharmacy/suppliers", { suppliers: [] });
}

export function useRFQs() {
  return useApi<{ rfqs?: unknown[] }>("/procurement/rfq", { rfqs: [] });
}

export function useProcurementOrders() {
  return useApi<{ orders?: unknown[] }>("/procurement/orders", { orders: [] });
}

export function useCreateRFQ() {
  return useMutation<unknown, unknown>("post", "/procurement/rfq");
}

export function useCreateSupplier() {
  return useMutation<unknown, unknown>("post", "/pharmacy/suppliers");
}