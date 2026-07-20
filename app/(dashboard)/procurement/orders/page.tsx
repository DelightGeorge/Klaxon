"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { usePurchaseOrders, type PurchaseOrder } from "@/lib/hooks/use-procurement";
import { ShoppingCart, Loader2, RefreshCw } from "lucide-react";

const STATUSES = ["All","DRAFT","PENDING_APPROVAL","APPROVED","REJECTED","SENT","PARTIALLY_RECEIVED","RECEIVED","CANCELLED"];

export default function ProcurementOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const { data, loading, refetch } = usePurchaseOrders({ status: statusFilter==="All"?undefined:statusFilter });
  const orders = data?.orders ?? [];

  return (
    <div>
      <PageHeader badge="LIVE" badgeVariant="live" title="Purchase Orders" subtitle={`${data?.total??0} total orders`}
        action={<button onClick={refetch} className="btn-secondary btn-sm"><RefreshCw style={{width:13,height:13}}/> Refresh</button>}/>

      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {STATUSES.map(s=>(
          <button key={s} onClick={()=>setStatusFilter(s)} style={{
            padding:"5px 12px",borderRadius:99,fontSize:11,fontWeight:600,cursor:"pointer",border:"1px solid",transition:"all 0.15s",whiteSpace:"nowrap",
            borderColor:statusFilter===s?"var(--k)":"var(--bd-1)",background:statusFilter===s?"var(--k-subtle)":"transparent",color:statusFilter===s?"var(--k)":"var(--tx-3)",
          }}>{s}</button>
        ))}
      </div>

      <div className="card" style={{padding:0}}>
        {loading ? (
          <div style={{display:"flex",justifyContent:"center",padding:48}}><Loader2 style={{width:24,height:24,color:"var(--k)"}} className="animate-spin"/></div>
        ) : orders.length===0 ? (
          <div style={{textAlign:"center",padding:64}}>
            <ShoppingCart style={{width:32,height:32,color:"var(--tx-3)",margin:"0 auto 12px"}}/>
            <p style={{fontSize:13,color:"var(--tx-3)"}}>No purchase orders found</p>
          </div>
        ) : (
          <div style={{overflowX:"auto"}}>
            <table className="kx-table" style={{minWidth:640}}>
              <thead><tr><th>PO Number</th><th>Supplier</th><th>Warehouse</th><th>Amount</th><th>Items</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {orders.map((o:PurchaseOrder)=>(
                  <tr key={o.id}>
                    <td><span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--k)",fontWeight:600}}>{o.poNumber}</span></td>
                    <td><span style={{fontSize:12}}>{o.supplier?.name??"—"}</span></td>
                    <td><span style={{fontSize:12,color:"var(--tx-2)"}}>{o.warehouse?.name??"—"}</span></td>
                    <td><span style={{fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:500}}>₦{(o.totalAmount??0).toLocaleString()}</span></td>
                    <td><span style={{fontSize:12}}>{o._count?.items??0}</span></td>
                    <td><StatusBadge status={o.status}/></td>
                    <td><span style={{fontSize:11,color:"var(--tx-3)"}}>{new Date(o.createdAt).toLocaleDateString("en-GB")}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}