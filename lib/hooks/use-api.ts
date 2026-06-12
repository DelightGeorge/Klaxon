import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

// Generic fetch hook with loading/error/refetch
export function useApi<T>(endpoint: string, fallback: T) {
  const [data,    setData]    = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<T>(endpoint);
      setData(res.data);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? "Failed to load data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
}

// Mutation hook (POST/PATCH/DELETE)
export function useMutation<TBody, TResponse>(
  method: "post" | "patch" | "delete",
  endpoint: string
) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const mutate = async (body?: TBody): Promise<TResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api[method]<TResponse>(endpoint, body);
      return res.data;
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? "Request failed";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}