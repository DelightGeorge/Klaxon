"use client";
import { PageHeader } from "@/components/ui/page-header";
import { useOrgStaff } from "@/lib/hooks/use-users";
import { Loader2, Shield, Users, Eye, Lock, Unlock } from "lucide-react";

const ROLE_PERMISSIONS: Record<
  string,
  { label: string; perms: string[]; color: string }
> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    color: "#f43f5e",
    perms: [
      "All permissions",
      "Platform settings",
      "Manage all orgs",
      "Billing access",
      "Override anything",
    ],
  },
  ORG_ADMIN: {
    label: "Org Admin",
    color: "#a855f7",
    perms: [
      "Manage org users",
      "View all modules",
      "Edit org settings",
      "Approve purchases",
    ],
  },
  PHARMACIST: {
    label: "Pharmacist",
    color: "var(--k)",
    perms: [
      "Inventory access",
      "Dispensing",
      "GTIN scanning",
      "Compliance reports",
    ],
  },
  DOCTOR: {
    label: "Doctor",
    color: "#3b82f6",
    perms: ["Patient records", "Prescriptions", "Telehealth", "View inventory"],
  },
  DISTRIBUTOR_ADMIN: {
    label: "Distributor Admin",
    color: "#f59e0b",
    perms: [
      "Manage drugs list",
      "Process orders",
      "View fulfillment",
      "Revenue reports",
    ],
  },
  WAREHOUSE_MANAGER: {
    label: "Warehouse Manager",
    color: "#22c55e",
    perms: [
      "Stock management",
      "Batch tracking",
      "Transfers",
      "Reconciliation",
    ],
  },
  PPMV_OWNER: {
    label: "PPMV Owner",
    color: "#06b6d4",
    perms: [
      "PPMV dashboard",
      "Place orders",
      "View catalogue",
      "Track deliveries",
    ],
  },
  NURSE: {
    label: "Nurse",
    color: "#8b5cf6",
    perms: ["Patient records", "Basic dispensing", "View prescriptions"],
  },
  RECEPTIONIST: {
    label: "Receptionist",
    color: "#64748b",
    perms: ["Patient check-in", "Appointment management", "Basic lookups"],
  },
  LOGISTICS_COORD: {
    label: "Logistics Coord.",
    color: "#0ea5e9",
    perms: ["Fulfillment orders", "Dispatch", "Tracking", "Delivery updates"],
  },
  AUDITOR: {
    label: "Auditor",
    color: "#d97706",
    perms: [
      "Read-only access",
      "Audit logs",
      "Compliance reports",
      "Recall history",
    ],
  },
};

export default function RolesPage() {
  const { data: staff, loading } = useOrgStaff();
  const staffList = Array.isArray(staff) ? staff : [];

  // Count staff per role from real data
  const roleCounts: Record<string, number> = {};
  staffList.forEach((s) => {
    const role = s.roles?.[0];
    const roleName =
      typeof role === "string"
        ? role
        : ((role as { role?: { name?: string } })?.role?.name ?? "Unknown");
    roleCounts[roleName] = (roleCounts[roleName] ?? 0) + 1;
  });

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        subtitle="Role-based access control for your organisation"
        badge="LIVE"
        badgeVariant="green"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
        }}
      >
        {Object.entries(ROLE_PERMISSIONS).map(([key, role]) => {
          const count = roleCounts[key] ?? 0;
          return (
            <div
              key={key}
              className="card"
              style={{ cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--bd-k)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--bd-1)";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: `${role.color}15`,
                      border: `1px solid ${role.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Shield
                      style={{ width: 16, height: 16, color: role.color }}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        fontWeight: 700,
                        fontSize: 13,
                        color: "var(--tx-1)",
                      }}
                    >
                      {role.label}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 2,
                      }}
                    >
                      <Users
                        style={{ width: 10, height: 10, color: "var(--tx-3)" }}
                      />
                      {loading ? (
                        <Loader2
                          style={{
                            width: 10,
                            height: 10,
                            color: "var(--tx-3)",
                          }}
                          className="animate-spin"
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: 10,
                            color: "var(--tx-3)",
                            fontFamily: "'DM Mono',monospace",
                          }}
                        >
                          {count} {count === 1 ? "member" : "members"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "'DM Mono',monospace",
                    color: role.color,
                    background: `${role.color}15`,
                    padding: "3px 8px",
                    borderRadius: 6,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}
                >
                  {key.replace(/_/g, " ")}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {role.perms.map((perm, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      fontSize: 11,
                      color: "var(--tx-2)",
                    }}
                  >
                    {i === 0 && key === "SUPER_ADMIN" ? (
                      <Unlock
                        style={{
                          width: 10,
                          height: 10,
                          color: role.color,
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <Eye
                        style={{
                          width: 10,
                          height: 10,
                          color: "var(--tx-3)",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    {perm}
                  </div>
                ))}
              </div>

              {count === 0 && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: "var(--bg-raised)",
                    border: "1px solid var(--bd-1)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Lock
                    style={{ width: 10, height: 10, color: "var(--tx-3)" }}
                  />
                  <span style={{ fontSize: 10, color: "var(--tx-3)" }}>
                    No users with this role yet
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
