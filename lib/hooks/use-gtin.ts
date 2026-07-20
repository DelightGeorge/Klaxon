import { useApi, useMutation } from "./use-api";

export interface GtinRecord { id: string; productId?: string; gtinType: string; gtinValue: string; companyPrefix?: string; notes?: string; isActive?: boolean; createdAt?: string; }
export interface Barcode { id: string; productId?: string; barcodeType: string; barcodeValue: string; barcodeImage?: string; dataUrl?: string; batchNumber?: string; expiryDate?: string; }
export interface ScanResult { valid: boolean; product?: { id: string; name: string; genericName?: string; type?: string; requiresPrescription?: boolean }; batchNumber?: string; expiryDate?: string; isExpired?: boolean; message?: string; }
export interface ScanLog { id: string; barcodeValue: string; isValid: boolean; scannedAt: string; product?: { name: string; genericName?: string }; }

export function useProductGtins(productId: string) { return useApi<GtinRecord[]>(`/gtin/product/${productId}`, []); }
export function useScanLogs(productId?: string) { return useApi<ScanLog[]>("/scanner/logs", [], productId ? { productId } : undefined); }
export function useCreateGtin() {
  return useMutation<{ productId: string; gtinType: string; gtinValue: string; companyPrefix?: string; notes?: string }, GtinRecord>("post", "/gtin/create");
}
export function useGenerateBarcode() {
  return useMutation<{ productId: string; barcodeType: string; format?: string; batchNumber?: string; serialNumber?: string; expiryDate?: string }, Barcode>("post", "/barcodes/generate");
}
export function useVerifyBarcode() {
  return useMutation<{ barcodeValue: string; expectedProductId?: string }, ScanResult>("post", "/scanner/verify");
}