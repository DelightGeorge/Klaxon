"use client";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_RFQ } from "@/lib/mock-data";
type RFQ = typeof MOCK_RFQ[0];
const cols: Col<RFQ>[] = [
  {key:"id",header:"RFQ ID",render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--k)"}}>{r.id}</span>},
  {key:"product",header:"Product"},{key:"quantity",header:"Quantity",render:r=><span style={{fontFamily:"'DM Mono',monospace"}}>{r.quantity.toLocaleString()}</span>},
  {key:"supplier",header:"Supplier"},{key:"date",header:"Created"},{key:"deadline",header:"Deadline"},
  {key:"status",header:"Status",render:r=><StatusBadge status={r.status}/>},
];
export default function RFQPage() {
  return (<div><PageHeader title="Request for Quotation" subtitle="Manage supplier RFQs" action={<button className="btn-primary btn-sm">+ New RFQ</button>}/><DataTable columns={cols} data={MOCK_RFQ as unknown as Record<string,unknown>[]}/></div>);
}