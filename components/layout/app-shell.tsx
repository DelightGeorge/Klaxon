"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-root)",
      }}
    >
      {/* Sidebar manages its own collapse state and notifies us */}
      <Sidebar onCollapsedChange={setCollapsed} />

      {/* Topbar shifts with the sidebar */}
      <Topbar collapsed={collapsed} />

      {/* Page content */}
      <main
        style={{
          flex: 1,
          marginLeft: collapsed ? 64 : 240,
          marginTop: 56,
          padding: 24,
          minWidth: 0,
          transition: "margin-left 0.25s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
