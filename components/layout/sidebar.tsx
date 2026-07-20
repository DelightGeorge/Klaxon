"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Package, QrCode, Truck,
  TrendingUp, Stethoscope, Store, ShieldCheck,
  Code2, Settings, Users, ChevronLeft, ChevronRight,
  ChevronDown, ClipboardList, BarChart2, ShoppingBag,
} from "lucide-react";
import { KlaxonMark } from "./klaxon-mark";
import { useAuthStore } from "@/lib/auth-store";

// Roles as used by ROLE_DASHBOARD in lib/auth-store.ts — the vocabulary
// that actually drives real post-login redirects today. (This file
// previously used a different, unrelated role vocabulary — MANUFACTURER,
// PHARMACY_ADMIN, PPMV_OPERATOR, etc. — that didn't match any role the
// login flow ever produces, so almost every nav section below was
// invisible to every real account except SUPER_ADMIN/ORG_ADMIN. The
// section→role assignments below are a best-effort mapping onto the real
// vocabulary; double check them against your backend's actual permission
// rules if any team ends up seeing sections they shouldn't, or missing
// ones they need.)
type Role =
  | "SUPER_ADMIN" | "ORG_ADMIN" | "DOCTOR" | "NURSE" | "RECEPTIONIST"
  | "PHARMACIST" | "LAB_TECHNICIAN" | "RADIOLOGIST" | "BILLING_OFFICER"
  | "INSURANCE_OFFICER" | "HR_MANAGER" | "INVENTORY_MANAGER" | "PATIENT"
  | "DISTRIBUTOR_ADMIN" | "WAREHOUSE_MANAGER" | "DELIVERY_AGENT" | "PPMV_OWNER";

interface NavItem {
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  label: string;
  href?: string;
  external?: boolean;
  badge?: string;
  children?: { label: string; href: string }[];
  /**
   * Which roles can see this nav section. Omit entirely to show to
   * everyone (e.g. Dashboard, Settings). SUPER_ADMIN/ORG_ADMIN always
   * see every section regardless of what's listed here — see
   * `canSee()` below.
   */
  roles?: Role[];
}

const NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" }, // visible to all roles

  {
    icon: Package, label: "Inventory",
    roles: ["WAREHOUSE_MANAGER", "INVENTORY_MANAGER", "DISTRIBUTOR_ADMIN", "PHARMACIST"],
    children: [
      { label: "Products",       href: "/inventory/products" },
      { label: "Batches",        href: "/inventory/batches" },
      { label: "Warehouses",     href: "/inventory/warehouses" },
      { label: "Transfers",      href: "/inventory/transfers" },
      { label: "Reconciliation", href: "/inventory/reconciliation" },
    ],
  },
  {
    icon: QrCode, label: "GTIN & Barcode",
    roles: ["WAREHOUSE_MANAGER", "INVENTORY_MANAGER"],
    children: [
      { label: "GTIN Manager",  href: "/gtin/manager" },
      { label: "Generator",     href: "/gtin/generator" },
      { label: "Scanner",       href: "/gtin/scanner" },
      { label: "Labels",        href: "/gtin/labels" },
    ],
  },
  {
    icon: ClipboardList, label: "Procurement",
    roles: ["DISTRIBUTOR_ADMIN", "PHARMACIST", "WAREHOUSE_MANAGER", "INVENTORY_MANAGER"],
    children: [
      { label: "Dashboard",  href: "/procurement/dashboard" },
      { label: "Suppliers",  href: "/procurement/suppliers" },
      { label: "RFQ",        href: "/procurement/rfq" },
      { label: "Orders",     href: "/procurement/orders" },
      { label: "Approvals",  href: "/procurement/approvals" },
    ],
  },
  {
    icon: Truck, label: "Fulfillment",
    roles: ["DISTRIBUTOR_ADMIN", "WAREHOUSE_MANAGER", "DELIVERY_AGENT"],
    children: [
      { label: "Dashboard", href: "/fulfillment/dashboard" },
      { label: "Orders",    href: "/fulfillment/orders" },
      { label: "Dispatch",  href: "/fulfillment/dispatch" },
      { label: "Tracking",  href: "/fulfillment/tracking" },
    ],
  },
  {
    icon: TrendingUp, label: "Sales",
    roles: ["DISTRIBUTOR_ADMIN", "PHARMACIST", "INVENTORY_MANAGER", "BILLING_OFFICER"],
    children: [
      { label: "Dashboard", href: "/sales/dashboard" },
      { label: "Products",  href: "/sales/products" },
      { label: "Pharmacy",  href: "/sales/pharmacy" },
      { label: "PPMV",      href: "/sales/ppmv" },
      { label: "Regional",  href: "/sales/regional" },
    ],
  },
  {
    icon: Stethoscope, label: "Telehealth",
    roles: ["DOCTOR", "NURSE", "PHARMACIST", "RADIOLOGIST", "LAB_TECHNICIAN"],
    children: [
      { label: "Dashboard",      href: "/telehealth/dashboard" },
      { label: "Prescriptions",  href: "/telehealth/prescriptions" },
      { label: "Availability",   href: "/telehealth/availability" },
    ],
  },
  {
    icon: Store, label: "PPMV Portal",
    roles: ["PPMV_OWNER", "DISTRIBUTOR_ADMIN"],
    children: [
      { label: "Dashboard",  href: "/ppmv/dashboard" },
      { label: "Inventory",  href: "/ppmv/inventory" },
      { label: "Orders",     href: "/ppmv/orders" },
    ],
  },
  {
    icon: ShieldCheck, label: "Compliance",
    roles: [], // No real "auditor" role exists in ROLE_DASHBOARD today — visible only to SUPER_ADMIN/ORG_ADMIN via the always-visible rule until a compliance-specific role exists.
    children: [
      { label: "Dashboard",     href: "/compliance/dashboard" },
      { label: "Audit Logs",    href: "/compliance/audit" },
      { label: "Recalls",       href: "/compliance/recalls" },
      { label: "Traceability",  href: "/compliance/traceability" },
    ],
  },
  { icon: BarChart2, label: "Reports", href: "/reports", roles: ["DISTRIBUTOR_ADMIN", "PHARMACIST", "INVENTORY_MANAGER", "BILLING_OFFICER"] },
  {
    icon: Code2, label: "API & Integrations",
    roles: [], // platform-admin only — SUPER_ADMIN/ORG_ADMIN see it via the always-visible rule, no operational role needs it
    children: [
      { label: "Dashboard",  href: "/api/dashboard" },
      { label: "API Keys",   href: "/api/keys" },
      { label: "Webhooks",   href: "/api/webhooks" },
    ],
  },
  {
    icon: Users, label: "Admin",
    roles: ["HR_MANAGER"], // HR_MANAGER manages users; SUPER_ADMIN/ORG_ADMIN also see this via the always-visible rule
    children: [
      { label: "Users",          href: "/admin/users" },
      { label: "Roles",          href: "/admin/roles" },
      { label: "Organizations",  href: "/admin/organizations" },
      { label: "Billing",        href: "/admin/billing" },
    ],
  },
  {
    icon: ShoppingBag, label: "Medicine Shop",
    href: "/shop", badge: "NEW",
    roles: ["PPMV_OWNER", "PHARMACIST", "DISTRIBUTOR_ADMIN", "PATIENT"],
  },
];

interface SidebarProps {
  onCollapsedChange?: (c: boolean) => void;
  onNavigate?: () => void;
}

