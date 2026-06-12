import { useApi, useMutation } from "./use-api";

export interface Notification {
  id: string;
  title?: string;
  message?: string;
  read?: boolean;
  createdAt?: string;
  type?: string;
}

export function useNotifications() {
  return useApi<{ notifications?: Notification[]; data?: Notification[] }>("/notifications", { notifications: [] });
}

export function useUnreadCount() {
  return useApi<{ count?: number }>("/notifications/unread-count", { count: 0 });
}

export function useMarkAllRead() {
  return useMutation<void, void>("patch", "/notifications/read-all");
}