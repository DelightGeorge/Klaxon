"use client";
import { PageHeader } from "@/components/ui/page-header";
export default function PPMVOrdersPage() {
  return (<div><PageHeader title="PPMV Orders" subtitle="Orders placed by local medicine vendors" action={<button className="btn-primary btn-sm">+ New Order</button>}/><div className="card" style={{textAlign:"center",padding:"40px",color:"var(--tx-3)"}}>No PPMV orders to display.</div></div>);
}