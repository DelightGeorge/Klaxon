"use client";
import { PageHeader } from "@/components/ui/page-header";
import { AlertTriangle } from "lucide-react";
export default function RecallsPage() {
  return (<div><PageHeader title="Recall Tracking" subtitle="NAFDAC recall notices and batch quarantine management" action={<button className="btn-danger btn-sm"><AlertTriangle className="w-3.5 h-3.5"/>Issue Recall</button>}/><div className="card" style={{textAlign:"center",padding:"60px 0"}}><AlertTriangle className="w-12 h-12" style={{margin:"0 auto 12px",color:"var(--tx-3)"}}/><p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,marginBottom:6}}>No Active Recalls</p><p style={{fontSize:12,color:"var(--tx-3)"}}>No product recalls currently active.</p></div></div>);
}