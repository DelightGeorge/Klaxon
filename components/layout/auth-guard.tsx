"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

/**
 * Wraps every route under app/(dashboard) — this is the single place that
 * decides whether a visitor is allowed to see any dashboard page.
 *
 * Why this exists: previously, dashboard pages fired their data-fetching
 * hooks (useApi) on mount with no check at all. If someone hit a dashboard
 * URL directly while logged out, or if the page reloaded before Zustand's
 * persisted auth state had finished rehydrating, every request went out
 * with no access token and the page rendered a screen full of 401s.
 *
 * This component waits for `hasHydrated` (set once persisted state has
 * actually loaded — see lib/auth-store.ts) before making any decision, so
 * it never redirects a real logged-in user just because tokens hadn't
 * loaded yet. Only after hydration, if the visitor still isn't
 * authenticated, they're sent to /login.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-root)",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "2px solid var(--bd-1)",
            borderTopColor: "var(--k)",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect effect above is already in flight; render nothing rather
    // than flashing dashboard content (and firing its API calls) for an
    // instant before the redirect completes.
    return null;
  }

  return <>{children}</>;
}
