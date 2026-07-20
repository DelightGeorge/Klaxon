"use client";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_RFQ } from "@/lib/mock-data";
import { ShoppingCart, FileText, CheckCircle2, Clock } from "lucide-react";

type RFQ = typeof MOCK_RFQ[0];

const cols: Col<RFQ>[] = [
  { key:"id", header:"RFQ ID", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--k)"}}>{r.id}</span> },
  { key:"product", header:"Product" },
  { key:"quantity", header:"Qty", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontWeight:600}}>{r.quantity.toLocaleString()}</span> },
  { key:"supplier", header:"Supplier" },
  { key:"deadline", header:"Deadline" },
  { key:"status", header:"Status", render:r=><StatusBadge status={r.status} /> },
];

export default function ProcurementDashboardPage() {
  return (
    <div>
      <PageHeader title="Procurement" subtitle="Supplier management and purchase workflow"
        action={<button className="btn-primary btn-sm">+ New RFQ</button>} />
      <div className="kx-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        <KpiCard label="Active RFQs" value="24" icon={<FileText className="w-4 h-4"/>} />
        <KpiCard label="Open POs" value="18" icon={<ShoppingCart className="w-4 h-4"/>} color="#3b82f6" />
        <KpiCard label="Awaiting Approval" value="7" icon={<Clock className="w-4 h-4"/>} color="#f59e0b" />
        <KpiCard label="Completed (MTD)" value="142" icon={<CheckCircle2 className="w-4 h-4"/>} color="#22c55e" />
      </div>
      <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:12}}>Recent RFQs</p>
      <DataTable columns={cols} data={MOCK_RFQ} />
    </div>
  );
}