export function Sidebar({ onCollapsedChange, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const userRoles = useAuthStore(s => s.user?.roles ?? []);

  useEffect(() => { onNavigate?.(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (next) setOpen(null);
    onCollapsedChange?.(next);
  };

  const isActive  = (href: string) => pathname === href || pathname?.startsWith(href + "/");
  const sectionActive = (item: NavItem) => {
    if (item.href) return isActive(item.href);
    return item.children?.some(c => isActive(c.href)) ?? false;
  };

  // SUPER_ADMIN and ORG_ADMIN always see every nav section, since they're
  // platform/org-wide administrators. Everyone else only sees sections
  // whose `roles` list includes one of their roles. A section with no
  // `roles` field at all (undefined) is visible to everyone — used for
  // universal items like Dashboard and Settings.
  const canSee = (item: NavItem) => {
    if (userRoles.includes("SUPER_ADMIN") || userRoles.includes("ORG_ADMIN")) return true;
    if (!item.roles) return true; // no restriction declared
    return item.roles.some(r => userRoles.includes(r));
  };

  const visibleNav = NAV.filter(canSee);

  return (
    <aside style={{
      width: collapsed ? 64 : 240,
      height: "100vh",
      background: "var(--bg-base)",
      borderRight: "1px solid var(--bd-1)",
      display: "flex", flexDirection: "column",
      transition: "width 0.25s cubic-bezier(0.16,1,0.3,1)",
      overflow: "hidden",
    }}>
      {/* Brand */}
      <div style={{ height:56, display:"flex", alignItems:"center", padding: collapsed ? "0 0 0 14px" : "0 16px", borderBottom:"1px solid var(--bd-1)", flexShrink:0 }}>
        <KlaxonMark size="sm" wordmark={!collapsed} />
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"10px 8px", display:"flex", flexDirection:"column", gap:1, overflowY:"auto", overflowX:"hidden" }}>
        {visibleNav.map((item) => {
          const active = sectionActive(item);
          const Icon = item.icon;
          const hasChildren = !!item.children;
          const isOpen = open === item.label;

          if (!hasChildren) {
            return (
              <Link key={item.label} href={item.href!}
                title={collapsed ? item.label : undefined}
                className={`nav-item${active ? " active" : ""}`}
                style={{ justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "9px 0" : "8px 12px", whiteSpace:"nowrap", position:"relative" }}>
                <Icon style={{ width:16, height:16, flexShrink:0 }} />
                {!collapsed && <span style={{ flex:1 }}>{item.label}</span>}
                {!collapsed && item.badge && (
                  <span style={{ fontSize:9, fontWeight:700, fontFamily:"'DM Mono',monospace", background:"var(--k)", color:"#07080a", borderRadius:99, padding:"1px 6px", letterSpacing:"0.04em" }}>{item.badge}</span>
                )}
              </Link>
            );
          }

          return (
            <div key={item.label}>
              <button
                onClick={() => !collapsed && setOpen(isOpen ? null : item.label)}
                title={collapsed ? item.label : undefined}
                style={{
                  width:"100%", display:"flex", alignItems:"center", gap:10,
                  padding: collapsed ? "9px 0" : "8px 12px",
                  borderRadius:10, border:"none", cursor:"pointer",
                  fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:13,
                  justifyContent: collapsed ? "center" : "flex-start",
                  whiteSpace:"nowrap", transition:"all 0.15s",
                  background: active ? "var(--k-subtle)" : "transparent",
                  color: active ? "var(--k)" : "var(--tx-2)",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background="var(--bg-hover)"; e.currentTarget.style.color="var(--tx-1)"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--tx-2)"; } }}
              >
                <Icon style={{ width:16, height:16, flexShrink:0 }} />
                {!collapsed && (
                  <>
                    <span style={{ flex:1, textAlign:"left" }}>{item.label}</span>
                    <ChevronDown style={{ width:12, height:12, flexShrink:0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.2s" }} />
                  </>
                )}
              </button>

              {!collapsed && isOpen && (
                <div style={{ paddingLeft:12, marginTop:1, display:"flex", flexDirection:"column", gap:1 }}>
                  {item.children!.map(child => (
                    <Link key={child.href} href={child.href}
                      onClick={() => onNavigate?.()}
                      className={`nav-item${isActive(child.href) ? " active" : ""}`}
                      style={{ fontSize:12, padding:"7px 12px", whiteSpace:"nowrap" }}>
                      <span style={{ width:4, height:4, borderRadius:"50%", flexShrink:0, background: isActive(child.href) ? "var(--k)" : "var(--tx-3)" }} />
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding:"8px 8px 14px", borderTop:"1px solid var(--bd-1)", display:"flex", flexDirection:"column", gap:2, flexShrink:0 }}>
        <Link href="/settings" title={collapsed ? "Settings" : undefined}
          className={`nav-item${pathname === "/settings" ? " active" : ""}`}
          style={{ justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "9px 0" : "8px 12px" }}>
          <Settings style={{ width:16, height:16, flexShrink:0 }} />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button onClick={toggle} title={collapsed ? "Expand" : "Collapse"}
          style={{ display:"flex", alignItems:"center", justifyContent: collapsed ? "center" : "flex-start", gap:10, padding: collapsed ? "9px 0" : "8px 12px", borderRadius:10, background:"transparent", border:"1px solid transparent", cursor:"pointer", color:"var(--tx-3)", fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:500, transition:"all 0.15s", width:"100%" }}
          onMouseEnter={e => { e.currentTarget.style.background="var(--bg-hover)"; e.currentTarget.style.color="var(--tx-1)"; }}
          onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--tx-3)"; }}>
          {collapsed
            ? <ChevronRight style={{ width:16, height:16, flexShrink:0 }} />
            : <><ChevronLeft style={{ width:16, height:16, flexShrink:0 }} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}