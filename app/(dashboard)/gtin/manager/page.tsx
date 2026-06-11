"use client";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { QrCode, Download, Plus } from "lucide-react";

type P = typeof MOCK_PRODUCTS[0];

const cols: Col<P>[] = [
  { key:"name", header:"Product" },
  { key:"gtin", header:"GTIN-14", render:r=>(
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:28,height:28,borderRadius:6,background:"var(--k-subtle)",border:"1px solid var(--bd-k)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <QrCode className="w-3.5 h-3.5" style={{color:"var(--k)"}} />
      </div>
      <span style={{fontFamily:"'DM Mono',monospace",fontSize:12}}>{r.gtin}</span>
    </div>
  )},
  { key:"sku", header:"SKU", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:11}}>{r.sku}</span> },
  { key:"category", header:"Category", render:r=><span className="badge badge-k">{r.category}</span> },
  { key:"action", header:"", render:()=>(
    <div style={{display:"flex",gap:4}}>
      <button className="btn-secondary btn-sm" style={{padding:"4px 10px",fontSize:11}}>Generate</button>
      <button className="btn-ghost btn-sm" style={{padding:"4px 8px"}}><Download className="w-3.5 h-3.5"/></button>
    </div>
  )},
];

export default function GtinManagerPage() {
  return (
    <div>
      <PageHeader title="GTIN Manager" subtitle="Global Trade Item Numbers for all products"
        action={<button className="btn-primary btn-sm"><Plus className="w-3.5 h-3.5"/>Assign GTIN</button>} />
      <DataTable columns={cols} data={MOCK_PRODUCTS as unknown as Record<string,unknown>[]} searchKeys={["name","gtin","sku"] as never} />
    </div>
  );
}