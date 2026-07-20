"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_USERS } from "@/lib/mock-data";
import { useOrgStaff } from "@/lib/hooks/use-users";
import { api } from "@/lib/api";
import { UserPlus, X, Loader2, Users, CheckCircle, Ban } from "lucide-react";

type User = {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
  roles?: (string | { role?: { name?: string } })[];
  org?: string;
  organizationName?: string;
  status?: string;
  lastLogin?: string;
  lastLoginAt?: string;
};

const ROLES = [
  "SUPER_ADMIN",
  "ORG_ADMIN",
  "DOCTOR",
  "PHARMACIST",
  "DISTRIBUTOR_ADMIN",
  "WAREHOUSE_MANAGER",
  "PPMV_OWNER",
  "NURSE",
  "RECEPTIONIST",
];

function InviteModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "PHARMACIST",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const update =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((v) => ({ ...v, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/organizations/staff/invite", form);
      setSent(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to send invite",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          borderRadius: 20,
          padding: 32,
          width: "100%",
          maxWidth: 440,
          border: "1px solid var(--bd-1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--tx-1)",
              }}
            >
              Invite User
            </h2>
            <p style={{ fontSize: 12, color: "var(--tx-3)", marginTop: 2 }}>
              Send an invitation email
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--tx-3)",
            }}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <CheckCircle
              style={{
                width: 40,
                height: 40,
                color: "var(--k)",
                margin: "0 auto 12px",
              }}
            />
            <p
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--tx-1)",
              }}
            >
              Invitation sent!
            </p>
            <p style={{ fontSize: 12, color: "var(--tx-3)", marginTop: 4 }}>
              They will receive an email to join Klaxon.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "rgba(244,63,94,0.08)",
                  border: "1px solid rgba(244,63,94,0.2)",
                  color: "#f43f5e",
                  fontSize: 12,
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {[
                  { label: "First Name", key: "firstName" },
                  { label: "Last Name", key: "lastName" },
                ].map((f) => (
                  <div
                    key={f.key}
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <label
                      style={{
                        fontSize: 11,
                        fontFamily: "'DM Mono',monospace",
                        color: "var(--tx-3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {f.label}
                    </label>
                    <input
                      value={form[f.key as keyof typeof form]}
                      onChange={update(f.key)}
                      className="kx-input"
                      required
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label
                  style={{
                    fontSize: 11,
                    fontFamily: "'DM Mono',monospace",
                    color: "var(--tx-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  className="kx-input"
                  required
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label
                  style={{
                    fontSize: 11,
                    fontFamily: "'DM Mono',monospace",
                    color: "var(--tx-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={update("role")}
                  className="kx-input"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "flex-end",
                  marginTop: 4,
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary btn-sm"
                >
                  {loading ? (
                    <Loader2
                      style={{ width: 14, height: 14 }}
                      className="animate-spin"
                    />
                  ) : (
                    <UserPlus style={{ width: 14, height: 14 }} />
                  )}
                  {loading ? "Sending…" : "Send Invite"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState("All");
  const { data, loading, refetch } = useOrgStaff();

  const apiUsers = (data ?? []) as User[];
  const users: User[] = apiUsers.length > 0 ? apiUsers : MOCK_USERS;

  // Safely extract a plain role-name string whether `roles` holds
  // plain strings (legacy/mock shape) or { role: { name } } objects
  // (live API shape from useOrgStaff). Never returns an object.
  const roleOf = (u: User): string => {
    if (u.role) return u.role;
    const r = u.roles?.[0];
    if (!r) return "Unknown";
    if (typeof r === "string") return r;
    return r.role?.name ?? "Unknown";
  };

  const allRoles = [
    "All",
    ...Array.from(
      new Set(users.map((u) => roleOf(u))),
    ),
  ];
  const filtered =
    roleFilter === "All"
      ? users
      : users.filter((u) => roleOf(u) === roleFilter);

  const handleAction = async (
    userId: string,
    action: "suspend" | "activate",
  ) => {
    setActionLoading(userId + action);
    try {
      await api.patch(`/admin/users/${userId}/${action}`);
      refetch();
    } catch {
      /* ignore */
    } finally {
      setActionLoading(null);
    }
  };

  const getName = (u: User) =>
    u.name ?? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  const getRole = (u: User) => roleOf(u).replace(/_/g, " ");
  const getStatus = (u: User) => u.status ?? "Active";

  const cols: Col<User>[] = [
    {
      key: "id",
      header: "ID",
      width: "80px",
      render: (r) => (
        <span
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 11,
            color: "var(--tx-3)",
          }}
        >
          {r.id}
        </span>
      ),
    },
    {
      key: "name",
      header: "User",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg,var(--k),#0d9472)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#07080a",
              fontFamily: "'Syne',sans-serif",
              flexShrink: 0,
            }}
          >
            {getName(r)
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 13 }}>{getName(r)}</p>
            <p
              style={{
                fontSize: 11,
                color: "var(--tx-3)",
                marginTop: 1,
                fontFamily: "'DM Mono',monospace",
              }}
            >
              {r.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (r) => <span className="badge badge-blue">{getRole(r)}</span>,
    },
    {
      key: "org",
      header: "Organisation",
      render: (r) => (
        <span style={{ fontSize: 12 }}>
          {r.org ?? r.organizationName ?? "—"}
        </span>
      ),
    },
    {
      key: "lastLogin",
      header: "Last Login",
      render: (r) => (
        <span style={{ fontSize: 11, color: "var(--tx-3)" }}>
          {r.lastLogin ??
            (r.lastLoginAt
              ? new Date(r.lastLoginAt).toLocaleDateString("en-GB")
              : "—")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={getStatus(r)} />,
    },
    {
      key: "action",
      header: "",
      render: (r) => (
        <div style={{ display: "flex", gap: 4 }}>
          {getStatus(r) === "Active" ? (
            <button
              onClick={() => handleAction(r.id, "suspend")}
              disabled={actionLoading === r.id + "suspend"}
              className="btn-danger btn-sm"
              style={{ padding: "4px 8px", fontSize: 11 }}
            >
              {actionLoading === r.id + "suspend" ? (
                <Loader2
                  style={{ width: 11, height: 11 }}
                  className="animate-spin"
                />
              ) : (
                <Ban style={{ width: 11, height: 11 }} />
              )}
              Suspend
            </button>
          ) : (
            <button
              onClick={() => handleAction(r.id, "activate")}
              disabled={actionLoading === r.id + "activate"}
              className="btn-secondary btn-sm"
              style={{ padding: "4px 8px", fontSize: 11 }}
            >
              {actionLoading === r.id + "activate" ? (
                <Loader2
                  style={{ width: 11, height: 11 }}
                  className="animate-spin"
                />
              ) : (
                <CheckCircle style={{ width: 11, height: 11 }} />
              )}
              Activate
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader badge="LIVE" badgeVariant="live"
        title="User Management"
        subtitle={`${users.length} platform users`}
        action={
          <button
            className="btn-primary btn-sm"
            onClick={() => setShowInvite(true)}
          >
            <UserPlus className="w-3.5 h-3.5" /> Invite User
          </button>
        }
      />

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          { label: "Total Users", value: users.length, color: "var(--k)" },
          {
            label: "Active",
            value: users.filter((u) => getStatus(u) === "Active").length,
            color: "#22c55e",
          },
          {
            label: "Inactive",
            value: users.filter((u) => getStatus(u) === "Inactive").length,
            color: "#f59e0b",
          },
          {
            label: "Pending",
            value: users.filter((u) => getStatus(u) === "Pending").length,
            color: "#3b82f6",
          },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "14px 16px" }}>
            <p
              style={{
                fontSize: 11,
                color: "var(--tx-3)",
                fontFamily: "'DM Mono',monospace",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 6,
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: 24,
                color: s.color,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Role filter */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}
      >
        {allRoles.slice(0, 8).map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            style={{
              padding: "5px 12px",
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "'DM Mono',monospace",
              cursor: "pointer",
              border: "1px solid",
              transition: "all 0.15s",
              borderColor: roleFilter === r ? "var(--k)" : "var(--bd-1)",
              background: roleFilter === r ? "var(--k-subtle)" : "transparent",
              color: roleFilter === r ? "var(--k)" : "var(--tx-3)",
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 64,
            gap: 12,
          }}
        >
          <Loader2
            style={{ width: 24, height: 24, color: "var(--k)" }}
            className="animate-spin"
          />
          <span style={{ fontSize: 13, color: "var(--tx-3)" }}>
            Loading users…
          </span>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 64,
            gap: 12,
          }}
        >
          <Users style={{ width: 32, height: 32, color: "var(--tx-3)" }} />
          <p style={{ fontSize: 13, color: "var(--tx-3)" }}>No users found</p>
        </div>
      ) : (
        <DataTable
          columns={cols}
          data={filtered}
          searchKeys={["email"] as (keyof User)[]}
        />
      )}

      {showInvite && (
        <InviteModal onClose={() => setShowInvite(false)} onSuccess={refetch} />
      )}
    </div>
  );
}