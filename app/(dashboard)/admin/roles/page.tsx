"use client";
import { PageHeader } from "@/components/ui/page-header";
const ROLES = ["Super Admin","Manufacturer","Distributor","Warehouse Manager","Pharmacy Admin","PPMV Operator","Hospital Pharmacist","Telehealth Provider","Logistics Coordinator","Auditor"];
export default function RolesPage() {
  return (<div><PageHeader title="Roles & Permissions" subtitle="Manage role-based access control" action={<button className="btn-primary btn-sm">+ Create Role</button>}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
      {ROLES.map(r=>(<div key={r} className="card" style={{cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--bd-k)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--bd-1)";}}>
        <div style={{width:36,height:36,borderRadius:10,background:"var(--k-subtle)",border:"1px solid var(--bd-k)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:"var(--k)",marginBottom:10}}>{r[0]}</div>
        <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:4}}>{r}</p>
        <p style={{fontSize:11,color:"var(--tx-3)"}}>Click to manage permissions</p>
      </div>))}
    </div></div>);
}