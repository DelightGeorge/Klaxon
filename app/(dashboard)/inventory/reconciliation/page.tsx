"use client";
import { PageHeader } from "@/components/ui/page-header";
export default function ReconciliationPage() {
  return (
    <div>
      <PageHeader title="Stock Reconciliation" subtitle="Compare physical counts with system records" />
      <div className="card" style={{textAlign:"center",padding:"60px 0"}}>
        <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,marginBottom:8}}>Start Reconciliation</p>
        <p style={{fontSize:12,color:"var(--tx-3)",marginBottom:20}}>Select a warehouse and product category to begin stock count</p>
        <button className="btn-primary">Begin Stock Count</button>
      </div>
    </div>
  );
}