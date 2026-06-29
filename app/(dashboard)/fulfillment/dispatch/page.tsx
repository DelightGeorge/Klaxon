"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useOrders, useApproveDispatch, useCreateDelivery, type SalesOrder } from "@/lib/hooks/use-orders";
import { Truck, CheckCircle, XCircle, Loader2, Plus, RefreshCw } from "lucide-react";

export default function DispatchPage() {
  const { data, loading, refetch } = useOrders({ status: "READY_FOR_DISPATCH" });
  const orders = data?.orders ?? [];
  const approve = useApproveDispatch();
  const createDelivery = useCreateDelivery();
  const [actionId, setActionId] = useState<string|null>(null);
  const [deliveryForm, setDeliveryForm] = useState<{salesOrderId:string;carrier:string;trackingNumber:string;driverName:string;driverPhone:string;estimatedDeliveryDate:string}|null>(null);

  const handleApprove = async (orderId: string) => {
    setActionId(orderId);
    await approve.mutate({ orderId, decision: "APPROVED", comments: "Approved for dispatch" });
    refetch(); setActionId(null);
  };

  const handleReject = async (orderId: string) => {
    setActionId(orderId);
    await approve.mutate({ orderId, decision: "REJECTED", comments: "Rejected" });
    refetch(); setActionId(null);
  };

  const handleCreateDelivery = async () => {
    if (!deliveryForm) return;
    await createDelivery.mutate(deliveryForm);
    setDeliveryForm(null); refetch();
  };

  return (
    <div>
      <PageHeader badge="LIVE" badgeVariant="live" title="Dispatch Approvals" subtitle="Review and approve orders ready for dispatch"
        action={<button onClick={refetch} className="btn-secondary btn-sm"><RefreshCw style={{width:13,height:13}}/> Refresh</button>} />

      {loading ? (
        <div style={{display:"flex",justifyContent:"center",padding:64}}><Loader2 style={{width:24,height:24,color:"var(--k)"}} className="animate-spin"/></div>
      ) : orders.length === 0 ? (
        <div style={{textAlign:"center",padding:64}}>
          <Truck style={{width:32,height:32,color:"var(--tx-3)",margin:"0 auto 12px"}}/>
          <p style={{fontSize:13,color:"var(--tx-3)"}}>No orders awaiting dispatch approval</p>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {orders.map((o: SalesOrder) => (
            <div key={o.id} className="card" style={{padding:"16px 20px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:"var(--k)",fontWeight:700}}>{o.orderNumber}</span>
                    <StatusBadge status={o.status}/>
                  </div>
                  <p style={{fontSize:12,color:"var(--tx-2)"}}>{o.customerType} · ₦{(o.totalAmount??0).toLocaleString()} · {o._count?.items ?? 0} items</p>
                  {o.deliveryAddress && <p style={{fontSize:11,color:"var(--tx-3)",marginTop:4}}>📍 {o.deliveryAddress}</p>}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setDeliveryForm({salesOrderId:o.id,carrier:"",trackingNumber:"",driverName:"",driverPhone:"",estimatedDeliveryDate:""})}
                    className="btn-secondary btn-sm"><Plus style={{width:13,height:13}}/> Create Delivery</button>
                  <button onClick={()=>handleApprove(o.id)} disabled={actionId===o.id} className="btn-primary btn-sm">
                    {actionId===o.id?<Loader2 style={{width:13,height:13}} className="animate-spin"/>:<CheckCircle style={{width:13,height:13}}/>} Approve
                  </button>
                  <button onClick={()=>handleReject(o.id)} disabled={actionId===o.id} className="btn-secondary btn-sm" style={{color:"#f43f5e"}}>
                    <XCircle style={{width:13,height:13}}/> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deliveryForm && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div className="card" style={{width:"100%",maxWidth:460}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:"var(--tx-1)",marginBottom:16}}>Create Delivery</h3>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {([
                {label:"Carrier",key:"carrier",placeholder:"e.g. GIG Logistics"},
                {label:"Tracking Number",key:"trackingNumber",placeholder:"e.g. GIG-2026-12345"},
                {label:"Driver Name",key:"driverName",placeholder:"e.g. Emeka Obi"},
                {label:"Driver Phone",key:"driverPhone",placeholder:"+2348012345678"},
                {label:"Est. Delivery Date",key:"estimatedDeliveryDate",placeholder:"",type:"datetime-local"},
              ] as {label:string;key:string;placeholder:string;type?:string}[]).map(f => (
                <div key={f.key} style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{f.label}</label>
                  <input type={f.type??"text"} value={(deliveryForm as Record<string,string>)[f.key]} placeholder={f.placeholder}
                    onChange={e=>setDeliveryForm(v=>v?({...v,[f.key]:e.target.value}):v)} className="kx-input"/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}>
              <button onClick={()=>setDeliveryForm(null)} className="btn-secondary btn-sm">Cancel</button>
              <button onClick={handleCreateDelivery} disabled={createDelivery.loading} className="btn-primary btn-sm">
                {createDelivery.loading?<Loader2 style={{width:13,height:13}} className="animate-spin"/>:null} Create Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}