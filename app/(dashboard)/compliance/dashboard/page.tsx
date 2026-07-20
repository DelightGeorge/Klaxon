"use client";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_AUDIT } from "@/lib/mock-data";
import { ShieldCheck, AlertTriangle, FileText } from "lucide-react";

export default function ComplianceDashboardPage() {
  const critical = MOCK_AUDIT.filter(l => l.severity === "critical");
  const warnings = MOCK_AUDIT.filter(l => l.severity === "warning");
  return (
    <div>
      <PageHeader title="Compliance" subtitle="Regulatory compliance and audit monitoring" />
      <div className="kx-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        <KpiCard label="Compliance Score" value="98.4%" icon={<ShieldCheck className="w-4 h-4"/>} color="#22c55e" />
        <KpiCard label="Critical Events" value={critical.length} icon={<AlertTriangle className="w-4 h-4"/>} color="#f43f5e" />
        <KpiCard label="Warnings" value={warnings.length} icon={<AlertTriangle className="w-4 h-4"/>} color="#f59e0b" />
        <KpiCard label="Audit Entries" value={MOCK_AUDIT.length} icon={<FileText className="w-4 h-4"/>} />
      </div>
      <div className="card">
        <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:14}}>Recent Critical Events</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {critical.slice(0,4).map(log => (
            <div key={log.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,background:"rgba(244,63,94,0.05)",border:"1px solid rgba(244,63,94,0.15)"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"var(--red)",boxShadow:"0 0 6px var(--red)",flexShrink:0}} />
              <div style={{flex:1}}>
                <p style={{fontSize:13,fontWeight:600}}>{log.action}</p>
                <p style={{fontSize:11,color:"var(--tx-3)",marginTop:1}}>{log.user} · {log.time}</p>
              </div>
              <StatusBadge status="critical" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}