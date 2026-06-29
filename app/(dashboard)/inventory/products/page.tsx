"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { useInventoryProducts } from "@/lib/hooks/use-inventory";
import { api } from "@/lib/api";
import {
  Plus,
  Download,
  ScanLine,
  X,
  Loader2,
  AlertTriangle,
  Package,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  gtin?: string;
  sku?: string;
  batch?: string;
  expiry?: string;
  quantity: number;
  warehouse?: string;
  supplier?: string;
  category?: string;
  status?: string;
  price?: string | number;
};

// These match the real backend enum values for POST /products.
// Display labels are Title Case for the UI; the `value` sent to the API
// is the exact enum string the backend expects.
const CATEGORY_OPTIONS = [
  { label: "Antibiotic",        value: "ANTIBIOTIC" },
  { label: "Analgesic",         value: "ANALGESIC" },
  { label: "Antiviral",         value: "ANTIVIRAL" },
  { label: "Antifungal",        value: "ANTIFUNGAL" },
  { label: "Antihypertensive",  value: "ANTIHYPERTENSIVE" },
  { label: "Antidiabetic",      value: "ANTIDIABETIC" },
  { label: "Antiparasitic",     value: "ANTIPARASITIC" },
  { label: "Vitamin",           value: "VITAMIN" },
  { label: "Vaccine",           value: "VACCINE" },
  { label: "Contraceptive",     value: "CONTRACEPTIVE" },
  { label: "Cardiovascular",    value: "CARDIOVASCULAR" },
  { label: "Respiratory",       value: "RESPIRATORY" },
  { label: "Gastrointestinal",  value: "GASTROINTESTINAL" },
  { label: "Dermatological",    value: "DERMATOLOGICAL" },
  { label: "Psychotropic",      value: "PSYCHOTROPIC" },
  { label: "Diagnostic",        value: "DIAGNOSTIC" },
  { label: "Surgical",          value: "SURGICAL" },
  { label: "Other",             value: "OTHER" },
];

const TYPE_OPTIONS = [
  { label: "OTC",          value: "OTC" },
  { label: "Prescription", value: "PRESCRIPTION" },
  { label: "Controlled",   value: "CONTROLLED" },
  { label: "Device",       value: "DEVICE" },
  { label: "Diagnostic",   value: "DIAGNOSTIC" },
];

const DOSAGE_FORM_OPTIONS = [
  "TABLET", "CAPSULE", "SYRUP", "INJECTION", "CREAM", "OINTMENT",
  "DROPS", "INHALER", "SUPPOSITORY", "PATCH", "POWDER", "SOLUTION", "SUSPENSION", "OTHER",
];

// Filter chips on the page itself stay Title Case for readability —
// these map 1:1 to CATEGORY_OPTIONS labels above (minus "All").
const CATS = ["All", ...CATEGORY_OPTIONS.map(c => c.label)];

