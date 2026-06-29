"use client";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_ORDERS } from "@/lib/mock-data";

type O = typeof MOCK_ORDERS[0];

const cols: Col<O>[] = [
  {key:"id",header:"Order ID",render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--k)"}}>{r.id}</span>},
  {key:"customer",header:"Customer"},{key:"logistics",header:"Logistics Partner"},{key:"eta",header:"ETA"},
  {key:"status",header:"Status",render:r=><StatusBadge status={r.status}/>},
  {key:"action",header:"",render:()=><button className="btn-primary btn-sm" style={{padding:"4px 10px",fontSize:11}}>Dispatch</button>},
];

export default function DispatchPage() {
  const pending = MOCK_ORDERS.filter(o => o.status === "Processing");
  return (
    <div>
      <PageHeader badge="DEMO" badgeVariant="demo" title="Dispatch Management" subtitle={`${pending.length} orders ready to dispatch`}/>
      <DataTable columns={cols} data={pending}/>
    </div>
  );
}