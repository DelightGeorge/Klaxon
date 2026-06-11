"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Plus, Download, ScanLine } from "lucide-react";

type Product = (typeof MOCK_PRODUCTS)[0];

const columns: Col<Product>[] = [
  {
    key: "id",
    header: "ID",
    width: "100px",
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
    header: "Product",
    render: (r) => (
      <div>
        <p style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</p>
        <p
          style={{
            fontSize: 10,
            color: "var(--tx-3)",
            fontFamily: "'DM Mono',monospace",
            marginTop: 1,
          }}
        >
          SKU: {r.sku}
        </p>
      </div>
    ),
  },
  {
    key: "gtin",
    header: "GTIN",
    render: (r) => (
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11 }}>
        {r.gtin}
      </span>
    ),
  },
  {
    key: "batch",
    header: "Batch",
    render: (r) => (
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11 }}>
        {r.batch}
      </span>
    ),
  },
  { key: "expiry", header: "Expiry" },
  {
    key: "quantity",
    header: "Qty",
    render: (r) => (
      <span style={{ fontWeight: 600, fontFamily: "'DM Mono',monospace" }}>
        {r.quantity.toLocaleString()}
      </span>
    ),
  },
  { key: "warehouse", header: "Warehouse" },
  {
    key: "price",
    header: "Unit Price",
    render: (r) => (
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>
        {r.price}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (r) => <StatusBadge status={r.status} />,
  },
];

export default function ProductsPage() {
  const [cat, setCat] = useState("All");
  const cats = [
    "All",
    "Analgesic",
    "Antibiotic",
    "Antidiabetic",
    "Antihypertensive",
    "Antimalarial",
  ];
  const filtered =
    cat === "All"
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.category === cat);

  return (
    <div>
      <PageHeader
        title="Drug Inventory"
        subtitle={`${MOCK_PRODUCTS.length} products tracked across all warehouses`}
        action={
          <>
            <button className="btn-secondary btn-sm">
              <ScanLine className="w-3.5 h-3.5" />
              Scan Barcode
            </button>
            <button className="btn-secondary btn-sm">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button className="btn-primary btn-sm">
              <Plus className="w-3.5 h-3.5" />
              Add Product
            </button>
          </>
        }
      />
      {/* Category filter */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}
      >
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              padding: "5px 12px",
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "'DM Mono',monospace",
              cursor: "pointer",
              border: "1px solid",
              transition: "all 0.15s",
              borderColor: cat === c ? "var(--k)" : "var(--bd-1)",
              background: cat === c ? "var(--k-subtle)" : "transparent",
              color: cat === c ? "var(--k)" : "var(--tx-3)",
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        searchKeys={["name", "gtin", "sku", "batch"] as (keyof Product)[]}
        pageSize={10}
      />
    </div>
  );
}