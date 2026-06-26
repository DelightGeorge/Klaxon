"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { usePurchaseOrders, useApprovePO, type PurchaseOrder } from "@/lib/hooks/use-procurement";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";

export default function ApprovalsPage() {
  const { data, loading, refetch } = usePurchaseOrders({ status: "PENDING_APPROVAL" });
  const orders = data?.orders ?? [];
  const [comments, setComments] = useState("");
  const [modalOrder, setModalOrder] = useState<PurchaseOrder|null>(null);
  const [decision, setDecision] = useState<"APPROVED"|"REJECTED">("APPROVED");

  const approve = useApprovePO(modalOrder?.id??"");

  const handleSubmit = async () => {
    if (!modalOrder) return;
    await approve.mutate({ decision, comments });
    setModalOrder(null); setComments(""); refetch();
  };

  return (
    <div>
      <PageHeader title="PO Approvals" subtitle={`${orders.length} pending approval`}
        action={<button onClick={refetch} className="btn-secondary btn-sm"><RefreshCw style={{width:13,height:13}}/> Refresh</button>}/>

      {loading ? (
        <div style={{display:"flex",justifyContent:"center",padding:64}}><Loader2 style={{width:24,height:24,color:"var(--k)"}} className="animate-spin"/></div>
      ) : orders.length===0 ? (
        <div style={{textAlign:"center",padding:64}}>
          <CheckCircle style={{width:32,height:32,color:"var(--k)",margin:"0 auto 12px"}}/>
          <p style={{fontSize:13,color:"var(--tx-3)"}}>No pending approvals</p>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {orders.map((o:PurchaseOrder)=>(
            <div key={o.id} className="card" style={{padding:"16px 20px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:"var(--k)",fontWeight:700}}>{o.poNumber}</span>
                    <StatusBadge status={o.status}/>
                  </div>
                  <p style={{fontSize:12,color:"var(--tx-2)"}}>{o.supplier?.name} · {o.warehouse?.name} · ₦{(o.totalAmount??0).toLocaleString()} · {o._count?.items??0} items</p>
                  <p style={{fontSize:11,color:"var(--tx-3)",marginTop:4}}>{new Date(o.createdAt).toLocaleDateString("en-GB")}{o.expectedDeliveryDate?` · Expected ${new Date(o.expectedDeliveryDate).toLocaleDateString("en-GB")}`:""}</p>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{setModalOrder(o);setDecision("APPROVED")}} className="btn-primary btn-sm">
                    <CheckCircle style={{width:13,height:13}}/> Approve
                  </button>
                  <button onClick={()=>{setModalOrder(o);setDecision("REJECTED")}} className="btn-secondary btn-sm" style={{color:"#f43f5e"}}>
                    <XCircle style={{width:13,height:13}}/> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOrder && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div className="card" style={{width:"100%",maxWidth:420}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:"var(--tx-1)",marginBottom:4}}>{decision==="APPROVED"?"Approve":"Reject"} Purchase Order</h3>
            <p style={{fontSize:12,color:"var(--tx-3)",marginBottom:16}}>{modalOrder.poNumber} · ₦{(modalOrder.totalAmount??0).toLocaleString()}</p>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
              <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Comments</label>
              <textarea value={comments} onChange={e=>setComments(e.target.value)} className="kx-input" style={{minHeight:70,resize:"vertical"}} placeholder="Optional comments..."/>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button onClick={()=>setModalOrder(null)} className="btn-secondary btn-sm">Cancel</button>
              <button onClick={handleSubmit} disabled={approve.loading} className="btn-primary btn-sm" style={{background:decision==="REJECTED"?"#f43f5e":undefined}}>
                {approve.loading?<Loader2 style={{width:13,height:13}} className="animate-spin"/>:null} Confirm {decision}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}