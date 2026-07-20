"use client";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { KpiCard } from "@/components/ui/kpi-card";
import { MOCK_PPMV, MOCK_KPI } from "@/lib/mock-data";
import { Store, MapPin, Package } from "lucide-react";

type PPMV = typeof MOCK_PPMV[0];

const cols: Col<PPMV>[] = [
  { key:"id", header:"ID", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--tx-3)"}}>{r.id}</span> },
  { key:"name", header:"Chemist / Vendor", render:r=>(
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:28,height:28,borderRadius:8,background:"var(--k-subtle)",border:"1px solid var(--bd-k)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"var(--k)"}}>{r.name[0]}</div>
      <span style={{fontWeight:600,fontSize:13}}>{r.name}</span>
    </div>
  )},
  { key:"location", header:"Location", render:r=><span style={{display:"flex",alignItems:"center",gap:4,fontSize:12}}><MapPin className="w-3 h-3" style={{color:"var(--tx-3)"}} />{r.location}</span> },
  { key:"stock", header:"Stock Items", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontWeight:600}}>{r.stock}</span> },
  { key:"revenue", header:"Revenue", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontWeight:600,fontSize:12}}>{r.revenue}</span> },
  { key:"lastOrder", header:"Last Order" },
  { key:"status", header:"Status", render:r=><StatusBadge status={r.status} /> },
];

export default function PPMVDashboardPage() {
  return (
    <div>
      <PageHeader title="PPMV Portal" subtitle="Local medicine vendor management and support"
        action={<button className="btn-primary btn-sm">+ Register PPMV</button>} />
      <div className="kx-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
        <KpiCard label="Total PPMVs" value={MOCK_KPI.ppMVs.toLocaleString()} change={MOCK_KPI.ppMVsChange} icon={<Store className="w-4 h-4"/>} />
        <KpiCard label="Active Today" value="9,240" icon={<Package className="w-4 h-4"/>} color="#3b82f6" />
        <KpiCard label="Low Stock" value={MOCK_KPI.lowStock} icon={<MapPin className="w-4 h-4"/>} color="#f59e0b" />
      </div>
      <DataTable columns={cols} data={MOCK_PPMV} searchKeys={["name","location"] as (keyof PPMV)[]} />
    </div>
  );
}