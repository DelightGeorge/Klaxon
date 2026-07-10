"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:"var(--bg-root)" }}>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:150, display:"none" }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar — desktop always visible, mobile slides in */}
      <div
        className="sidebar-wrapper"
        style={{
          width: 220,
          flexShrink: 0,
          height: "100vh",
          overflowY: "auto",
          borderRight: "1px solid var(--bd-1)",
          background: "var(--bg-surface)",
          zIndex: 160,
        }}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="mobile-close-btn"
          style={{
            display: "none",
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--tx-3)",
            zIndex: 161,
          }}
        >
          <X style={{ width: 18, height: 18 }} />
        </button>
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-wrapper {
            position: fixed !important;
            top: 0;
            left: ${mobileOpen ? "0" : "-240px"} !important;
            transition: left 0.25s ease !important;
            box-shadow: 4px 0 40px rgba(0,0,0,0.4);
          }
          .mobile-overlay { display: block !important; }
          .mobile-close-btn { display: flex !important; }
          main { padding: 16px !important; }
        }
      `}</style>
    </div>
  );
}