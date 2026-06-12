import { useApi, useMutation } from "./use-api";

export interface Drug {
  id: string;
  name: string;
  gtin?: string;
  sku?: string;
  batch?: string;
  expiry?: string;
  quantity: number;
  warehouse?: string;
  supplier?: string;
  category?: string;
  status?: string;
  price?: string | number;
}

export function useProducts() {
  return useApi<{ data?: Drug[]; products?: Drug[] }>("/products", { data: [] });
}

export function usePharmacyDrugs() {
  return useApi<{ drugs?: Drug[]; data?: Drug[] }>("/pharmacy/drugs", { drugs: [] });
}

export function useLowStock() {
  return useApi<{ drugs?: Drug[] }>("/pharmacy/drugs/low-stock", { drugs: [] });
}

export function useExpiringDrugs() {
  return useApi<{ drugs?: Drug[] }>("/pharmacy/drugs/expiring", { drugs: [] });
}

export function useWarehouses() {
  return useApi<{ warehouses?: unknown[] }>("/inventory/warehouses", { warehouses: [] });
}

export function useCreateDrug() {
  return useMutation<Partial<Drug>, Drug>("post", "/pharmacy/drugs");
}