"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { usePharmacyDrugs } from "@/lib/hooks/use-inventory";
import { api } from "@/lib/api";
import { Plus, Download, ScanLine, X, Loader2, AlertTriangle, Package } from "lucide-react";

type Product = {
  id: string; name: string; gtin?: string; sku?: string; batch?: string;
  expiry?: string; quantity: number; warehouse?: string; supplier?: string;
  category?: string; status?: string; price?: string | number;
};

const CATS = ["All","Analgesic","Antibiotic","Antidiabetic","Antihypertensive","Antimalarial"];

const columns: Col<Product>[] = [
  { key:"id", header:"ID", width:"90px", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--tx-3)"}}>{r.id}</span> },
  { key:"name", header:"Product", render:r=>(
    <div>
      <p style={{fontWeight:600,fontSize:13}}>{r.name}</p>
      <p style={{fontSize:10,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace",marginTop:1}}>SKU: {r.sku}</p>
    </div>
  )},
  { key:"gtin", header:"GTIN", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:11}}>{r.gtin}</span> },
  { key:"batch", header:"Batch", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:11}}>{r.batch}</span> },
  { key:"expiry", header:"Expiry", render:r=>(
    <span style={{fontSize:12, color: r.status==="Expiring Soon" ? "var(--amber)" : "var(--tx-2)"}}>{r.expiry}</span>
  )},
  { key:"quantity", header:"Qty", render:r=>(
    <span style={{fontWeight:600,fontFamily:"'DM Mono',monospace", color: r.status==="Low Stock"?"var(--red)":"var(--tx-1)"}}>
      {r.quantity?.toLocaleString()}
    </span>
  )},
  { key:"warehouse", header:"Warehouse" },
  { key:"price", header:"Unit Price", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:12}}>{r.price}</span> },
  { key:"status", header:"Status", render:r=><StatusBadge status={r.status??""} /> },
  { key:"action", header:"", render:_r=>(
    <div style={{display:"flex",gap:4}}>
      <button className="btn-secondary btn-sm" style={{padding:"4px 8px",fontSize:11}}>Edit</button>
      <button className="btn-secondary btn-sm" style={{padding:"4px 8px",fontSize:11}}>
        <ScanLine style={{width:11,height:11}} />
      </button>
    </div>
  )},
];

function AddProductModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ name:"", sku:"", gtin:"", batch:"", expiry:"", quantity:"", warehouse:"", supplier:"", category:"Analgesic", price:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(v => ({ ...v, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await api.post("/pharmacy/drugs", { ...form, quantity: Number(form.quantity), price: Number(form.price) });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError((err as {response?:{data?:{message?:string}}})?.response?.data?.message ?? "Failed to add product");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"var(--bg-surface)", borderRadius:20, padding:32, width:"100%", maxWidth:520, border:"1px solid var(--bd-1)", boxShadow:"0 32px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
          <div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, color:"var(--tx-1)" }}>Add Product</h2>
            <p style={{ fontSize:12, color:"var(--tx-3)", marginTop:2 }}>Add a new drug to inventory</p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--tx-3)" }}><X style={{width:18,height:18}} /></button>
        </div>

        {error && <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(244,63,94,0.08)", border:"1px solid rgba(244,63,94,0.2)", color:"#f43f5e", fontSize:12, marginBottom:16 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { label:"Drug Name", key:"name", type:"text", full:true },
            { label:"SKU", key:"sku", type:"text" },
            { label:"GTIN", key:"gtin", type:"text" },
            { label:"Batch Number", key:"batch", type:"text" },
            { label:"Expiry Date", key:"expiry", type:"date" },
            { label:"Quantity", key:"quantity", type:"number" },
            { label:"Unit Price (₦)", key:"price", type:"number" },
            { label:"Warehouse", key:"warehouse", type:"text" },
            { label:"Supplier", key:"supplier", type:"text" },
          ].map(f => (
            <div key={f.key} style={{ display:"flex", flexDirection:"column", gap:4, gridColumn: f.full ? "1 / -1" : "auto" }}>
              <label style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{f.label}</label>
              <input type={f.type} value={form[f.key as keyof typeof form]} onChange={update(f.key)} className="kx-input" required />
            </div>
          ))}

          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            <label style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Category</label>
            <select value={form.category} onChange={update("category")} className="kx-input">
              {CATS.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ gridColumn:"1 / -1", display:"flex", gap:10, marginTop:8, justifyContent:"flex-end" }}>
            <button type="button" onClick={onClose} className="btn-secondary btn-sm">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary btn-sm">
              {loading ? <Loader2 style={{width:14,height:14}} className="animate-spin" /> : <Plus style={{width:14,height:14}} />}
              {loading ? "Adding…" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [cat, setCat]           = useState("All");
  const [showAdd, setShowAdd]   = useState(false);
  const { data, loading, refetch } = usePharmacyDrugs();

  const apiProducts = (data?.drugs ?? data?.data ?? []) as Product[];
  const products: Product[] = apiProducts.length > 0 ? apiProducts : MOCK_PRODUCTS;

  const filtered = cat === "All" ? products : products.filter(p => p.category === cat);

  const lowStock   = products.filter(p => p.status === "Low Stock").length;
  const expiring   = products.filter(p => p.status === "Expiring Soon").length;

  return (
    <div>
      <PageHeader
        title="Drug Inventory"
        subtitle={`${products.length} products tracked across all warehouses`}
        action={
          <>
            <button className="btn-secondary btn-sm"><ScanLine className="w-3.5 h-3.5" />Scan Barcode</button>
            <button className="btn-secondary btn-sm"><Download className="w-3.5 h-3.5" />Export CSV</button>
            <button className="btn-primary btn-sm" onClick={() => setShowAdd(true)}><Plus className="w-3.5 h-3.5" />Add Product</button>
          </>
        }
      />

      {/* Alert banners */}
      {(lowStock > 0 || expiring > 0) && (
        <div style={{ display:"flex", gap:10, marginBottom:16 }}>
          {lowStock > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", borderRadius:10, background:"rgba(244,63,94,0.08)", border:"1px solid rgba(244,63,94,0.2)", fontSize:12, color:"#f43f5e" }}>
              <AlertTriangle style={{width:13,height:13}} />
              <strong>{lowStock}</strong> products low on stock
            </div>
          )}
          {expiring > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", borderRadius:10, background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)", fontSize:12, color:"#f59e0b" }}>
              <AlertTriangle style={{width:13,height:13}} />
              <strong>{expiring}</strong> products expiring soon
            </div>
          )}
        </div>
      )}

      {/* Category filters */}
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            padding:"5px 12px", borderRadius:99, fontSize:11, fontWeight:600,
            fontFamily:"'DM Mono',monospace", cursor:"pointer", border:"1px solid",
            transition:"all 0.15s",
            borderColor: cat===c ? "var(--k)" : "var(--bd-1)",
            background:  cat===c ? "var(--k-subtle)" : "transparent",
            color:       cat===c ? "var(--k)" : "var(--tx-3)",
          }}>
            {c}
            {c !== "All" && <span style={{ marginLeft:5, opacity:0.7 }}>({products.filter(p=>p.category===c).length})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:64, gap:12 }}>
          <Loader2 style={{width:24,height:24,color:"var(--k)"}} className="animate-spin" />
          <span style={{ fontSize:13, color:"var(--tx-3)" }}>Loading inventory…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:64, gap:12 }}>
          <Package style={{width:32,height:32,color:"var(--tx-3)"}} />
          <p style={{ fontSize:13, color:"var(--tx-3)" }}>No products found</p>
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} searchKeys={["name","gtin","sku","batch"] as (keyof Product)[]} pageSize={12} />
      )}

      {showAdd && <AddProductModal onClose={() => setShowAdd(false)} onSuccess={refetch} />}
    </div>
  );
}