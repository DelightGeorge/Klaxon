"use client";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_PRESCRIPTIONS } from "@/lib/mock-data";

type Rx = typeof MOCK_PRESCRIPTIONS[0];

const cols: Col<Rx>[] = [
  { key:"id", header:"Rx ID", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--k)",fontWeight:600}}>{r.id}</span> },
  { key:"patient", header:"Patient" },
  { key:"doctor", header:"Doctor" },
  { key:"medications", header:"Medications" },
  { key:"pharmacy", header:"Pharmacy" },
  { key:"date", header:"Date" },
  { key:"status", header:"Status", render:r=><StatusBadge status={r.status} /> },
  { key:"action", header:"", render:()=>(
    <div style={{display:"flex",gap:4}}>
      <button className="btn-secondary btn-sm" style={{padding:"4px 10px",fontSize:11}}>View</button>
      <button className="btn-primary btn-sm" style={{padding:"4px 10px",fontSize:11}}>Route</button>
    </div>
  )},
];

export default function PrescriptionsPage() {
  return (
    <div>
      <PageHeader title="E-Prescriptions" subtitle="Digital prescription routing and fulfillment tracking"
        action={<button className="btn-primary btn-sm">+ New Prescription</button>} />
      <DataTable columns={cols} data={MOCK_PRESCRIPTIONS} searchKeys={["patient","doctor","pharmacy"] as (keyof Rx)[]} />
    </div>
  );
}