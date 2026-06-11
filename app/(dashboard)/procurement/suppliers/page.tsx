"use client";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_SUPPLIERS } from "@/lib/mock-data";
import { Star } from "lucide-react";

type Supplier = typeof MOCK_SUPPLIERS[0];

const columns: Col<Supplier>[] = [
  { key:"id", header:"ID", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--tx-3)"}}>{r.id}</span> },
  { key:"name", header:"Supplier", render:r=>(
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:32,height:32,borderRadius:8,background:"var(--k-subtle)",border:"1px solid var(--bd-k)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:"var(--k)",flexShrink:0}}>
        {r.name[0]}
      </div>
      <div>
        <p style={{fontWeight:600,fontSize:13}}>{r.name}</p>
        <p style={{fontSize:10,color:"var(--tx-3)",marginTop:1}}>{r.country}</p>
      </div>
    </div>
  )},
  { key:"category", header:"Category", render:r=><span className="badge badge-k">{r.category}</span> },
  { key:"orders", header:"Orders", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontWeight:600}}>{r.orders}</span> },
  { key:"rating", header:"Rating", render:r=>(
    <div style={{display:"flex",alignItems:"center",gap:4}}>
      <Star className="w-3.5 h-3.5" style={{color:"var(--amber)",fill:"var(--amber)"}} />
      <span style={{fontFamily:"'DM Mono',monospace",fontWeight:600,fontSize:12}}>{r.rating}</span>
    </div>
  )},
  { key:"lastOrder", header:"Last Order" },
  { key:"status", header:"Status", render:r=><StatusBadge status={r.status} /> },
  { key:"action", header:"", render:()=>(
    <div style={{display:"flex",gap:4}}>
      <button className="btn-secondary btn-sm" style={{padding:"4px 10px",fontSize:11}}>View</button>
      <button className="btn-primary btn-sm" style={{padding:"4px 10px",fontSize:11}}>Order</button>
    </div>
  )},
];

export default function SuppliersPage() {
  return (
    <div>
      <PageHeader title="Suppliers" subtitle="Manage your pharmaceutical supplier relationships"
        action={<button className="btn-primary btn-sm">+ Add Supplier</button>} />
      <DataTable columns={columns} data={MOCK_SUPPLIERS as unknown as Record<string,unknown>[]} searchKeys={["name","country","category"] as never} />
    </div>
  );
}