"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg-root)" }}>

      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:45, backdropFilter:"blur(2px)" }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: "fixed", top:0, left:0, bottom:0, zIndex:50,
        transform: isMobile && !mobileOpen ? "translateX(-100%)" : "translateX(0)",
        transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <Sidebar
          onCollapsedChange={setCollapsed}
          onNavigate={() => setMobileOpen(false)}
        />
      </div>

      {/* Right side */}
      <div style={{
        flex:1,
        marginLeft: isMobile ? 0 : (collapsed ? 64 : 240),
        transition: "margin-left 0.25s cubic-bezier(0.16,1,0.3,1)",
        display:"flex", flexDirection:"column", minWidth:0,
      }}>
        <Topbar
          onMenuClick={isMobile ? () => setMobileOpen(v => !v) : undefined}
        />
        <main style={{
          flex:1,
          
          padding: isMobile ? "16px 14px" : 24,
          minWidth:0,
          overflowX:"hidden",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}