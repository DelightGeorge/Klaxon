import { useApi, useMutation } from "./use-api";

export interface Invoice { id: string; status: string; totalAmount: number; dueDate?: string; createdAt: string; items?: { serviceType: string; description: string; unitPrice: number; quantity: number }[]; }

export function useBillingStats() {
  return useApi<{ totalInvoices?: number; paidInvoices?: number; pendingInvoices?: number; overdueInvoices?: number; revenueToday?: number; revenueThisMonth?: number }>(
    "/billing/stats", {}
  );
}
export function useInvoices(status?: string, page = 1) {
  return useApi<{ invoices?: Invoice[]; total?: number; totalPages?: number }>(
    "/billing/invoices", {}, { status, page, limit: 20 }
  );
}
export function useInvoice(id: string) { return useApi<Invoice>(`/billing/invoices/${id}`, {} as Invoice); }
export function useCreateInvoice() {
  return useMutation<{ patientId: string; dueDate?: string; taxRate?: number; discountAmount?: number; notes?: string; items: { serviceType: string; description: string; unitPrice: number; quantity: number }[] }, Invoice>(
    "post", "/billing/invoices"
  );
}
export function useRecordPayment() {
  return useMutation<{ invoiceId: string; amount: number; method: string; reference?: string; notes?: string }, { message: string }>(
    "post", "/billing/payments"
  );
}
export function useInitializePaystack() {
  return useMutation<{ invoiceId: string }, { reference: string; amount: number; paystackKey: string; callbackUrl: string }>(
    "post", "/billing/payments/paystack/initialize"
  );
}
export function useVerifyPaystack() {
  return useMutation<{ reference: string; invoiceId: string }, { message: string; amountPaid: number }>(
    "post", "/billing/payments/paystack/verify"
  );
}