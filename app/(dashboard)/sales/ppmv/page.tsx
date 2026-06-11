"use client";
import { PageHeader } from "@/components/ui/page-header";
import { MOCK_PPMV } from "@/lib/mock-data";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
type P = typeof MOCK_PPMV[0];
const cols: Col<P>[] = [
  {key:"name",header:"PPMV"},{key:"location",header:"Location"},
  {key:"revenue",header:"Revenue",render:r=><span style={{fontFamily:"'DM Mono',monospace",fontWeight:600,color:"var(--k)"}}>{r.revenue}</span>},
  {key:"stock",header:"Stock Items"},{key:"lastOrder",header:"Last Order"},
  {key:"status",header:"Status",render:r=><StatusBadge status={r.status}/>},
];
export default function PPMVAnalyticsPage() {
  return (<div><PageHeader title="PPMV Analytics" subtitle="Performance metrics for local medicine vendors"/><DataTable columns={cols} data={MOCK_PPMV as unknown as Record<string,unknown>[]}/></div>);
}