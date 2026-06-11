// components/layout/sidebar.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Truck,
  ShoppingCart,
  Users,
  Warehouse,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { KlaxonMark } from "./klaxon-mark";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",  href: "/dashboard" },
  { icon: Package,         label: "Inventory",  href: "/inventory" },
  { icon: Truck,           label: "Logistics",  href: "/logistics" },
  { icon: ShoppingCart,    label: "Orders",     href: "/orders" },
  { icon: Users,           label: "Partners",   href: "/partners" },
  { icon: Warehouse,       label: "Warehouses", href: "/warehouses" },
  { icon: BarChart2,       label: "Analytics",  href: "/analytics" },
];

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ onCollapsedChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    onCollapsedChange?.(next);
  };

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: collapsed ? 64 : 240,
        background: "var(--bg-base)",
        borderRight: "1px solid var(--bd-1)",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        transition: "width 0.25s cubic-bezier(0.16,1,0.3,1)",
        overflow: "hidden",
      }}
    >
      {/* Brand */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          padding: collapsed ? "0 0 0 14px" : "0 16px",
          borderBottom: "1px solid var(--bd-1)",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <KlaxonMark size="sm" wordmark={!collapsed} />
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: "12px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`nav-item${active ? " active" : ""}`}
              style={{
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "9px 0" : "8px 12px",
                whiteSpace: "nowrap",
              }}
            >
              <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: settings + collapse toggle */}
      <div
        style={{
          padding: "8px 8px 14px",
          borderTop: "1px solid var(--bd-1)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexShrink: 0,
        }}
      >
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className={`nav-item${pathname === "/settings" ? " active" : ""}`}
          style={{
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "9px 0" : "8px 12px",
            whiteSpace: "nowrap",
          }}
        >
          <Settings style={{ width: 16, height: 16, flexShrink: 0 }} />
          {!collapsed && <span>Settings</span>}
        </Link>

        <button
          onClick={handleToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 10,
            padding: collapsed ? "9px 0" : "8px 12px",
            borderRadius: 10,
            background: "transparent",
            border: "1px solid transparent",
            cursor: "pointer",
            color: "var(--tx-3)",
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            transition: "all 0.15s",
            width: "100%",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-hover)";
            e.currentTarget.style.color = "var(--tx-1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--tx-3)";
          }}
        >
          {collapsed ? (
            <ChevronRight style={{ width: 16, height: 16, flexShrink: 0 }} />
          ) : (
            <>
              <ChevronLeft style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}