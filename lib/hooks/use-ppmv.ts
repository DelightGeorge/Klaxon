import { useApi } from "./use-api";

export function usePpmvStats() {
  return useApi("/ppmv/stats", {});
}

export function usePpmvInventory() {
  return useApi<{ inventory?: unknown[] }>("/ppmv/inventory", { inventory: [] });
}

export function usePpmvOrders() {
  return useApi<{ orders?: unknown[] }>("/ppmv/orders", { orders: [] });
}

export function usePpmvProfile() {
  return useApi("/ppmv/profile", {});
}