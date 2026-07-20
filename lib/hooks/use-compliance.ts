import { useApi, useMutation } from "./use-api";

export interface AuditLog { id: string; action: string; userId?: string; ipAddress?: string; createdAt: string; user?: { firstName: string; lastName: string; email: string }; }
export interface Recall { id: string; recallNumber: string; status: string; severity: string; reason: string; batchNumbers?: string[]; deadlineDate?: string; product?: { name: string; genericName?: string; nafdacNumber?: string }; affectedOrders?: unknown[]; }

export function useComplianceStats() {
  return useApi<{ activeRecalls?: number; criticalRecalls?: number; totalReports?: number; expiredBatches?: number }>("/compliance/stats", {});
}
export function useAuditLogs(params?: { userId?: string; action?: string; startDate?: string; endDate?: string; page?: number }) {
  return useApi<{ logs?: AuditLog[]; total?: number; page?: number; totalPages?: number }>(
    "/audit/logs", {}, { ...params, limit: 50 }
  );
}
export function useRecalls(status?: string) { return useApi<Recall[]>("/recalls", [], status ? { status } : undefined); }
export function useRecall(id: string) { return useApi<Recall>(`/recalls/${id}`, {} as Recall); }
export function useTraceability(productId: string, batchNumber: string) {
  return useApi<{ product?: unknown; batch?: unknown; timeline?: unknown }>(`/traceability/${productId}/${batchNumber}`, {});
}
export function useComplianceReports(reportType?: string) {
  return useApi<{ id: string; title: string; reportType: string; createdAt: string; data?: unknown }[]>(
    "/compliance/reports", [], reportType ? { reportType } : undefined
  );
}
export function useCreateRecall() {
  return useMutation<{ productId: string; batchNumbers?: string[]; reason: string; severity: string; correctiveAction?: string; deadlineDate?: string }, Recall>(
    "post", "/recalls/create"
  );
}
export function useUpdateRecall(id: string) {
  return useMutation<{ status?: string; correctiveAction?: string; notes?: string }, Recall>("patch", `/recalls/${id}`);
}
export function useCreateComplianceReport() {
  return useMutation<{ title: string; reportType: string; periodStart: string; periodEnd: string; notes?: string }, { id: string; title: string; data?: unknown }>(
    "post", "/compliance/reports"
  );
}