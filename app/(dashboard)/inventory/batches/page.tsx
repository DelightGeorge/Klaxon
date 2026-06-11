"use client";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

type P = typeof MOCK_PRODUCTS[0];

const cols: Col<P>[] = [
  {key:"batch",header:"Batch No.",render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--k)"}}>{r.batch}</span>},
  {key:"name",header:"Product"},
  {key:"quantity",header:"Qty",render:r=><span style={{fontFamily:"'DM Mono',monospace",fontWeight:600}}>{r.quantity.toLocaleString()}</span>},
  {key:"expiry",header:"Expiry"},
  {key:"supplier",header:"Supplier"},
  {key:"warehouse",header:"Warehouse"},
  {key:"status",header:"Status",render:r=><StatusBadge status={r.status}/>},
];

export default function BatchesPage() {
  return (
    <div>
      <PageHeader title="Batch Tracking" subtitle="Monitor all drug batches and expiry dates" />
      <DataTable columns={cols} data={MOCK_PRODUCTS} searchKeys={["batch","name","supplier"] as (keyof P)[]} />
    </div>
  );
}