"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { KpiCard } from "@/components/ui/kpi-card";
import {
  useBillingStats,
  useInvoices,
  useRecordPayment,
  type Invoice,
} from "@/lib/hooks/use-billing";
import {
  DollarSign,
  CreditCard,
  Users,
  TrendingUp,
  Plus,
  Loader2,
  X,
} from "lucide-react";

function RecordPaymentModal({
  invoice,
  onClose,
  onSuccess,
}: {
  invoice: Invoice;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    amount: invoice.totalAmount,
    method: "BANK_TRANSFER",
    reference: "",
    notes: "",
  });
  const { mutate, loading, error } = useRecordPayment();

  const handleSubmit = async () => {
    const result = await mutate({ invoiceId: invoice.id, ...form });
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
          maxWidth: 420,
          border: "1px solid var(--bd-1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            Record Payment
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--tx-3)",
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Amount (₦)", key: "amount", type: "number" },
            { label: "Reference", key: "reference", type: "text" },
            { label: "Notes", key: "notes", type: "text" },
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
                type={f.type}
                value={(form as Record<string, unknown>)[f.key] as string}
                onChange={(e) =>
                  setForm((v) => ({
                    ...v,
                    [f.key]:
                      f.type === "number"
                        ? parseFloat(e.target.value)
                        : e.target.value,
                  }))
                }
                className="kx-input"
              />
            </div>
          ))}
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
              Payment Method
            </label>
            <select
              value={form.method}
              onChange={(e) =>
                setForm((v) => ({ ...v, method: e.target.value }))
              }
              className="kx-input"
            >
              {["BANK_TRANSFER", "PAYSTACK", "CASH", "CHEQUE"].map((m) => (
                <option key={m} value={m}>
                  {m.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error && (
          <p style={{ fontSize: 12, color: "#f43f5e", marginTop: 10 }}>
            {error}
          </p>
        )}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 20,
          }}
        >
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
            ) : null}{" "}
            Record Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);
  const { data: stats, loading: statsLoading } = useBillingStats();
  const {
    data: invoiceData,
    loading: invLoading,
    refetch,
  } = useInvoices(statusFilter);

  const invoices: Invoice[] = invoiceData?.invoices ?? [];

  const fmt = (n?: number) =>
    n !== undefined ? `₦${n.toLocaleString()}` : "—";

  const cols: Col<Invoice>[] = [
    {
      key: "id",
      header: "Invoice",
      render: (r) => (
        <span
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 11,
            color: "var(--k)",
          }}
        >
          #{r.id.slice(0, 8)}
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "Amount",
      render: (r) => (
        <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>
          {fmt(r.totalAmount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <StatusBadge
          status={
            r.status === "PAID"
              ? "Active"
              : r.status === "OVERDUE"
                ? "Expired"
                : "Pending"
          }
        />
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (r) => (
        <span style={{ fontSize: 11, color: "var(--tx-3)" }}>
          {r.dueDate ? new Date(r.dueDate).toLocaleDateString("en-GB") : "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (r) => (
        <span style={{ fontSize: 11, color: "var(--tx-3)" }}>
          {new Date(r.createdAt).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      key: "action" as keyof Invoice,
      header: "",
      render: (r) =>
        r.status !== "PAID" ? (
          <button
            onClick={() => setPayInvoice(r)}
            className="btn-primary btn-sm"
            style={{ padding: "4px 10px", fontSize: 11 }}
          >
            <Plus style={{ width: 11, height: 11 }} /> Pay
          </button>
        ) : (
          <span style={{ fontSize: 11, color: "var(--k)" }}>✓ Paid</span>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Billing & Subscriptions"
        subtitle="Platform subscription and invoice management"
        badge="LIVE"
        badgeVariant="green"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: "14px 16px",
                height: 80,
                background: "var(--bg-overlay)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))
        ) : (
          <>
            <KpiCard
              label="Revenue This Month"
              value={fmt(stats?.revenueThisMonth)}
              icon={<DollarSign className="w-4 h-4" />}
            />
            <KpiCard
              label="Total Invoices"
              value={stats?.totalInvoices ?? 0}
              icon={<CreditCard className="w-4 h-4" />}
              color="#3b82f6"
            />
            <KpiCard
              label="Paid"
              value={stats?.paidInvoices ?? 0}
              icon={<Users className="w-4 h-4" />}
              color="#22c55e"
            />
            <KpiCard
              label="Overdue"
              value={stats?.overdueInvoices ?? 0}
              icon={<TrendingUp className="w-4 h-4" />}
              color="#f43f5e"
            />
          </>
        )}
      </div>

      <div
        style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}
      >
        {["All", "PENDING", "PAID", "OVERDUE"].map((s) => (
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
              color: (statusFilter ?? "All") === s ? "var(--k)" : "var(--tx-3)",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {invLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Loader2
            style={{ width: 24, height: 24, color: "var(--k)" }}
            className="animate-spin"
          />
        </div>
      ) : (
        <DataTable
          columns={cols}
          data={invoices}
          searchKeys={["id"] as (keyof Invoice)[]}
        />
      )}

      {payInvoice && (
        <RecordPaymentModal
          invoice={payInvoice}
          onClose={() => setPayInvoice(null)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
