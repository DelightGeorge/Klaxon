"use client";
import { PageHeader } from "@/components/ui/page-header";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { MapPin, Package, Truck, CheckCircle2 } from "lucide-react";

// const STEPS = ["Order Placed","Processing","Dispatched","In Transit","Delivered"];

export default function TrackingPage() {
  const active = MOCK_ORDERS.filter(o => ["Processing","Dispatched"].includes(o.status)).slice(0,6);

  return (
    <div>
      <PageHeader title="Delivery Tracking" subtitle="Real-time order status and logistics monitoring" />
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
        {active.map(order => {
          const step = ["Pending","Processing","Dispatched","Delivered"].indexOf(order.status);
          return (
            <div key={order.id} className="card">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--k)",fontWeight:600}}>{order.id}</span>
                  <p style={{fontSize:13,fontWeight:600,color:"var(--tx-1)",marginTop:2}}>{order.customer}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Progress */}
              <div style={{position:"relative",marginBottom:14}}>
                <div style={{position:"absolute",top:9,left:"10%",right:"10%",height:2,background:"var(--bd-1)"}} />
                <div style={{position:"absolute",top:9,left:"10%",height:2,background:"var(--k)",width:`${(step/3)*80}%`,transition:"width 0.6s ease",boxShadow:"0 0 8px var(--k-glow)"}} />
                <div style={{display:"flex",justifyContent:"space-between",position:"relative",zIndex:1}}>
                  {["Placed","Processing","Dispatched","Delivered"].map((s,i) => (
                    <div key={s} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background: i<=step?"var(--k)":"var(--bg-overlay)",border:`2px solid ${i<=step?"var(--k)":"var(--bd-2)"}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s"}}>
                        {i<=step && <CheckCircle2 className="w-3 h-3" style={{color:"#07080a"}} />}
                      </div>
                      <span style={{fontSize:9,color: i<=step?"var(--k)":"var(--tx-3)",fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                {[
                  {icon:Package,label:"Qty",value:String(order.qty)},
                  {icon:Truck,label:"Logistics",value:order.logistics},
                  {icon:MapPin,label:"ETA",value:order.eta},
                ].map(item => (
                  <div key={item.label} style={{padding:"7px 9px",borderRadius:8,background:"var(--bg-raised)",border:"1px solid var(--bd-1)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2}}>
                      <item.icon className="w-3 h-3" style={{color:"var(--tx-3)"}} />
                      <span style={{fontSize:9,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase"}}>{item.label}</span>
                    </div>
                    <p style={{fontSize:11,fontWeight:600,color:"var(--tx-1)"}}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}