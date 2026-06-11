// components/layout/topbar.tsx
"use client";

import { useState } from "react";
import { Bell, Search, LogOut, User, ChevronDown } from "lucide-react";

interface TopbarProps {
  collapsed: boolean;
}

export function Topbar({ collapsed }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const sidebarWidth = collapsed ? 64 : 240;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: sidebarWidth,
        right: 0,
        height: 56,
        background: "var(--bg-base)",
        borderBottom: "1px solid var(--bd-1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        zIndex: 40,
        transition: "left 0.25s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Search */}
      <div style={{ position: "relative", width: 260 }}>
        <Search
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            width: 13,
            height: 13,
            color: "var(--tx-3)",
          }}
        />
        <input
          placeholder="Search anything..."
          className="kx-input"
          style={{ paddingLeft: 30, height: 34, fontSize: 12 }}
        />
      </div>

      {/* Right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Notification bell */}
        <button
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "var(--bg-raised)",
            border: "1px solid var(--bd-1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--bd-k)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--bd-1)")}
        >
          <Bell style={{ width: 14, height: 14, color: "var(--tx-2)" }} />
          {/* Unread indicator */}
          <span
            style={{
              position: "absolute",
              top: 7,
              right: 7,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--k)",
              border: "1.5px solid var(--bg-base)",
            }}
          />
        </button>

        {/* User avatar + dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "4px 10px 4px 4px",
              borderRadius: 9,
              background: "var(--bg-raised)",
              border: "1px solid var(--bd-1)",
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--bd-k)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--bd-1)")}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: "var(--k-subtle)",
                border: "1px solid var(--bd-k)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 11,
                  color: "var(--k)",
                }}
              >
                SA
              </span>
            </div>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: 12,
                color: "var(--tx-1)",
              }}
            >
              Super Admin
            </span>
            <ChevronDown
              style={{
                width: 12,
                height: 12,
                color: "var(--tx-3)",
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s",
              }}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                width: 180,
                background: "var(--bg-overlay)",
                border: "1px solid var(--bd-1)",
                borderRadius: 12,
                padding: 6,
                boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                zIndex: 100,
              }}
            >
              {[
                { icon: User,   label: "Profile" },
                { icon: LogOut, label: "Sign out", danger: true },
              ].map(({ icon: Icon, label, danger }) => (
                <button
                  key={label}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: danger ? "#f43f5e" : "var(--tx-2)",
                    fontSize: 13,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    transition: "background 0.15s, color 0.15s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = danger
                      ? "rgba(244,63,94,0.08)"
                      : "var(--bg-hover)";
                    e.currentTarget.style.color = danger ? "#f43f5e" : "var(--tx-1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = danger ? "#f43f5e" : "var(--tx-2)";
                  }}
                >
                  <Icon style={{ width: 14, height: 14 }} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 99 }}
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </header>
  );
}