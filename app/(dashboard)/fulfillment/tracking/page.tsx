"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useDeliveries, useUpdateDelivery, type Delivery } from "@/lib/hooks/use-orders";
import { Truck, MapPin, Loader2, RefreshCw, ChevronDown } from "lucide-react";

const DELIVERY_FLOW: Record<string,string[]> = {
  PENDING:          ["PICKED_UP"],
  PICKED_UP:        ["IN_TRANSIT"],
  IN_TRANSIT:       ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED","FAILED"],
};

export default function TrackingPage() {
  const [statusFilter, setStatusFilter] = useState<string|undefined>(undefined);
  const [selected, setSelected] = useState<Delivery|null>(null);
  const [updateForm, setUpdateForm] = useState<{deliveryId:string;status:string;location:string;notes:string;receivedBy:string}|null>(null);
  const { data, loading, refetch } = useDeliveries(statusFilter);
  const deliveries = Array.isArray(data) ? data : [];
  const updateDelivery = useUpdateDelivery();

  const handleUpdate = async () => {
    if (!updateForm) return;
    await updateDelivery.mutate(updateForm);
    setUpdateForm(null); refetch();
  };

  return (
    <div>
      <PageHeader title="Delivery Tracking" subtitle="Monitor all active deliveries in real-time"
        action={<button onClick={refetch} className="btn-secondary btn-sm"><RefreshCw style={{width:13,height:13}}/> Refresh</button>}/>

      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {["All","PENDING","PICKED_UP","IN_TRANSIT","OUT_FOR_DELIVERY","DELIVERED","FAILED"].map(s=>(
          <button key={s} onClick={()=>setStatusFilter(s==="All"?undefined:s)} style={{
            padding:"5px 12px",borderRadius:99,fontSize:11,fontWeight:600,cursor:"pointer",border:"1px solid",transition:"all 0.15s",
            borderColor:(statusFilter??"")===(s==="All"?"":s)?"var(--k)":"var(--bd-1)",
            background:(statusFilter??"")===(s==="All"?"":s)?"var(--k-subtle)":"transparent",
            color:(statusFilter??"")===(s==="All"?"":s)?"var(--k)":"var(--tx-3)",
          }}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div style={{display:"flex",justifyContent:"center",padding:64}}><Loader2 style={{width:24,height:24,color:"var(--k)"}} className="animate-spin"/></div>
      ) : deliveries.length===0 ? (
        <div style={{textAlign:"center",padding:64}}>
          <Truck style={{width:32,height:32,color:"var(--tx-3)",margin:"0 auto 12px"}}/>
          <p style={{fontSize:13,color:"var(--tx-3)"}}>No deliveries found</p>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {deliveries.map((d:Delivery)=>(
            <div key={d.id} className="card" style={{padding:"16px 20px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <Truck style={{width:16,height:16,color:"var(--k)"}}/>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:"var(--k)",fontWeight:700}}>{d.trackingNumber??d.id.slice(0,8)}</span>
                    <StatusBadge status={d.status}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8}}>
                    {[
                      {label:"Carrier",value:d.carrier??"—"},
                      {label:"Driver",value:d.driverName??"—"},
                      {label:"Order",value:d.salesOrder?.orderNumber??"—"},
                      {label:"Est. Delivery",value:d.estimatedDeliveryDate?new Date(d.estimatedDeliveryDate).toLocaleDateString("en-GB"):"—"},
                    ].map(r=>(
                      <div key={r.label}>
                        <p style={{fontSize:9,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.06em"}}>{r.label}</p>
                        <p style={{fontSize:12,color:"var(--tx-1)",marginTop:1}}>{r.value}</p>
                      </div>
                    ))}
                  </div>
                  {d.salesOrder?.deliveryAddress && (
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:10,fontSize:11,color:"var(--tx-3)"}}>
                      <MapPin style={{width:11,height:11}}/> {d.salesOrder.deliveryAddress}
                    </div>
                  )}
                </div>
                {DELIVERY_FLOW[d.status]?.length>0 && (
                  <button onClick={()=>setUpdateForm({deliveryId:d.id,status:DELIVERY_FLOW[d.status][0],location:"",notes:"",receivedBy:""})}
                    className="btn-primary btn-sm" style={{flexShrink:0}}>
                    <ChevronDown style={{width:13,height:13}}/> Update Status
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {updateForm && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div className="card" style={{width:"100%",maxWidth:420}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:"var(--tx-1)",marginBottom:16}}>Update Delivery Status</h3>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>New Status</label>
                <select value={updateForm.status} onChange={e=>setUpdateForm(v=>v?({...v,status:e.target.value}):v)} className="kx-input">
                  {DELIVERY_FLOW[deliveries.find((d:Delivery)=>d.id===updateForm.deliveryId)?.status??""]?.map(s=>(
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {[
                {label:"Current Location",key:"location",placeholder:"e.g. Ibadan Express Way"},
                {label:"Notes",key:"notes",placeholder:"Optional"},
                ...(updateForm.status==="DELIVERED"?[{label:"Received By",key:"receivedBy",placeholder:"Person who received"}]:[]),
              ].map(f=>(
                <div key={f.key} style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{f.label}</label>
                  <input value={(updateForm as Record<string,string>)[f.key]} placeholder={f.placeholder}
                    onChange={e=>setUpdateForm(v=>v?({...v,[f.key]:e.target.value}):v)} className="kx-input"/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}>
              <button onClick={()=>setUpdateForm(null)} className="btn-secondary btn-sm">Cancel</button>
              <button onClick={handleUpdate} disabled={updateDelivery.loading} className="btn-primary btn-sm">
                {updateDelivery.loading?<Loader2 style={{width:13,height:13}} className="animate-spin"/>:null} Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}