import { useApi, useMutation } from "./use-api";

export interface Product { id: string; name: string; genericName?: string; brand?: string; manufacturer?: string; countryOfOrigin?: string; category?: string; type?: string; dosageForm?: string; strength?: string; unit?: string; unitPrice?: number; nafdacNumber?: string; gtin?: string; requiresPrescription?: boolean; isControlled?: boolean; isColdChain?: boolean; isActive?: boolean; description?: string; storageConditions?: string; shelfLifeDays?: string; activeIngredients?: string[]; _count?: { batches: number }; }

export function useProducts(params?: { search?: string; category?: string; type?: string; page?: number; limit?: number }) {
  return useApi<{ products?: Product[]; total?: number; page?: number; totalPages?: number }>(
    "/products", {}, { limit: 20, ...params }
  );
}
export function useProduct(id: string) { return useApi<Product>(`/products/${id}`, {} as Product); }
export function usePublicCatalogue(search?: string, type?: string) { return useApi<Product[]>("/products/catalogue", [], { search, type }); }
export function useProductStats() {
  return useApi<{ total?: number; withGTIN?: number; coldChain?: number; byCategory?: { category: string; count: number }[]; byType?: { type: string; count: number }[] }>(
    "/products/stats", {}
  );
}
export function useCreateProduct() {
  return useMutation<Partial<Product> & { name: string; category: string; type: string }, Product>("post", "/products");
}
export function useUpdateProduct(id: string) { return useMutation<Partial<Product>, Product>("patch", `/products/${id}`); }