const columns: Col<Product>[] = [
  {
    key: "id",
    header: "ID",
    width: "90px",
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
  {
    key: "expiry",
    header: "Expiry",
    render: (r) => (
      <span
        style={{
          fontSize: 12,
          color: r.status === "Expiring Soon" ? "var(--amber)" : "var(--tx-2)",
        }}
      >
        {r.expiry}
      </span>
    ),
  },
  {
    key: "quantity",
    header: "Qty",
    render: (r) => (
      <span
        style={{
          fontWeight: 600,
          fontFamily: "'DM Mono',monospace",
          color: r.status === "Low Stock" ? "var(--red)" : "var(--tx-1)",
        }}
      >
        {r.quantity?.toLocaleString()}
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
    render: (r) => <StatusBadge status={r.status ?? ""} />,
  },
  {
    key: "action",
    header: "",
    render: () => (
      <div style={{ display: "flex", gap: 4 }}>
        <button
          className="btn-secondary btn-sm"
          style={{ padding: "4px 8px", fontSize: 11 }}
        >
          Edit
        </button>
        <button
          className="btn-secondary btn-sm"
          style={{ padding: "4px 8px", fontSize: 11 }}
        >
          <ScanLine style={{ width: 11, height: 11 }} />
        </button>
      </div>
    ),
  },
];

// FIXED: now posts to the real backend endpoint POST /products with the
// exact field names + enum values the API expects, instead of the
// nonexistent /pharmacy/drugs route with free-text category/sku/batch
// fields the backend doesn't recognize. Product creation (this form)
// and stock creation (batch/quantity/warehouse) are two separate backend
// calls — POST /products creates the catalogue entry, and a follow-up
// POST /inventory/stock/add is what actually puts stock + a batch +
// expiry date into a warehouse. This modal now only creates the product;
// adding the first batch of stock is a natural next step but kept out of
// scope here so the fix stays focused on the broken endpoint call.
function AddProductModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    genericName: "",
    brand: "",
    manufacturer: "",
    category: CATEGORY_OPTIONS[0].value,
    type: TYPE_OPTIONS[0].value,
    dosageForm: DOSAGE_FORM_OPTIONS[0],
    strength: "",
    unit: "",
    unitPrice: "",
    nafdacNumber: "",
    requiresPrescription: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((v) => ({ ...v, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/products", {
        name: form.name,
        genericName: form.genericName || undefined,
        brand: form.brand || undefined,
        manufacturer: form.manufacturer || undefined,
        category: form.category,
        type: form.type,
        dosageForm: form.dosageForm,
        strength: form.strength || undefined,
        unit: form.unit,
        unitPrice: Number(form.unitPrice),
        nafdacNumber: form.nafdacNumber || undefined,
        requiresPrescription: form.requiresPrescription,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to add product",
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
          maxWidth: 560,
          maxHeight: "90vh",
          overflowY: "auto",
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
              Add Product
            </h2>
            <p style={{ fontSize: 12, color: "var(--tx-3)", marginTop: 2 }}>
              Add a new drug to the product catalogue
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
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4, gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Drug Name
            </label>
            <input type="text" value={form.name} onChange={update("name")} className="kx-input" required />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Generic Name
            </label>
            <input type="text" value={form.genericName} onChange={update("genericName")} className="kx-input" placeholder="e.g. Acetaminophen" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Brand
            </label>
            <input type="text" value={form.brand} onChange={update("brand")} className="kx-input" placeholder="e.g. Panadol" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Manufacturer
            </label>
            <input type="text" value={form.manufacturer} onChange={update("manufacturer")} className="kx-input" placeholder="e.g. GSK Nigeria" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              NAFDAC Number
            </label>
            <input type="text" value={form.nafdacNumber} onChange={update("nafdacNumber")} className="kx-input" placeholder="e.g. A4-0012" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Category
            </label>
            <select value={form.category} onChange={update("category")} className="kx-input">
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Type
            </label>
            <select value={form.type} onChange={update("type")} className="kx-input">
              {TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Dosage Form
            </label>
            <select value={form.dosageForm} onChange={update("dosageForm")} className="kx-input">
              {DOSAGE_FORM_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Strength
            </label>
            <input type="text" value={form.strength} onChange={update("strength")} className="kx-input" placeholder="e.g. 500mg" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Unit
            </label>
            <input type="text" value={form.unit} onChange={update("unit")} className="kx-input" placeholder="e.g. tablets" required />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Unit Price (₦)
            </label>
            <input type="number" value={form.unitPrice} onChange={update("unitPrice")} className="kx-input" required />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, gridColumn: "1 / -1", marginTop: 4 }}>
            <input
              type="checkbox"
              id="requiresPrescription"
              checked={form.requiresPrescription}
              onChange={(e) => setForm(v => ({ ...v, requiresPrescription: e.target.checked }))}
              style={{ width: 16, height: 16, accentColor: "var(--k)" }}
            />
            <label htmlFor="requiresPrescription" style={{ fontSize: 12, color: "var(--tx-2)" }}>
              Requires a valid prescription
            </label>
          </div>

          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              gap: 10,
              marginTop: 8,
              justifyContent: "flex-end",
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
                <Plus style={{ width: 14, height: 14 }} />
              )}
              {loading ? "Adding…" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [cat, setCat] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const { data, loading, refetch } = useInventoryProducts();
  const apiProducts = (data ?? []).map((s) => ({
    id: s.id,
    name: s.product?.name ?? "Unknown",
    quantity: s.quantity,
    category: s.product?.category,
    warehouse: s.warehouse?.name,
  })) as Product[];
  const products: Product[] =
    apiProducts.length > 0 ? apiProducts : MOCK_PRODUCTS;

  const filtered =
    cat === "All" ? products : products.filter((p) => p.category === cat);

  const lowStock = products.filter((p) => p.status === "Low Stock").length;
  const expiring = products.filter((p) => p.status === "Expiring Soon").length;

  return (
    <div>
      <PageHeader badge="LIVE" badgeVariant="live"
        title="Drug Inventory"
        subtitle={`${products.length} products tracked across all warehouses`}
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
            <button
              className="btn-primary btn-sm"
              onClick={() => setShowAdd(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product
            </button>
          </>
        }
      />

      {/* Alert banners */}
      {(lowStock > 0 || expiring > 0) && (
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {lowStock > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 10,
                background: "rgba(244,63,94,0.08)",
                border: "1px solid rgba(244,63,94,0.2)",
                fontSize: 12,
                color: "#f43f5e",
              }}
            >
              <AlertTriangle style={{ width: 13, height: 13 }} />
              <strong>{lowStock}</strong> products low on stock
            </div>
          )}
          {expiring > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 10,
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.2)",
                fontSize: 12,
                color: "#f59e0b",
              }}
            >
              <AlertTriangle style={{ width: 13, height: 13 }} />
              <strong>{expiring}</strong> products expiring soon
            </div>
          )}
        </div>
      )}

      {/* Category filters */}
      <div
        style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}
      >
        {CATS.map((c) => (
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
            {c !== "All" && (
              <span style={{ marginLeft: 5, opacity: 0.7 }}>
                ({products.filter((p) => p.category === c).length})
              </span>
            )}
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
            Loading inventory…
          </span>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 64,
            gap: 12,
          }}
        >
          <Package style={{ width: 32, height: 32, color: "var(--tx-3)" }} />
          <p style={{ fontSize: 13, color: "var(--tx-3)" }}>
            No products found
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          searchKeys={["name", "gtin", "sku", "batch"] as (keyof Product)[]}
          pageSize={12}
        />
      )}

      {showAdd && (
        <AddProductModal
          onClose={() => setShowAdd(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}