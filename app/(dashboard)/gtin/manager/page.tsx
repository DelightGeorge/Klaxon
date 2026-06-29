"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { useProducts } from "@/lib/hooks/use-products";
import {
  useCreateGtin,
  useGenerateBarcode,
} from "@/lib/hooks/use-gtin";
import { QrCode, Download, Plus, Loader2, X, CheckCircle } from "lucide-react";
import type { Product } from "@/lib/hooks/use-products";

function AssignGtinModal({
  product,
  onClose,
  onSuccess,
}: {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    gtinType: "GTIN_14",
    gtinValue: "",
    companyPrefix: "",
    notes: "",
  });
  const {
    mutate: createGtin,
    loading: gtinLoading,
    error: gtinError,
  } = useCreateGtin();
  const { mutate: genBarcode, loading: barcodeLoading } = useGenerateBarcode();
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    const result = await createGtin({ productId: product.id, ...form });
    if (result) {
      await genBarcode({ productId: product.id, barcodeType: "CODE128" });
      setDone(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
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
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Assign GTIN
            </h2>
            <p style={{ fontSize: 11, color: "var(--tx-3)", marginTop: 2 }}>
              {product.name}
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
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {done ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
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
                fontSize: 15,
              }}
            >
              GTIN Assigned & Barcode Generated!
            </p>
          </div>
        ) : (
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
                GTIN Type
              </label>
              <select
                value={form.gtinType}
                onChange={(e) =>
                  setForm((v) => ({ ...v, gtinType: e.target.value }))
                }
                className="kx-input"
              >
                {["GTIN_8", "GTIN_12", "GTIN_13", "GTIN_14"].map((t) => (
                  <option key={t} value={t}>
                    {t.replace("_", "-")}
                  </option>
                ))}
              </select>
            </div>
            {[
              {
                label: "GTIN Value",
                key: "gtinValue",
                placeholder: "e.g. 00012345678905",
              },
              {
                label: "Company Prefix",
                key: "companyPrefix",
                placeholder: "e.g. 0001234",
              },
              { label: "Notes", key: "notes", placeholder: "Optional" },
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
                  value={(form as Record<string, string>)[f.key]}
                  onChange={(e) =>
                    setForm((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                  className="kx-input"
                  placeholder={f.placeholder}
                />
              </div>
            ))}
            {gtinError && (
              <p style={{ fontSize: 12, color: "#f43f5e" }}>{gtinError}</p>
            )}
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                marginTop: 8,
              }}
            >
              <button onClick={onClose} className="btn-secondary btn-sm">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={gtinLoading || barcodeLoading || !form.gtinValue}
                className="btn-primary btn-sm"
              >
                {gtinLoading || barcodeLoading ? (
                  <Loader2
                    style={{ width: 13, height: 13 }}
                    className="animate-spin"
                  />
                ) : (
                  <QrCode style={{ width: 13, height: 13 }} />
                )}
                Assign & Generate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GtinManagerPage() {
  const [assignProduct, setAssignProduct] = useState<Product | null>(null);
  const { data, loading, refetch } = useProducts({ limit: 50 });
  const products: Product[] = data?.products ?? [];

  const cols: Col<Product>[] = [
    {
      key: "name",
      header: "Product",
      render: (r) => (
        <div>
          <p style={{ fontSize: 12, fontWeight: 600 }}>{r.name}</p>
          <p style={{ fontSize: 10, color: "var(--tx-3)" }}>{r.genericName}</p>
        </div>
      ),
    },
    {
      key: "gtin",
      header: "GTIN",
      render: (r) =>
        r.gtin ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: "var(--k-subtle)",
                border: "1px solid var(--bd-k)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <QrCode style={{ width: 12, height: 12, color: "var(--k)" }} />
            </div>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11 }}>
              {r.gtin}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: 11, color: "var(--tx-3)" }}>—</span>
        ),
    },
    {
      key: "nafdacNumber",
      header: "NAFDAC No.",
      render: (r) => (
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11 }}>
          {r.nafdacNumber ?? "—"}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (r) => <span className="badge badge-k">{r.category}</span>,
    },
    {
      key: "action" as keyof Product,
      header: "",
      render: (r) => (
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => setAssignProduct(r)}
            className="btn-secondary btn-sm"
            style={{ padding: "4px 10px", fontSize: 11 }}
          >
            {r.gtin ? "Reassign" : "Assign GTIN"}
          </button>
          {r.gtin && (
            <button className="btn-ghost btn-sm" style={{ padding: "4px 8px" }}>
              <Download style={{ width: 12, height: 12 }} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="GTIN Manager"
        subtitle="Global Trade Item Numbers for all products"
        badge="LIVE"
        badgeVariant="green"
        action={
          <button onClick={() => {}} className="btn-primary btn-sm">
            <Plus style={{ width: 13, height: 13 }} /> Bulk Import
          </button>
        }
      />

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Loader2
            style={{ width: 24, height: 24, color: "var(--k)" }}
            className="animate-spin"
          />
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {[
              {
                label: "Total Products",
                value: products.length,
                color: "var(--k)",
              },
              {
                label: "With GTIN",
                value: products.filter((p) => p.gtin).length,
                color: "#22c55e",
              },
              {
                label: "Missing GTIN",
                value: products.filter((p) => !p.gtin).length,
                color: "var(--amber)",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="card"
                style={{ padding: "14px 16px" }}
              >
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
          <DataTable
            columns={cols}
            data={products}
            searchKeys={["name", "gtin", "nafdacNumber"] as (keyof Product)[]}
          />
        </>
      )}

      {assignProduct && (
        <AssignGtinModal
          product={assignProduct}
          onClose={() => setAssignProduct(null)}
          onSuccess={() => {
            setAssignProduct(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
