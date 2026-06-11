"use client";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_WAREHOUSES } from "@/lib/mock-data";
import { Warehouse, Package, User, MapPin } from "lucide-react";

export default function WarehousesPage() {
  return (
    <div>
      <PageHeader title="Warehouses" subtitle="Storage facilities and capacity management"
        action={<button className="btn-primary btn-sm">+ Add Warehouse</button>} />
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
        {MOCK_WAREHOUSES.map(w => (
          <div key={w.id} className="card" style={{cursor:"pointer",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--bd-k)";e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--bd-1)";e.currentTarget.style.transform="none";}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:40,height:40,borderRadius:12,background:"var(--k-subtle)",border:"1px solid var(--bd-k)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Warehouse className="w-5 h-5 text-k" style={{color:"var(--k)"}} />
                </div>
                <div>
                  <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"var(--tx-1)"}}>{w.name}</p>
                  <p style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"var(--tx-3)",marginTop:2}}>
                    <MapPin className="w-3 h-3" />{w.location}
                  </p>
                </div>
              </div>
              <StatusBadge status={w.status} />
            </div>

            {/* Capacity bar */}
            <div style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:11,color:"var(--tx-3)"}}>Capacity used</span>
                <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",fontWeight:600,color: w.capacity>80?"var(--amber)":"var(--k)"}}>{w.capacity}%</span>
              </div>
              <div style={{height:6,background:"var(--bg-overlay)",borderRadius:99,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:99,background: w.capacity>80?"var(--amber)":"var(--k)",width:`${w.capacity}%`,transition:"width 0.6s ease",boxShadow: w.capacity>80?"0 0 8px rgba(245,158,11,0.4)":"0 0 8px rgba(20,184,142,0.4)"}} />
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[
                {icon:Package,label:"Total Items",value:w.items.toLocaleString()},
                {icon:User,label:"Manager",value:w.manager},
              ].map(item => (
                <div key={item.label} style={{padding:"8px 10px",borderRadius:8,background:"var(--bg-raised)",border:"1px solid var(--bd-1)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                    <item.icon className="w-3 h-3" style={{color:"var(--tx-3)"}} />
                    <span style={{fontSize:10,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.05em"}}>{item.label}</span>
                  </div>
                  <p style={{fontSize:13,fontWeight:600,color:"var(--tx-1)"}}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}