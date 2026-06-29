"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useProducts } from "@/lib/hooks/use-products";
import { Search, Package, Loader2, GitBranch } from "lucide-react";

interface TraceData {
  product?: { name: string; nafdacNumber?: string; manufacturer?: string };
  batch?: {
    batchNumber: string;
    expiryDate: string;
    quantity: number;
    status: string;
  };
  timeline?: {
    event: string;
    timestamp: string;
    actor?: string;
    location?: string;
  }[];
}

export default function TraceabilityPage() {
  const [productId, setProductId] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [searching, setSearching] = useState(false);
  const [traceData, setTraceData] = useState<TraceData | null>(null);

  const { data: productsData } = useProducts({ limit: 100 });
  const products = productsData?.products ?? [];

  const handleTrace = async () => {
    if (!productId || !batchNumber) return;
    setSearching(true);
    setTraceData(null);
    try {
      const { api } = await import("@/lib/api");
      const res = await api.get<TraceData>(
        `/traceability/${productId}/${batchNumber}`,
      );
      setTraceData(res.data);
    } catch {
      setTraceData(null);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Batch Traceability"
        subtitle="End-to-end pharmaceutical supply chain traceability"
        badge="LIVE"
        badgeVariant="green"
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card">
          <p
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 4,
            }}
          >
            Trace a Batch
          </p>
          <p style={{ fontSize: 11, color: "var(--tx-3)", marginBottom: 20 }}>
            Select a product and enter a batch number to see its full journey
          </p>

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
                Product
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="kx-input"
              >
                <option value="">Select product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
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
                Batch Number
              </label>
              <input
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="kx-input"
                placeholder="e.g. BATCH-2024-0012"
                onKeyDown={(e) => e.key === "Enter" && handleTrace()}
              />
            </div>
            <button
              onClick={handleTrace}
              disabled={searching || !productId || !batchNumber}
              className="btn-primary"
              style={{ justifyContent: "center" }}
            >
              {searching ? (
                <Loader2
                  style={{ width: 14, height: 14 }}
                  className="animate-spin"
                />
              ) : (
                <Search style={{ width: 14, height: 14 }} />
              )}
              {searching ? "Tracing..." : "Trace Batch"}
            </button>
          </div>

          {traceData && traceData.product && (
            <div
              style={{
                marginTop: 20,
                padding: 16,
                borderRadius: 12,
                background: "var(--bg-raised)",
                border: "1px solid var(--bd-1)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 10,
                }}
              >
                {traceData.product.name}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  {
                    label: "NAFDAC No.",
                    value: traceData.product.nafdacNumber ?? "—",
                  },
                  {
                    label: "Manufacturer",
                    value: traceData.product.manufacturer ?? "—",
                  },
                  {
                    label: "Batch No.",
                    value: traceData.batch?.batchNumber ?? "—",
                  },
                  { label: "Status", value: traceData.batch?.status ?? "—" },
                ].map((f) => (
                  <div key={f.label}>
                    <p
                      style={{
                        fontSize: 10,
                        color: "var(--tx-3)",
                        fontFamily: "'DM Mono',monospace",
                        textTransform: "uppercase",
                      }}
                    >
                      {f.label}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--tx-1)",
                        marginTop: 2,
                        fontWeight: 600,
                      }}
                    >
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <GitBranch style={{ width: 14, height: 14, color: "var(--k)" }} />
            <p
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Supply Chain Timeline
            </p>
          </div>

          {!traceData ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Package
                style={{
                  width: 32,
                  height: 32,
                  color: "var(--tx-3)",
                  margin: "0 auto 12px",
                }}
              />
              <p style={{ fontSize: 12, color: "var(--tx-3)" }}>
                Trace a batch to see its journey
              </p>
            </div>
          ) : !traceData.timeline || traceData.timeline.length === 0 ? (
            <p
              style={{
                fontSize: 12,
                color: "var(--tx-3)",
                textAlign: "center",
                padding: "24px 0",
              }}
            >
              No timeline events recorded
            </p>
          ) : (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: 11,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  background: "var(--bd-1)",
                }}
              />
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {traceData.timeline.map((event, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", gap: 16, paddingLeft: 4 }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "var(--k)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        zIndex: 1,
                        boxShadow: "0 0 8px rgba(20,184,142,0.4)",
                      }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#07080a",
                        }}
                      />
                    </div>
                    <div style={{ paddingBottom: 8 }}>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--tx-1)",
                          marginBottom: 2,
                        }}
                      >
                        {event.event}
                      </p>
                      {event.location && (
                        <p style={{ fontSize: 11, color: "var(--tx-3)" }}>
                          {event.location}
                        </p>
                      )}
                      {event.actor && (
                        <p style={{ fontSize: 11, color: "var(--tx-3)" }}>
                          {event.actor}
                        </p>
                      )}
                      <p
                        style={{
                          fontSize: 10,
                          color: "var(--tx-3)",
                          fontFamily: "'DM Mono',monospace",
                          marginTop: 4,
                        }}
                      >
                        {new Date(event.timestamp).toLocaleString("en-GB")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
