"use client";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { Code2, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
export default function APIDashboardPage() {
  return (<div><PageHeader badge="DEMO" badgeVariant="demo" title="API Dashboard" subtitle="Monitor API usage and integrations"/>
    <div className="kx-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
      <KpiCard label="API Calls (24h)" value="142,840" icon={<Zap className="w-4 h-4"/>}/>
      <KpiCard label="Success Rate" value="99.8%" icon={<CheckCircle2 className="w-4 h-4"/>} color="#22c55e"/>
      <KpiCard label="Avg Latency" value="124ms" icon={<Code2 className="w-4 h-4"/>} color="#3b82f6"/>
      <KpiCard label="Errors (24h)" value="28" icon={<AlertTriangle className="w-4 h-4"/>} color="#f43f5e"/>
    </div>
    <div className="card"><p style={{fontSize:12,color:"var(--tx-3)",textAlign:"center",padding:"40px 0"}}>API request log chart will appear here — integrate with your backend analytics.</p></div></div>);
}