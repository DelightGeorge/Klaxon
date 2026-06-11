"use client";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_AUDIT } from "@/lib/mock-data";
import { DataTable, type Col } from "@/components/ui/data-table";
import { Download } from "lucide-react";

type Log = typeof MOCK_AUDIT[0];

const cols: Col<Log>[] = [
  { key:"id", header:"Log ID", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--tx-3)"}}>{r.id}</span> },
  { key:"action", header:"Action", render:r=><span style={{fontWeight:600,fontSize:13}}>{r.action}</span> },
  { key:"user", header:"User" },
  { key:"resource", header:"Resource", render:r=><span className="badge badge-k">{r.resource}</span> },
  { key:"severity", header:"Severity", render:r=><StatusBadge status={r.severity} /> },
  { key:"time", header:"Timestamp", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--tx-3)"}}>{r.time}</span> },
];

export default function AuditPage() {
  return (
    <div>
      <PageHeader 
        title="Audit Logs" 
        subtitle="Complete activity trail for compliance and security"
        action={<button className="btn-secondary btn-sm"><Download className="w-3.5 h-3.5"/>Export Logs</button>} 
      />
      <DataTable 
        columns={cols} 
        data={MOCK_AUDIT} 
        searchKeys={["action", "user", "resource"] as (keyof Log)[]} 
        pageSize={15} 
      />
    </div>
  );
}