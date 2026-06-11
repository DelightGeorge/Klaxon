"use client";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_USERS } from "@/lib/mock-data";
import { UserPlus } from "lucide-react";

type User = typeof MOCK_USERS[0];

const cols: Col<User>[] = [
  { key:"id", header:"ID", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--tx-3)"}}>{r.id}</span> },
  { key:"name", header:"User", render:r=>(
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,var(--k),#0d9472)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#07080a",fontFamily:"'Syne',sans-serif",flexShrink:0}}>
        {r.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
      </div>
      <div>
        <p style={{fontWeight:600,fontSize:13}}>{r.name}</p>
        <p style={{fontSize:11,color:"var(--tx-3)",marginTop:1,fontFamily:"'DM Mono',monospace"}}>{r.email}</p>
      </div>
    </div>
  )},
  { key:"role", header:"Role", render:r=><span className="badge badge-blue">{r.role}</span> },
  { key:"org", header:"Organisation" },
  { key:"lastLogin", header:"Last Login" },
  { key:"status", header:"Status", render:r=><StatusBadge status={r.status} /> },
  { key:"action", header:"", render:()=>(
    <div style={{display:"flex",gap:4}}>
      <button className="btn-secondary btn-sm" style={{padding:"4px 10px",fontSize:11}}>Edit</button>
      <button className="btn-danger btn-sm" style={{padding:"4px 10px",fontSize:11}}>Suspend</button>
    </div>
  )},
];

export default function AdminUsersPage() {
  return (
    <div>
      <PageHeader title="User Management" subtitle={`${MOCK_USERS.length} platform users`}
        action={<button className="btn-primary btn-sm"><UserPlus className="w-3.5 h-3.5"/>Invite User</button>} />
      <DataTable columns={cols} data={MOCK_USERS as unknown as Record<string,unknown>[]} searchKeys={["name","email","role","org"] as never} />
    </div>
  );
}