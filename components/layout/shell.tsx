"use client";
import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function Shell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const left = collapsed ? 64 : 240;

  return (
    <div style={{minHeight:"100vh",background:"var(--bg-root)"}}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <Topbar collapsed={collapsed} />
      <main style={{
        marginLeft:left, paddingTop:"var(--topbar)",
        transition:"margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
        minHeight:"100vh",
      }}>
        <div style={{padding:"28px 24px"}} className="animate-in">
          {children}
        </div>
      </main>
    </div>
  );
}