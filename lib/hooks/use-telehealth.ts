import { useApi, useMutation } from "./use-api";

export function useTelehealthSessions() {
  return useApi<{ sessions?: unknown[] }>("/telehealth/sessions", { sessions: [] });
}

export function useCreateSession() {
  return useMutation<unknown, unknown>("post", "/telehealth/sessions");
}