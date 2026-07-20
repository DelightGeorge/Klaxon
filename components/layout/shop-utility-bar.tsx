"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutDashboard, LogOut, Package } from "lucide-react";
import { useAuthStore, ROLE_DASHBOARD } from "@/lib/auth-store";

/**
 * A thin bar shown above the shop's own topbar. Kept deliberately small and
 * secondary — the shop itself (search, categories, products) is what
 * general visitors should land on first; this bar only needs to answer
 * "am I signed in, and as what" without competing for attention.
 *
 * PATIENT is the only role in ROLE_DASHBOARD that represents an ordinary
 * shop customer — everyone else (PHARMACIST, WAREHOUSE_MANAGER, admins,
 * delivery agents, etc.) is platform/organization staff and gets routed
 * back to their real dashboard instead of a customer "My Orders" link.
 */
export function ShopUtilityBar() {
  // Avoids a server/client mismatch on first paint and avoids showing a
  // "guest" flash before Zustand's persisted auth state has rehydrated.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const barStyle: React.CSSProperties = {
    background: "#07080a",
    borderBottom: "1px solid var(--bd-1)",
  };
  const innerStyle: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "6px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    minHeight: 30,
  };

  if (!mounted || !hasHydrated) {
    // Reserve the same height so nothing jumps once auth state resolves.
    return <div style={{ ...barStyle, minHeight: 30 }} />;
  }

  if (!isAuthenticated) {
    return (
      <div style={barStyle}>
        <div style={innerStyle}>
          <span
            className="shop-util-tagline"
            style={{ fontSize: 11, color: "var(--tx-3)" }}
          >
            Order verified medicines from NAFDAC-licensed pharmacies, delivered fast across Nigeria.
          </span>
          <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
            <Link
              href="/?portal=customer&tab=login"
              style={{ fontSize: 11, color: "var(--tx-2)", textDecoration: "none" }}
            >
              Sign in
            </Link>
            <Link
              href="/?portal=customer&tab=register"
              style={{ fontSize: 11, color: "var(--k)", textDecoration: "none", fontWeight: 600 }}
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const role = user?.roles?.[0];
  const isStaff = !!role && role !== "PATIENT" && role in ROLE_DASHBOARD;
  const dashboardHref = role ? (ROLE_DASHBOARD[role] ?? "/dashboard") : "/dashboard";

  return (
    <div style={barStyle}>
      <div style={innerStyle}>
        <span
          className="shop-util-tagline"
          style={{ fontSize: 11, color: "var(--tx-3)" }}
        >
          {isStaff
            ? "Viewing the customer shop as staff."
            : `Welcome back, ${user?.firstName ?? "there"}.`}
        </span>

        {isStaff ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: "var(--k)",
                background: "var(--k-subtle)",
                border: "1px solid var(--bd-k)",
                padding: "2px 8px",
                borderRadius: 99,
                flexShrink: 0,
              }}
            >
              STAFF
            </span>
            <Link
              href={dashboardHref}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                fontWeight: 600,
                color: "var(--tx-1)",
                textDecoration: "none",
              }}
            >
              <LayoutDashboard style={{ width: 12, height: 12 }} />
              Dashboard
            </Link>
            <button
              onClick={() => logout()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                color: "var(--tx-3)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <LogOut style={{ width: 12, height: 12 }} />
              Sign out
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
            <Link
              href="/shop/orders"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "var(--tx-2)",
                textDecoration: "none",
              }}
            >
              <Package style={{ width: 12, height: 12 }} />
              My Orders
            </Link>
            <button
              onClick={() => logout()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                color: "var(--tx-3)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <LogOut style={{ width: 12, height: 12 }} />
              Sign out
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 560px) {
          .shop-util-tagline { display: none; }
        }
      `}</style>
    </div>
  );
}
