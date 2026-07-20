import { useApi, useMutation } from "./use-api";

export interface SalesOrder {
  id: string; orderNumber: string; status: string; totalAmount: number;
  customerId: string; customerType: string; deliveryAddress?: string;
  warehouse?: { name: string }; delivery?: { status: string; trackingNumber?: string };
  _count?: { items: number }; createdAt: string; notes?: string;
}
export interface Delivery {
  id: string; status: string; carrier?: string; trackingNumber?: string;
  driverName?: string; estimatedDeliveryDate?: string;
  salesOrder?: { orderNumber: string; deliveryAddress?: string; totalAmount: number };
  trackingEvents?: { status: string; location?: string; notes?: string; createdAt: string }[];
}

export function useFulfillmentStats() {
  return useApi<{ totalOrders?: number; pendingOrders?: number; dispatchedToday?: number; deliveredToday?: number; activeDeliveries?: number; overdueDeliveries?: number }>(
    "/fulfillment/stats", {}
  );
}
export function useOrders(params?: { status?: string; customerId?: string; page?: number }) {
  return useApi<{ orders?: SalesOrder[]; total?: number; page?: number; totalPages?: number }>(
    "/orders/status", {}, params
  );
}
export function useOrder(id: string) { return useApi<SalesOrder>(`/orders/${id}`, {} as SalesOrder); }
export function useDeliveries(status?: string) { return useApi<Delivery[]>("/deliveries", [], status ? { status } : undefined); }
export function useDelivery(id: string) { return useApi<Delivery>(`/deliveries/${id}`, {} as Delivery); }
export function useCreateOrder() {
  return useMutation<{ customerId: string; customerType: string; warehouseId: string; items: { productId: string; quantity: number; unitPrice: number }[]; deliveryAddress: string; requestedDeliveryDate?: string; notes?: string }, SalesOrder>(
    "post", "/orders/create"
  );
}
export function useUpdateOrderStatus(id: string) {
  return useMutation<{ status: string; notes?: string }, SalesOrder>("patch", `/orders/${id}/status`);
}
export function useCancelOrder(id: string) {
  return useMutation<{ reason: string }, SalesOrder>("patch", `/orders/${id}/cancel`);
}
export function useCreateDelivery() {
  return useMutation<{ salesOrderId: string; carrier: string; trackingNumber: string; driverName?: string; driverPhone?: string; vehicleNumber?: string; estimatedDeliveryDate?: string }, Delivery>(
    "post", "/delivery/create"
  );
}
export function useUpdateDelivery() {
  return useMutation<{ deliveryId: string; status: string; location?: string; notes?: string; proofOfDeliveryUrl?: string; receivedBy?: string }, Delivery>(
    "post", "/delivery/update"
  );
}
export function useApproveDispatch() {
  return useMutation<{ orderId: string; decision: "APPROVED" | "REJECTED"; comments?: string }, unknown>(
    "post", "/dispatch/approve"
  );
}