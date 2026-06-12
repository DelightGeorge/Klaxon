import { useApi, useMutation } from "./use-api";

export interface Order {
  id: string;
  customer?: string;
  type?: string;
  qty?: number;
  value?: string | number;
  status?: string;
  eta?: string;
  logistics?: string;
  date?: string;
}

export function useOrders() {
  return useApi<{ orders?: Order[]; data?: Order[] }>("/ppmv/orders", { orders: [] });
}

export function useDistributorOrders() {
  return useApi<{ orders?: Order[]; data?: Order[] }>("/distributor/orders", { orders: [] });
}

export function useUpdateOrderStatus(id: string) {
  return useMutation<{ status: string }, Order>("patch", `/distributor/orders/${id}/status`);
}