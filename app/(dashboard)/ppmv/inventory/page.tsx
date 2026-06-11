"use client";
import { PageHeader } from "@/components/ui/page-header";
export default function PPMVInventoryPage() {
  return (<div><PageHeader title="PPMV Inventory" subtitle="Stock levels across all registered PPMVs" action={<button className="btn-primary btn-sm">+ Restock Alert</button>}/><div className="card" style={{textAlign:"center",padding:"40px",color:"var(--tx-3)"}}>Select a PPMV to view their inventory.</div></div>);
}