import { useApi, useMutation } from "./use-api";

export interface GtinRecord {
  id: string;
  gtin?: string;
  productId?: string;
  productName?: string;
  createdAt?: string;
}

export function useGtins(productId?: string) {
  const endpoint = productId ? `/gtin/product/${productId}` : "/gtin/create";
  return useApi<{ gtins?: GtinRecord[] }>(endpoint, { gtins: [] });
}

export function useScanLogs() {
  return useApi<{ logs?: unknown[] }>("/scanner/logs", { logs: [] });
}

export function useCreateGtin() {
  return useMutation<{ productId: string; quantity: number }, GtinRecord>("post", "/gtin/create");
}

export function useGenerateBarcode() {
  return useMutation<{ gtin: string }, { barcodeUrl: string }>("post", "/barcodes/generate");
}

export function useVerifyBarcode() {
  return useMutation<{ barcode: string }, { valid: boolean; product?: unknown }>("post", "/scanner/verify");
}