"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import {
  useWarehouses,
  useInventoryProducts,
  useStockReconcile,
} from "@/lib/hooks/use-inventory";
import { CheckCircle, Loader2, Scale } from "lucide-react";

export default function ReconciliationPage() {
  const [warehouseId, setWarehouseId] = useState("");
  const [form, setForm] = useState({
    productId: "",
    actualQuantity: 0,
    reason: "AUDIT",
    notes: "",
  });
  const [result, setResult] = useState<{
    previousQuantity: number;
    newQuantity: number;
    difference: number;
  } | null>(null);

  const { data: warehouses } = useWarehouses();
  const { data: products } = useInventoryProducts(warehouseId || undefined);
  const { mutate, loading, error } = useStockReconcile();

  const warehouseList = Array.isArray(warehouses) ? warehouses : [];
  const productList = Array.isArray(products) ? products : [];

  const selectedProduct = productList.find((p) => p.id === form.productId);

  const handleSubmit = async () => {
    const res = await mutate({ warehouseId, ...form });
    if (res) setResult(res);
  };

  return (
    <div>
      <PageHeader
        title="Stock Reconciliation"
        subtitle="Compare physical counts with system records"
        badge="LIVE"
        badgeVariant="green"
      />

      <div className="kx-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card">
          <p
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 4,
            }}
          >
            Reconcile Stock
          </p>
          <p style={{ fontSize: 11, color: "var(--tx-3)", marginBottom: 20 }}>
            Update system records to match your physical count
          </p>

          {result && (
            <div
              style={{
                padding: 16,
                borderRadius: 12,
                background: "rgba(20,184,142,0.08)",
                border: "1px solid rgba(20,184,142,0.2)",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <CheckCircle
                  style={{ width: 16, height: 16, color: "var(--k)" }}
                />
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: "var(--k)" }}
                >
                  Reconciliation Complete
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  { label: "Previous", value: result.previousQuantity },
                  { label: "New", value: result.newQuantity },
                  {
                    label: "Difference",
                    value: `${result.difference > 0 ? "+" : ""}${result.difference}`,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{ textAlign: "center", padding: "8px 0" }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        color: "var(--tx-3)",
                        fontFamily: "'DM Mono',monospace",
                        textTransform: "uppercase",
                      }}
                    >
                      {s.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        fontWeight: 800,
                        fontSize: 20,
                        color:
                          s.label === "Difference"
                            ? result.difference >= 0
                              ? "var(--k)"
                              : "#f43f5e"
                            : "var(--tx-1)",
                      }}
                    >
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                Warehouse
              </label>
              <select
                value={warehouseId}
                onChange={(e) => {
                  setWarehouseId(e.target.value);
                  setForm((v) => ({ ...v, productId: "" }));
                }}
                className="kx-input"
              >
                <option value="">Select warehouse...</option>
                {warehouseList.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
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
                Product
              </label>
              <select
                value={form.productId}
                onChange={(e) =>
                  setForm((v) => ({ ...v, productId: e.target.value }))
                }
                className="kx-input"
                disabled={!warehouseId}
              >
                <option value="">
                  {warehouseId ? "Select product..." : "Select warehouse first"}
                </option>
                {productList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.product?.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "var(--bg-raised)",
                  border: "1px solid var(--bd-1)",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--tx-3)",
                    marginBottom: 4,
                  }}
                >
                  System record shows:
                </p>
                <p
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 800,
                    fontSize: 20,
                    color: "var(--k)",
                  }}
                >
                  {selectedProduct.quantity}{" "}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 400,
                      color: "var(--tx-3)",
                    }}
                  >
                    {selectedProduct.product?.unit}
                  </span>
                </p>
              </div>
            )}

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
                Physical Count (actual qty found)
              </label>
              <input
                type="number"
                min={0}
                value={form.actualQuantity}
                onChange={(e) =>
                  setForm((v) => ({
                    ...v,
                    actualQuantity: parseInt(e.target.value) || 0,
                  }))
                }
                className="kx-input"
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
                Reason
              </label>
              <select
                value={form.reason}
                onChange={(e) =>
                  setForm((v) => ({ ...v, reason: e.target.value }))
                }
                className="kx-input"
              >
                {[
                  "AUDIT",
                  "DAMAGED",
                  "THEFT",
                  "EXPIRY_WRITE_OFF",
                  "CORRECTION",
                  "OTHER",
                ].map((r) => (
                  <option key={r} value={r}>
                    {r.replace(/_/g, " ")}
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
                Notes
              </label>
              <input
                value={form.notes}
                onChange={(e) =>
                  setForm((v) => ({ ...v, notes: e.target.value }))
                }
                className="kx-input"
                placeholder="Optional details..."
              />
            </div>

            {error && <p style={{ fontSize: 12, color: "#f43f5e" }}>{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading || !warehouseId || !form.productId}
              className="btn-primary"
              style={{ justifyContent: "center" }}
            >
              {loading ? (
                <Loader2
                  style={{ width: 14, height: 14 }}
                  className="animate-spin"
                />
              ) : (
                <Scale style={{ width: 14, height: 14 }} />
              )}
              {loading ? "Reconciling..." : "Submit Reconciliation"}
            </button>
          </div>
        </div>

        <div className="card">
          <p
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            What happens when you reconcile?
          </p>
          {[
            {
              title: "System updates instantly",
              desc: "The stock quantity in the database is set to your physical count.",
            },
            {
              title: "Difference is logged",
              desc: "Every reconciliation creates an audit trail with the before/after quantities.",
            },
            {
              title: "Compliance report",
              desc: "Large discrepancies are flagged in the compliance dashboard automatically.",
            },
            {
              title: "No undo",
              desc: "Reconciliation is permanent. Double-check your physical count before submitting.",
            },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--k)",
                  marginTop: 6,
                  flexShrink: 0,
                  boxShadow: "0 0 6px var(--k)",
                }}
              />
              <div>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--tx-1)",
                    marginBottom: 2,
                  }}
                >
                  {s.title}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--tx-3)",
                    lineHeight: 1.5,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
