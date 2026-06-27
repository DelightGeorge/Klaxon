"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useExpiringBatches, type Batch } from "@/lib/hooks/use-inventory";
import { useApi } from "@/lib/hooks/use-api";
import { Package, AlertTriangle, Loader2 } from "lucide-react";

interface BatchRow extends Batch {
  product?: { name: string; unit: string };
}

export default function BatchesPage() {
  const [daysFilter, setDaysFilter] = useState(90);
  const { data: expiring, loading: expLoading } =
    useExpiringBatches(daysFilter);

  // All batches from inventory endpoint
  const { data: allBatches, loading: allLoading } = useApi<BatchRow[]>(
    "/inventory/batches",
    [],
  );

  const batches: BatchRow[] =
    Array.isArray(allBatches) && allBatches.length > 0
      ? allBatches
      : Array.isArray(expiring)
        ? expiring
        : [];

  const loading = expLoading || allLoading;

  const isExpiringSoon = (b: BatchRow) => {
    const days = Math.ceil(
      (new Date(b.expiryDate).getTime() - Date.now()) / 86400000,
    );
    return days <= daysFilter && days > 0;
  };

  const cols: Col<BatchRow>[] = [
    {
      key: "batchNumber",
      header: "Batch No.",
      render: (r) => (
        <span
          style={{
            fontFamily: "'DM Mono',monospace",
            fontSize: 12,
            color: "var(--k)",
          }}
        >
          {r.batchNumber}
        </span>
      ),
    },
    {
      key: "product" as keyof BatchRow,
      header: "Product",
      render: (r) => (
        <div>
          <p style={{ fontSize: 12, fontWeight: 600 }}>
            {r.product?.name ?? "—"}
          </p>
          <p
            style={{
              fontSize: 10,
              color: "var(--tx-3)",
              fontFamily: "'DM Mono',monospace",
            }}
          >
            {r.product?.unit}
          </p>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Total Qty",
      render: (r) => (
        <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700 }}>
          {r.quantity.toLocaleString()}
        </span>
      ),
    },
    {
      key: "remainingQuantity",
      header: "Remaining",
      render: (r) => (
        <span
          style={{
            fontFamily: "'DM Mono',monospace",
            color:
              r.remainingQuantity < r.quantity * 0.2
                ? "var(--amber)"
                : "var(--tx-1)",
            fontWeight: 600,
          }}
        >
          {r.remainingQuantity.toLocaleString()}
        </span>
      ),
    },
    {
      key: "expiryDate",
      header: "Expiry",
      render: (r) => {
        const days = Math.ceil(
          (new Date(r.expiryDate).getTime() - Date.now()) / 86400000,
        );
        const isExpired = days <= 0;
        return (
          <div>
            <p
              style={{
                fontSize: 12,
                color: isExpired
                  ? "#f43f5e"
                  : days <= 30
                    ? "var(--amber)"
                    : "var(--tx-1)",
              }}
            >
              {new Date(r.expiryDate).toLocaleDateString("en-GB")}
            </p>
            <p style={{ fontSize: 10, color: "var(--tx-3)" }}>
              {isExpired ? "Expired" : `${days}d left`}
            </p>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "id",
      header: "",
      render: (r) =>
        isExpiringSoon(r) ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: "var(--amber)",
            }}
          >
            <AlertTriangle style={{ width: 12, height: 12 }} /> Expiring
          </div>
        ) : null,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Batch Tracking"
        subtitle="Monitor all drug batches and expiry dates"
        badge="LIVE"
        badgeVariant="green"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          { label: "Total Batches", value: batches.length, color: "var(--k)" },
          {
            label: `Expiring (${daysFilter}d)`,
            value: batches.filter(isExpiringSoon).length,
            color: "var(--amber)",
          },
          {
            label: "Expired",
            value: batches.filter((b) => new Date(b.expiryDate) < new Date())
              .length,
            color: "#f43f5e",
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

      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 14,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "var(--tx-3)",
            fontFamily: "'DM Mono',monospace",
          }}
        >
          EXPIRY WINDOW:
        </span>
        {[30, 60, 90, 180].map((d) => (
          <button
            key={d}
            onClick={() => setDaysFilter(d)}
            style={{
              padding: "5px 12px",
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              border: "1px solid",
              transition: "all 0.15s",
              borderColor: daysFilter === d ? "var(--k)" : "var(--bd-1)",
              background: daysFilter === d ? "var(--k-subtle)" : "transparent",
              color: daysFilter === d ? "var(--k)" : "var(--tx-3)",
            }}
          >
            {d}d
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Loader2
            style={{ width: 24, height: 24, color: "var(--k)" }}
            className="animate-spin"
          />
        </div>
      ) : batches.length === 0 ? (
        <div style={{ textAlign: "center", padding: 64 }}>
          <Package
            style={{
              width: 32,
              height: 32,
              color: "var(--tx-3)",
              margin: "0 auto 12px",
            }}
          />
          <p style={{ fontSize: 13, color: "var(--tx-3)" }}>No batches found</p>
        </div>
      ) : (
        <DataTable
          columns={cols}
          data={batches}
          searchKeys={["batchNumber"] as (keyof BatchRow)[]}
        />
      )}
    </div>
  );
}
