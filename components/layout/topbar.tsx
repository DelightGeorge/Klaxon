"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Search, LogOut, User, Settings, ChevronDown, X, Check, Loader2, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { useApi } from "@/lib/hooks/use-api";
import { api } from "@/lib/api";

interface Notification {
  id: string; title?: string; message?: string;
  read?: boolean; createdAt?: string; type?: string;
}

interface TopbarProps {
  
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const logout = useAuthStore(s => s.logout);
  const user   = useAuthStore(s => s.user);

  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [loggingOut,    setLoggingOut]    = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const { data: notifData, refetch: refetchNotifs } = useApi<{ notifications?: Notification[]; data?: Notification[] }>("/notifications", { notifications: [] });
  const { data: countData, refetch: refetchCount }  = useApi<{ count?: number }>("/notifications/unread-count", { count: 0 });

  const notifications = notifData?.notifications ?? notifData?.data ?? [];
  const unreadCount   = countData?.count ?? 0;

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "SA";
  const displayName = user ? `${user.firstName} ${user.lastName}` : "Super Admin";
  const rawRole = (user?.roles as unknown as (string | { role?: { name?: string } })[] | undefined)?.[0];
  const roleName =
    (typeof rawRole === "string" ? rawRole : rawRole?.role?.name)
      ?.replace(/_/g, " ") ?? "Super Admin";

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.replace("/login");
  };

  const handleMarkOne = async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    refetchNotifs();
    refetchCount();
  };

  const handleMarkAll = async () => {
    await api.patch("/notifications/read-all");
    refetchNotifs();
    refetchCount();
  };

  // Global keyboard shortcut: Cmd/Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const SEARCH_SHORTCUTS = [
    { label: "Drug Inventory",    href: "/inventory/products" },
    { label: "Fulfillment Orders",href: "/fulfillment/orders" },
    { label: "GTIN Manager",      href: "/gtin/manager" },
    { label: "User Management",   href: "/admin/users" },
    { label: "Procurement",       href: "/procurement/dashboard" },
    { label: "Analytics",         href: "/sales/dashboard" },
  ].filter(s => !searchQuery || s.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <header style={{
      position: "sticky", top: 0,
      height: 56, background: "var(--bg-base)", borderBottom: "1px solid var(--bd-1)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 20px", zIndex: 40,
      
    }}>

      {/* Left: mobile menu button + search */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 34, height: 34, borderRadius: 9,
              background: "var(--bg-raised)", border: "1px solid var(--bd-1)",
              cursor: "pointer", transition: "border-color 0.15s", flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--bd-k)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--bd-1)")}>
            <Menu style={{ width: 15, height: 15, color: "var(--tx-2)" }} />
          </button>
        )}

        {/* Search */}
        <div style={{ position: "relative", width: "min(280px, calc(100vw - 220px))" }}>
          <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "var(--tx-3)", pointerEvents: "none" }} />
          <input
            ref={searchRef}
            placeholder="Search… (⌘K)"
            className="kx-input"
            style={{ paddingLeft: 30, paddingRight: 36, height: 34, fontSize: 12 }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchQuery(searchQuery)}
            onBlur={() => setTimeout(() => setSearchQuery(""), 200)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--tx-3)", display: "flex", padding: 0 }}>
              <X style={{ width: 12, height: 12 }} />
            </button>
          )}

          {/* Search dropdown */}
          {searchQuery.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
              background: "var(--bg-overlay)", border: "1px solid var(--bd-1)",
              borderRadius: 12, padding: 6, boxShadow: "0 16px 40px rgba(0,0,0,0.4)", zIndex: 200,
            }}>
              {SEARCH_SHORTCUTS.length === 0 ? (
                <p style={{ padding: "8px 10px", fontSize: 12, color: "var(--tx-3)" }}>No results found</p>
              ) : SEARCH_SHORTCUTS.map(s => (
                <Link key={s.href} href={s.href}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, textDecoration: "none", color: "var(--tx-1)", fontSize: 13, transition: "background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <Search style={{ width: 12, height: 12, color: "var(--tx-3)" }} />
                  {s.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen(v => !v); setDropdownOpen(false); }}
            style={{
              width: 34, height: 34, borderRadius: 9,
              background: "var(--bg-raised)", border: "1px solid var(--bd-1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", position: "relative", transition: "border-color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--bd-k)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--bd-1)")}>
            <Bell style={{ width: 14, height: 14, color: "var(--tx-2)" }} />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 5, right: 5,
                minWidth: 14, height: 14, borderRadius: 7, padding: "0 3px",
                background: "var(--k)", border: "1.5px solid var(--bg-base)",
                fontSize: 9, fontWeight: 700, color: "#07080a",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Mono', monospace",
              }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification panel */}
          {notifOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              width: 360, maxHeight: 480,
              background: "var(--bg-overlay)", border: "1px solid var(--bd-1)",
              borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              zIndex: 200, display: "flex", flexDirection: "column", overflow: "hidden",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--bd-1)" }}>
                <div>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: "var(--tx-1)" }}>Notifications</p>
                  {unreadCount > 0 && <p style={{ fontSize: 11, color: "var(--tx-3)", marginTop: 1 }}>{unreadCount} unread</p>}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAll} className="btn-secondary btn-sm" style={{ fontSize: 11, padding: "3px 8px" }}>
                      <Check style={{ width: 11, height: 11 }} /> Mark all read
                    </button>
                  )}
                  <Link href="/notifications" onClick={() => setNotifOpen(false)}
                    style={{ fontSize: 11, color: "var(--k)", textDecoration: "none", display: "flex", alignItems: "center" }}>
                    View all
                  </Link>
                </div>
              </div>

              <div style={{ overflowY: "auto", flex: 1 }}>
                {notifications.length === 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 8 }}>
                    <Bell style={{ width: 24, height: 24, color: "var(--tx-3)" }} />
                    <p style={{ fontSize: 12, color: "var(--tx-3)" }}>All caught up</p>
                  </div>
                ) : notifications.slice(0, 8).map((n: Notification, i: number) => (
                  <div key={n.id} onClick={() => !n.read && handleMarkOne(n.id)}
                    style={{
                      display: "flex", gap: 10, padding: "12px 16px",
                      borderBottom: i < Math.min(notifications.length, 8) - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      background: n.read ? "transparent" : "rgba(20,184,142,0.03)",
                      cursor: n.read ? "default" : "pointer",
                    }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", marginTop: 4, flexShrink: 0, background: n.read ? "var(--tx-3)" : "var(--k)", boxShadow: n.read ? "none" : "0 0 6px var(--k)" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: n.read ? 400 : 600, color: "var(--tx-1)", lineHeight: 1.3 }}>{n.title ?? "Notification"}</p>
                      <p style={{ fontSize: 11, color: "var(--tx-3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.message}</p>
                      <p style={{ fontSize: 10, color: "var(--tx-3)", marginTop: 3, fontFamily: "'DM Mono',monospace" }}>
                        {n.createdAt ? new Date(n.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setDropdownOpen(v => !v); setNotifOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "4px 10px 4px 4px", borderRadius: 9,
              background: "var(--bg-raised)", border: "1px solid var(--bd-1)",
              cursor: "pointer", transition: "border-color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--bd-k)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--bd-1)")}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: "var(--k-subtle)", border: "1px solid var(--bd-k)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 11, color: "var(--k)" }}>{initials}</span>
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 12, color: "var(--tx-1)", lineHeight: 1.2 }}>{displayName}</p>
              <p style={{ fontSize: 10, color: "var(--tx-3)", lineHeight: 1, fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: "0.04em" }}>{roleName}</p>
            </div>
            <ChevronDown style={{ width: 12, height: 12, color: "var(--tx-3)", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }} />
          </button>

          {dropdownOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", right: 0, width: 200,
              background: "var(--bg-overlay)", border: "1px solid var(--bd-1)",
              borderRadius: 12, padding: 6, boxShadow: "0 16px 40px rgba(0,0,0,0.4)", zIndex: 200,
            }}>
              {/* User info header */}
              <div style={{ padding: "8px 10px 10px", borderBottom: "1px solid var(--bd-1)", marginBottom: 4 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--tx-1)" }}>{displayName}</p>
                <p style={{ fontSize: 11, color: "var(--tx-3)", marginTop: 1, fontFamily: "'DM Mono',monospace" }}>{user?.email ?? ""}</p>
              </div>

              {[
                { icon: User,     label: "Profile",  href: "/settings" },
                { icon: Settings, label: "Settings", href: "/settings" },
              ].map(({ icon: Icon, label, href }) => (
                <Link key={label} href={href} onClick={() => setDropdownOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, textDecoration: "none", color: "var(--tx-2)", fontSize: 13, fontFamily: "'DM Sans',sans-serif", fontWeight: 500, transition: "background 0.15s, color 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--tx-1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--tx-2)"; }}>
                  <Icon style={{ width: 14, height: 14 }} />
                  {label}
                </Link>
              ))}

              <div style={{ borderTop: "1px solid var(--bd-1)", marginTop: 4, paddingTop: 4 }}>
                <button onClick={handleLogout} disabled={loggingOut}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 9,
                    padding: "8px 10px", borderRadius: 8, background: "transparent",
                    border: "none", cursor: "pointer", color: "#f43f5e", fontSize: 13,
                    fontFamily: "'DM Sans',sans-serif", fontWeight: 500, transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(244,63,94,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  {loggingOut
                    ? <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" />
                    : <LogOut style={{ width: 14, height: 14 }} />}
                  {loggingOut ? "Signing out…" : "Sign out"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click-outside overlays */}
      {(dropdownOpen || notifOpen) && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99 }}
          onClick={() => { setDropdownOpen(false); setNotifOpen(false); }} />
      )}
    </header>
  );
}