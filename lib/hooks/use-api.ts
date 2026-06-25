import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export function useApi<T>(endpoint: string, fallback: T, params?: Record<string, unknown>) {
  const [data,    setData]    = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const paramsKey = JSON.stringify(params ?? {});

  const fetch_ = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get<T>(endpoint, { params });
      setData(res.data);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? "Failed to load data";
      setError(msg);
    } finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, paramsKey]);

  useEffect(() => { fetch_(); }, [fetch_]);
  return { data, loading, error, refetch: fetch_ };
}

export function useMutation<TBody, TResponse>(
  method: "post" | "patch" | "delete" | "put",
  endpoint: string
) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const mutate = async (body?: TBody, overrideUrl?: string): Promise<TResponse | null> => {
    setLoading(true); setError(null);
    try {
      const url = overrideUrl ?? endpoint;
      const res = method === "delete"
        ? await api.delete<TResponse>(url)
        : await (api[method as "post" | "patch" | "put"])<TResponse>(url, body);
      return res.data;
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? "Request failed";
      setError(msg);
      return null;
    } finally { setLoading(false); }
  };

  return { mutate, loading, error };
}