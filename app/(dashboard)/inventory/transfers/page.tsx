"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import {
  useWarehouses,
  useStockTransfer,
  useInventoryProducts,
} from "@/lib/hooks/use-inventory";
import { ArrowRightLeft, Loader2, CheckCircle } from "lucide-react";

export default function TransfersPage() {
  const [form, setForm] = useState({
    productId: "",
    fromWarehouseId: "",
    toWarehouseId: "",
    quantity: 1,
    notes: "",
  });
  const [success, setSuccess] = useState(false);

  const { data: warehouses } = useWarehouses();
  const { data: products } = useInventoryProducts(
    form.fromWarehouseId || undefined,
  );
  const { mutate, loading, error } = useStockTransfer();

  const warehouseList = Array.isArray(warehouses) ? warehouses : [];
  const productList = Array.isArray(products) ? products : [];

  const handleSubmit = async () => {
    if (!form.productId || !form.fromWarehouseId || !form.toWarehouseId) return;
    const result = await mutate(form);
    if (result) {
      setSuccess(true);
      setForm({
        productId: "",
        fromWarehouseId: "",
        toWarehouseId: "",
        quantity: 1,
        notes: "",
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="Stock Transfers"
        subtitle="Move inventory between warehouses"
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
            Create Transfer
          </p>
          <p style={{ fontSize: 11, color: "var(--tx-3)", marginBottom: 20 }}>
            Select source, destination, product and quantity
          </p>

          {success && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 14px",
                borderRadius: 10,
                background: "rgba(20,184,142,0.08)",
                border: "1px solid rgba(20,184,142,0.2)",
                marginBottom: 16,
              }}
            >
              <CheckCircle
                style={{ width: 16, height: 16, color: "var(--k)" }}
              />
              <span
                style={{ fontSize: 12, color: "var(--k)", fontWeight: 600 }}
              >
                Transfer initiated successfully!
              </span>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                gap: 10,
                alignItems: "end",
              }}
            >
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
                  From Warehouse
                </label>
                <select
                  value={form.fromWarehouseId}
                  onChange={(e) =>
                    setForm((v) => ({
                      ...v,
                      fromWarehouseId: e.target.value,
                      productId: "",
                    }))
                  }
                  className="kx-input"
                >
                  <option value="">Select...</option>
                  {warehouseList.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 0",
                }}
              >
                <ArrowRightLeft
                  style={{ width: 16, height: 16, color: "var(--k)" }}
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
                  To Warehouse
                </label>
                <select
                  value={form.toWarehouseId}
                  onChange={(e) =>
                    setForm((v) => ({ ...v, toWarehouseId: e.target.value }))
                  }
                  className="kx-input"
                >
                  <option value="">Select...</option>
                  {warehouseList
                    .filter((w) => w.id !== form.fromWarehouseId)
                    .map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                </select>
              </div>
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
                disabled={!form.fromWarehouseId}
              >
                <option value="">
                  {form.fromWarehouseId
                    ? "Select product..."
                    : "Select source warehouse first"}
                </option>
                {productList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.product?.name} ({p.quantity} available)
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
                Quantity
              </label>
              <input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) =>
                  setForm((v) => ({
                    ...v,
                    quantity: parseInt(e.target.value) || 1,
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
                Notes (optional)
              </label>
              <input
                value={form.notes}
                onChange={(e) =>
                  setForm((v) => ({ ...v, notes: e.target.value }))
                }
                className="kx-input"
                placeholder="Reason for transfer..."
              />
            </div>

            {error && <p style={{ fontSize: 12, color: "#f43f5e" }}>{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                !form.productId ||
                !form.fromWarehouseId ||
                !form.toWarehouseId
              }
              className="btn-primary"
              style={{ justifyContent: "center" }}
            >
              {loading ? (
                <Loader2
                  style={{ width: 14, height: 14 }}
                  className="animate-spin"
                />
              ) : (
                <ArrowRightLeft style={{ width: 14, height: 14 }} />
              )}
              {loading ? "Initiating..." : "Initiate Transfer"}
            </button>
          </div>
        </div>

        <div className="card">
          <p
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 4,
            }}
          >
            Transfer Guide
          </p>
          <p style={{ fontSize: 11, color: "var(--tx-3)", marginBottom: 16 }}>
            How stock transfers work on Klaxon
          </p>
          {[
            {
              step: "1",
              title: "Select warehouses",
              desc: "Choose source and destination storage facilities.",
            },
            {
              step: "2",
              title: "Pick a product",
              desc: "Products available show current stock at the source warehouse.",
            },
            {
              step: "3",
              title: "Set quantity",
              desc: "Cannot exceed available quantity at source.",
            },
            {
              step: "4",
              title: "Confirm",
              desc: "Both warehouse records update immediately after transfer.",
            },
          ].map((s) => (
            <div
              key={s.step}
              style={{ display: "flex", gap: 12, marginBottom: 16 }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 8,
                  background: "var(--k-subtle)",
                  border: "1px solid var(--bd-k)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: 11,
                  color: "var(--k)",
                  flexShrink: 0,
                }}
              >
                {s.step}
              </div>
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
