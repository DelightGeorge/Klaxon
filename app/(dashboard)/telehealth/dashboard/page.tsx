"use client";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { MOCK_PRESCRIPTIONS } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { Video, FileText, Pill, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TelehealthDashboardPage() {
  const pending = MOCK_PRESCRIPTIONS.filter(p => p.status === "Pending");
  return (
    <div>
      <PageHeader title="Telehealth" subtitle="E-prescriptions and pharmacy routing" />
      <div className="kx-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
        <KpiCard label="Total Prescriptions" value={MOCK_PRESCRIPTIONS.length} icon={<FileText className="w-4 h-4"/>} />
        <KpiCard label="Pending Routing" value={pending.length} icon={<Pill className="w-4 h-4"/>} color="#f59e0b" />
        <KpiCard label="Dispensed Today" value="42" icon={<Video className="w-4 h-4"/>} color="#22c55e" />
      </div>
      <div className="card">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14}}>Recent Prescriptions</p>
          <Link href="/telehealth/prescriptions" style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"var(--k)",textDecoration:"none"}}>
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <table className="kx-table">
          <thead><tr><th>Rx ID</th><th>Patient</th><th>Doctor</th><th>Medications</th><th>Status</th></tr></thead>
          <tbody>
            {MOCK_PRESCRIPTIONS.slice(0,6).map(p => (
              <tr key={p.id}>
                <td><span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--k)"}}>{p.id}</span></td>
                <td>{p.patient}</td>
                <td><span style={{fontSize:12,color:"var(--tx-2)"}}>{p.doctor}</span></td>
                <td><span style={{fontSize:12}}>{p.medications}</span></td>
                <td><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}