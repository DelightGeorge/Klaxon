import { useApi, useMutation } from "./use-api";

export interface Notification {
  id: string; title?: string; message?: string; type?: string;
  priority?: string; isRead?: boolean; link?: string; createdAt?: string;
}

export function useNotifications(unreadOnly = false, page = 1) {
  return useApi<{ notifications?: Notification[]; total?: number; unreadCount?: number }>(
    "/notifications", {}, { page, limit: 20, unreadOnly }
  );
}
export function useUnreadCount() {
  return useApi<{ unreadCount?: number }>("/notifications/unread-count", {});
}
export function useMarkAllRead() { return useMutation<void, { message: string }>("patch", "/notifications/read-all"); }
export function useMarkRead(id: string) { return useMutation<void, { count: number }>("patch", `/notifications/${id}/read`); }
export function useDeleteNotification(id: string) { return useMutation<void, { message: string }>("delete", `/notifications/${id}`); }