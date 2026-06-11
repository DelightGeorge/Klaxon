"use client";
import { PageHeader } from "@/components/ui/page-header";
const HOOKS = [
  {url:"https://hospital.com/webhooks/klaxon",events:["order.created","order.dispatched"],status:"Active"},
  {url:"https://pharmacy.com/api/events",events:["prescription.routed","stock.low"],status:"Active"},
  {url:"https://old-system.com/hook",events:["order.delivered"],status:"Inactive"},
];
export default function WebhooksPage() {
  return (<div><PageHeader title="Webhooks" subtitle="Send real-time events to your systems" action={<button className="btn-primary btn-sm">+ Add Webhook</button>}/>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {HOOKS.map((h,i)=>(<div key={i} className="card"><div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}><code style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--k)"}}>{h.url}</code><span className={`badge ${h.status==="Active"?"badge-green":"badge-ink"}`}>{h.status}</span></div><div style={{display:"flex",gap:6}}>{h.events.map(e=><span key={e} className="badge badge-k" style={{fontSize:10}}>{e}</span>)}</div></div>))}
    </div></div>);
}