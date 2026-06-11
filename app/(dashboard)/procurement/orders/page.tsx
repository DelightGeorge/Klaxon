"use client";
import { PageHeader } from "@/components/ui/page-header";
export default function ProcurementOrdersPage() {
  return (<div><PageHeader title="Purchase Orders" subtitle="Manage purchase orders with suppliers" action={<button className="btn-primary btn-sm">+ Create PO</button>}/><div className="card" style={{textAlign:"center",padding:"40px",color:"var(--tx-3)"}}>No purchase orders yet. Create your first PO.</div></div>);
}