"use client";
import { PageHeader } from "@/components/ui/page-header";
const REGIONS = [{name:"Lagos",value:"₦82M",pct:45},{name:"Abuja",value:"₦34M",pct:18},{name:"Kano",value:"₦28M",pct:15},{name:"PHC",value:"₦22M",pct:12},{name:"Others",value:"₦18M",pct:10}];
export default function RegionalPage() {
  return (<div><PageHeader title="Regional Analytics" subtitle="Sales performance by geography"/>
    <div className="card"><p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:16}}>Revenue by Region</p>
    {REGIONS.map(r=>(<div key={r.name} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,fontWeight:600}}>{r.name}</span><span style={{fontFamily:"'DM Mono',monospace",fontWeight:600,color:"var(--k)"}}>{r.value}</span></div><div style={{height:8,background:"var(--bg-raised)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",background:"var(--k)",width:`${r.pct}%`,borderRadius:99,boxShadow:"0 0 8px var(--k-glow)"}}/></div></div>))}</div></div>);
}