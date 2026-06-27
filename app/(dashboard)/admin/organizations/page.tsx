"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  useAdminOrganizations,
  useAdminApplications,
  useReviewApplication,
  useSuspendOrganization,
  type Organization,
  type OrgApplication,
} from "@/lib/hooks/use-users";
import {
  Building2,
  CheckCircle,
  XCircle,
  Loader2,
  Ban,
  Eye,
  X,
} from "lucide-react";

function ReviewModal({
  app,
  onClose,
  onSuccess,
}: {
  app: OrgApplication;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [action, setAction] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [reason, setReason] = useState("");
  const { mutate, loading, error } = useReviewApplication();

  const handleSubmit = async () => {
    const result = await mutate(
      {
        status: action,
        rejectionReason: action === "REJECTED" ? reason : undefined,
      },
      `/admin/applications/${app.id}/review`,
    );
    if (result) {
      onSuccess();
      onClose();
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
          maxWidth: 480,
          border: "1px solid var(--bd-1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              Review Application
            </h2>
            <p style={{ fontSize: 12, color: "var(--tx-3)", marginTop: 4 }}>
              {app.name} · {app.type}
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 20,
            padding: 16,
            borderRadius: 12,
            background: "var(--bg-raised)",
            border: "1px solid var(--bd-1)",
          }}
        >
          {[
            { label: "Contact", value: app.contactPerson },
            { label: "Email", value: app.email },
            { label: "Phone", value: app.phone ?? "—" },
            { label: "License", value: app.licenseNumber ?? "—" },
          ].map((f) => (
            <div key={f.label}>
              <p
                style={{
                  fontSize: 10,
                  color: "var(--tx-3)",
                  fontFamily: "'DM Mono',monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {f.label}
              </p>
              <p style={{ fontSize: 12, color: "var(--tx-1)", marginTop: 2 }}>
                {f.value}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {(["APPROVED", "REJECTED"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setAction(a)}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                border: "1px solid",
                borderColor:
                  action === a
                    ? a === "APPROVED"
                      ? "var(--k)"
                      : "#f43f5e"
                    : "var(--bd-1)",
                background:
                  action === a
                    ? a === "APPROVED"
                      ? "var(--k-subtle)"
                      : "rgba(244,63,94,0.08)"
                    : "transparent",
                color:
                  action === a
                    ? a === "APPROVED"
                      ? "var(--k)"
                      : "#f43f5e"
                    : "var(--tx-3)",
              }}
            >
              {a === "APPROVED" ? "✓ Approve" : "✕ Reject"}
            </button>
          ))}
        </div>

        {action === "REJECTED" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              marginBottom: 16,
            }}
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
              Rejection Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="kx-input"
              rows={3}
              placeholder="Explain why this application is being rejected..."
              style={{ resize: "none" }}
            />
          </div>
        )}

        {error && (
          <p style={{ fontSize: 12, color: "#f43f5e", marginBottom: 12 }}>
            {error}
          </p>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn-secondary btn-sm">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary btn-sm"
          >
            {loading ? (
              <Loader2
                style={{ width: 13, height: 13 }}
                className="animate-spin"
              />
            ) : null}
            Submit Decision
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrgsPage() {
  const [tab, setTab] = useState<"orgs" | "applications">("orgs");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const [reviewApp, setReviewApp] = useState<OrgApplication | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const {
    data: orgs,
    loading: orgsLoading,
    refetch: refetchOrgs,
  } = useAdminOrganizations(statusFilter);
  const {
    data: apps,
    loading: appsLoading,
    refetch: refetchApps,
  } = useAdminApplications("PENDING");
  const suspendOrg = useSuspendOrganization();

  const organizations = Array.isArray(orgs) ? orgs : [];
  const applications = Array.isArray(apps) ? apps : [];

  const handleSuspend = async (id: string) => {
    setActionLoading(id);
    await suspendOrg.mutate(undefined, `/admin/organizations/${id}/suspend`);
    setActionLoading(null);
    refetchOrgs();
  };

  const orgCols: Col<Organization>[] = [
    {
      key: "name",
      header: "Organization",
      render: (r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--k-subtle)",
              border: "1px solid var(--bd-k)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: 13,
              color: "var(--k)",
            }}
          >
            {r.name[0]}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</p>
            <p
              style={{
                fontSize: 11,
                color: "var(--tx-3)",
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
      key: "type",
      header: "Type",
      render: (r) => <span className="badge badge-blue">{r.type}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "id",
      header: "Staff",
      render: (r) => (
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>
          {r._count?.staff ?? 0}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (r) => (
        <span style={{ fontSize: 11, color: "var(--tx-3)" }}>
          {new Date(r.createdAt).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      key: "action" as keyof Organization,
      header: "",
      render: (r) => (
        <button
          onClick={() => handleSuspend(r.id)}
          disabled={actionLoading === r.id}
          className="btn-danger btn-sm"
          style={{ padding: "4px 8px", fontSize: 11 }}
        >
          {actionLoading === r.id ? (
            <Loader2
              style={{ width: 11, height: 11 }}
              className="animate-spin"
            />
          ) : (
            <Ban style={{ width: 11, height: 11 }} />
          )}
          Suspend
        </button>
      ),
    },
  ];

  const appCols: Col<OrgApplication>[] = [
    {
      key: "name",
      header: "Applicant",
      render: (r) => (
        <div>
          <p style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</p>
          <p style={{ fontSize: 11, color: "var(--tx-3)" }}>
            {r.contactPerson}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (r) => <span className="badge badge-blue">{r.type}</span>,
    },
    {
      key: "email",
      header: "Email",
      render: (r) => (
        <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace" }}>
          {r.email}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "createdAt",
      header: "Submitted",
      render: (r) => (
        <span style={{ fontSize: 11, color: "var(--tx-3)" }}>
          {new Date(r.createdAt).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      key: "action" as keyof OrgApplication,
      header: "",
      render: (r) => (
        <button
          onClick={() => setReviewApp(r)}
          className="btn-primary btn-sm"
          style={{ padding: "4px 10px", fontSize: 11 }}
        >
          <Eye style={{ width: 11, height: 11 }} /> Review
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Organizations"
        subtitle="Manage tenant organizations and applications"
        badge="LIVE"
        badgeVariant="green"
        action={
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span
              style={{
                fontSize: 11,
                fontFamily: "'DM Mono',monospace",
                color: "var(--tx-3)",
              }}
            >
              {applications.length} pending{" "}
              {applications.length === 1 ? "application" : "applications"}
            </span>
          </div>
        }
      />

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          {
            label: "Total Orgs",
            value: organizations.length,
            color: "var(--k)",
          },
          {
            label: "Active",
            value: organizations.filter((o) => o.status === "ACTIVE").length,
            color: "#22c55e",
          },
          {
            label: "Suspended",
            value: organizations.filter((o) => o.status === "SUSPENDED").length,
            color: "#f43f5e",
          },
          {
            label: "Pending Apps",
            value: applications.length,
            color: "#f59e0b",
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

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 2,
          marginBottom: 16,
          background: "var(--bg-raised)",
          padding: 4,
          borderRadius: 12,
          width: "fit-content",
        }}
      >
        {(
          [
            ["orgs", "Organizations"],
            ["applications", "Pending Applications"],
          ] as const
        ).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "7px 18px",
              borderRadius: 9,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              transition: "all 0.15s",
              background: tab === t ? "var(--bg-surface)" : "transparent",
              color: tab === t ? "var(--tx-1)" : "var(--tx-3)",
              boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.2)" : "none",
            }}
          >
            {label}
            {t === "applications" && applications.length > 0
              ? ` (${applications.length})`
              : ""}
          </button>
        ))}
      </div>

      {tab === "orgs" ? (
        <>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            {["All", "ACTIVE", "SUSPENDED", "PENDING"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s === "All" ? undefined : s)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1px solid",
                  transition: "all 0.15s",
                  borderColor:
                    (statusFilter ?? "All") === s ? "var(--k)" : "var(--bd-1)",
                  background:
                    (statusFilter ?? "All") === s
                      ? "var(--k-subtle)"
                      : "transparent",
                  color:
                    (statusFilter ?? "All") === s ? "var(--k)" : "var(--tx-3)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {orgsLoading ? (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 64 }}
            >
              <Loader2
                style={{ width: 24, height: 24, color: "var(--k)" }}
                className="animate-spin"
              />
            </div>
          ) : (
            <DataTable
              columns={orgCols}
              data={organizations}
              searchKeys={["name", "email"] as (keyof Organization)[]}
            />
          )}
        </>
      ) : appsLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Loader2
            style={{ width: 24, height: 24, color: "var(--k)" }}
            className="animate-spin"
          />
        </div>
      ) : applications.length === 0 ? (
        <div style={{ textAlign: "center", padding: 64 }}>
          <CheckCircle
            style={{
              width: 32,
              height: 32,
              color: "var(--k)",
              margin: "0 auto 12px",
            }}
          />
          <p
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            All caught up!
          </p>
          <p style={{ fontSize: 12, color: "var(--tx-3)", marginTop: 4 }}>
            No pending applications to review.
          </p>
        </div>
      ) : (
        <DataTable
          columns={appCols}
          data={applications}
          searchKeys={["name", "email"] as (keyof OrgApplication)[]}
        />
      )}

      {reviewApp && (
        <ReviewModal
          app={reviewApp}
          onClose={() => setReviewApp(null)}
          onSuccess={() => {
            refetchApps();
            refetchOrgs();
          }}
        />
      )}
    </div>
  );
}
