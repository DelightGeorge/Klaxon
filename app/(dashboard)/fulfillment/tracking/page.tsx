"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  useDeliveries,
  useUpdateDelivery,
  type Delivery,
} from "@/lib/hooks/use-orders";
import {
  Truck,
  MapPin,
  Loader2,
  RefreshCw,
  ChevronDown,
  Map,
  List,
  Navigation,
} from "lucide-react";

const DELIVERY_FLOW: Record<string, string[]> = {
  PENDING: ["PICKED_UP"],
  PICKED_UP: ["IN_TRANSIT"],
  IN_TRANSIT: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED", "FAILED"],
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "#f59e0b",
  PICKED_UP: "#3b82f6",
  IN_TRANSIT: "#a855f7",
  OUT_FOR_DELIVERY: "var(--k)",
  DELIVERED: "#22c55e",
  FAILED: "#f43f5e",
};

// Embed Google Maps via iframe for real deliveries or show a placeholder
function DeliveryMap({ deliveries }: { deliveries: Delivery[] }) {
  // Build a maps search URL using the most recent delivery address
  const activeDeliveries = deliveries.filter(
    (d) => !["DELIVERED", "FAILED"].includes(d.status),
  );
  const address = activeDeliveries[0]?.salesOrder?.deliveryAddress;

  if (!address) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-raised)",
        }}
      >
        <Navigation
          style={{
            width: 32,
            height: 32,
            color: "var(--tx-3)",
            marginBottom: 12,
          }}
        />
        <p
          style={{
            fontSize: 13,
            color: "var(--tx-3)",
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          No active deliveries to map
        </p>
        <p style={{ fontSize: 11, color: "var(--tx-3)" }}>
          Delivery addresses appear here once in transit
        </p>
      </div>
    );
  }

  // Use OpenStreetMap embed (no API key needed)
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=3.0,6.2,3.6,6.7&layer=mapnik&marker=6.45,3.30`;

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <iframe
        src={src}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: 12,
        }}
        title="Delivery Map"
      />
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "var(--bg-surface)",
          borderRadius: 10,
          padding: "8px 12px",
          border: "1px solid var(--bd-1)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <p
          style={{
            fontSize: 10,
            color: "var(--tx-3)",
            fontFamily: "'DM Mono',monospace",
            textTransform: "uppercase",
            marginBottom: 2,
          }}
        >
          Active Deliveries
        </p>
        <p
          style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 800,
            fontSize: 18,
            color: "var(--k)",
          }}
        >
          {activeDeliveries.length}
        </p>
      </div>
      {/* Overlaid delivery pins */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          right: 12,
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        {activeDeliveries.slice(0, 3).map((d) => (
          <div
            key={d.id}
            style={{
              background: "var(--bg-surface)",
              borderRadius: 8,
              padding: "5px 10px",
              border: "1px solid var(--bd-1)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: STATUS_COLOR[d.status] ?? "var(--k)",
                boxShadow: `0 0 6px ${STATUS_COLOR[d.status] ?? "var(--k)"}`,
              }}
            />
            <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace" }}>
              {d.trackingNumber?.slice(0, 8) ?? d.id.slice(0, 8)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const [updateForm, setUpdateForm] = useState<{
    deliveryId: string;
    status: string;
    location: string;
    notes: string;
    receivedBy: string;
  } | null>(null);
  const [view, setView] = useState<"list" | "map">("list");

  const { data, loading, refetch } = useDeliveries(statusFilter);
  const deliveries = Array.isArray(data) ? data : [];
  const updateDelivery = useUpdateDelivery();

  const handleUpdate = async () => {
    if (!updateForm) return;
    await updateDelivery.mutate(updateForm);
    setUpdateForm(null);
    refetch();
  };

  const counts = {
    total: deliveries.length,
    active: deliveries.filter(
      (d) => !["DELIVERED", "FAILED"].includes(d.status),
    ).length,
    delivered: deliveries.filter((d) => d.status === "DELIVERED").length,
    failed: deliveries.filter((d) => d.status === "FAILED").length,
  };

  return (
    <div>
      <PageHeader
        title="Delivery Tracking"
        subtitle="Monitor all active deliveries in real-time"
        badge="LIVE"
        badgeVariant="green"
        action={
          <div style={{ display: "flex", gap: 6 }}>
            <div
              style={{
                display: "flex",
                gap: 2,
                background: "var(--bg-raised)",
                padding: 3,
                borderRadius: 10,
              }}
            >
              {(
                [
                  ["list", List],
                  ["map", Map],
                ] as const
              ).map(([v, Icon]) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background:
                      view === v ? "var(--bg-surface)" : "transparent",
                    color: view === v ? "var(--tx-1)" : "var(--tx-3)",
                  }}
                >
                  <Icon style={{ width: 12, height: 12 }} />
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={refetch} className="btn-secondary btn-sm">
              <RefreshCw style={{ width: 13, height: 13 }} /> Refresh
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {[
          { label: "Total", value: counts.total, color: "var(--k)" },
          { label: "In Transit", value: counts.active, color: "#a855f7" },
          { label: "Delivered", value: counts.delivered, color: "#22c55e" },
          { label: "Failed", value: counts.failed, color: "#f43f5e" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "12px 16px" }}>
            <p
              style={{
                fontSize: 10,
                color: "var(--tx-3)",
                fontFamily: "'DM Mono',monospace",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 4,
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: 22,
                color: s.color,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Status filter pills */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}
      >
        {[
          "All",
          "PENDING",
          "PICKED_UP",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "FAILED",
        ].map((s) => (
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

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Loader2
            style={{ width: 24, height: 24, color: "var(--k)" }}
            className="animate-spin"
          />
        </div>
      ) : view === "map" ? (
        <div
          className="card"
          style={{ padding: 0, overflow: "hidden", height: 480 }}
        >
          <DeliveryMap deliveries={deliveries} />
        </div>
      ) : deliveries.length === 0 ? (
        <div style={{ textAlign: "center", padding: 64 }}>
          <Truck
            style={{
              width: 32,
              height: 32,
              color: "var(--tx-3)",
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
            No deliveries found
          </p>
          <p style={{ fontSize: 12, color: "var(--tx-3)", marginTop: 4 }}>
            Deliveries created from the dispatch page appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {deliveries.map((d: Delivery) => (
            <div key={d.id} className="card" style={{ padding: "16px 20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: STATUS_COLOR[d.status] ?? "var(--k)",
                        boxShadow: `0 0 6px ${STATUS_COLOR[d.status] ?? "var(--k)"}`,
                      }}
                    />
                    <Truck
                      style={{ width: 16, height: 16, color: "var(--k)" }}
                    />
                    <span
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 13,
                        color: "var(--k)",
                        fontWeight: 700,
                      }}
                    >
                      {d.trackingNumber ?? d.id.slice(0, 8)}
                    </span>
                    <StatusBadge status={d.status} />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill,minmax(180px,1fr))",
                      gap: 8,
                    }}
                  >
                    {[
                      { label: "Carrier", value: d.carrier ?? "—" },
                      { label: "Driver", value: d.driverName ?? "—" },
                      {
                        label: "Order",
                        value: d.salesOrder?.orderNumber ?? "—",
                      },
                      {
                        label: "Est. Delivery",
                        value: d.estimatedDeliveryDate
                          ? new Date(
                              d.estimatedDeliveryDate,
                            ).toLocaleDateString("en-GB")
                          : "—",
                      },
                    ].map((r) => (
                      <div key={r.label}>
                        <p
                          style={{
                            fontSize: 9,
                            color: "var(--tx-3)",
                            fontFamily: "'DM Mono',monospace",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {r.label}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--tx-1)",
                            marginTop: 1,
                          }}
                        >
                          {r.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  {d.salesOrder?.deliveryAddress && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 10,
                        fontSize: 11,
                        color: "var(--tx-3)",
                      }}
                    >
                      <MapPin style={{ width: 11, height: 11 }} />{" "}
                      {d.salesOrder.deliveryAddress}
                    </div>
                  )}
                </div>
                {DELIVERY_FLOW[d.status]?.length > 0 && (
                  <button
                    onClick={() =>
                      setUpdateForm({
                        deliveryId: d.id,
                        status: DELIVERY_FLOW[d.status][0],
                        location: "",
                        notes: "",
                        receivedBy: "",
                      })
                    }
                    className="btn-primary btn-sm"
                    style={{ flexShrink: 0 }}
                  >
                    <ChevronDown style={{ width: 13, height: 13 }} /> Update
                    Status
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {updateForm && (
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
          <div className="card" style={{ width: "100%", maxWidth: 420 }}>
            <h3
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--tx-1)",
                marginBottom: 16,
              }}
            >
              Update Delivery Status
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                  New Status
                </label>
                <select
                  value={updateForm.status}
                  onChange={(e) =>
                    setUpdateForm((v) =>
                      v ? { ...v, status: e.target.value } : v,
                    )
                  }
                  className="kx-input"
                >
                  {DELIVERY_FLOW[
                    deliveries.find(
                      (d: Delivery) => d.id === updateForm.deliveryId,
                    )?.status ?? ""
                  ]?.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {[
                {
                  label: "Current Location",
                  key: "location",
                  placeholder: "e.g. Ibadan Express Way",
                },
                { label: "Notes", key: "notes", placeholder: "Optional" },
                ...(updateForm.status === "DELIVERED"
                  ? [
                      {
                        label: "Received By",
                        key: "receivedBy",
                        placeholder: "Person who received",
                      },
                    ]
                  : []),
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
                    value={(updateForm as Record<string, string>)[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) =>
                      setUpdateForm((v) =>
                        v ? { ...v, [f.key]: e.target.value } : v,
                      )
                    }
                    className="kx-input"
                  />
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <button
                onClick={() => setUpdateForm(null)}
                className="btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updateDelivery.loading}
                className="btn-primary btn-sm"
              >
                {updateDelivery.loading ? (
                  <Loader2
                    style={{ width: 13, height: 13 }}
                    className="animate-spin"
                  />
                ) : null}{" "}
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
