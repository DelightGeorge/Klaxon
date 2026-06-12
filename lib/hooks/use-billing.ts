import { useApi, useMutation } from "./use-api";

export interface Invoice {
  id: string;
  amount?: number;
  status?: string;
  dueDate?: string;
  createdAt?: string;
  customer?: string;
}

export function useInvoices() {
  return useApi<{ invoices?: Invoice[]; data?: Invoice[] }>("/billing/invoices", { invoices: [] });
}

export function useMyInvoices() {
  return useApi<{ invoices?: Invoice[] }>("/billing/invoices/me", { invoices: [] });
}

export function useBillingStats() {
  return useApi("/billing/stats", {});
}

export function useInitializePayment() {
  return useMutation<{ invoiceId: string }, { authorizationUrl: string }>("post", "/billing/payments/paystack/initialize");
}