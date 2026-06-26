"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useOrders, useUpdateOrderStatus, useCancelOrder, type SalesOrder } from "@/lib/hooks/use-orders";
import { useFulfillmentStats } from "@/lib/hooks/use-orders";
import { ShoppingCart, Loader2, RefreshCw, ChevronDown, X } from "lucide-react";

const STATUSES = ["All","DRAFT","CONFIRMED","PROCESSING","READY_FOR_DISPATCH","DISPATCHED","IN_TRANSIT","DELIVERED","CANCELLED"];
const STATUS_FLOW: Record<string, string[]> = {
  DRAFT: ["CONFIRMED","CANCELLED"],
  CONFIRMED: ["PROCESSING","CANCELLED"],
  PROCESSING: ["READY_FOR_DISPATCH","CANCELLED"],
  READY_FOR_DISPATCH: ["DISPATCHED"],
  DISPATCHED: ["IN_TRANSIT"],
  IN_TRANSIT: ["DELIVERED"],
};

export default function FulfillmentOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<SalesOrder | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const { data: statsData } = useFulfillmentStats();
  const { data, loading, refetch } = useOrders({ status: statusFilter === "All" ? undefined : statusFilter });
  const orders = data?.orders ?? [];

  const updateStatus = useUpdateOrderStatus(selected?.id ?? "");
  const cancelOrder = useCancelOrder(cancelId ?? "");

  const handleStatusChange = async (order: SalesOrder, newStatus: string) => {
    setUpdating(order.id);
    await updateStatus.mutate({ status: newStatus });
    refetch(); setUpdating(null); setSelected(null);
  };

  const handleCancel = async () => {
    if (!cancelId || !cancelReason.trim()) return;
    await cancelOrder.mutate({ reason: cancelReason });
    setCancelId(null); setCancelReason(""); refetch();
  };

  const stats = [
    { label:"Total",      value: statsData?.totalOrders ?? 0,      color:"var(--k)" },
    { label:"Pending",    value: statsData?.pendingOrders ?? 0,     color:"#f59e0b" },
    { label:"Dispatched", value: statsData?.dispatchedToday ?? 0,   color:"#3b82f6" },
    { label:"Delivered",  value: statsData?.deliveredToday ?? 0,    color:"#22c55e" },
    { label:"Active",     value: statsData?.activeDeliveries ?? 0,  color:"var(--k)" },
    { label:"Overdue",    value: statsData?.overdueDeliveries ?? 0, color:"#f43f5e" },
  ];

  return (
    <div>
      <PageHeader title="Fulfillment Orders" subtitle="Manage and track all sales orders"
        action={<button onClick={refetch} className="btn-secondary btn-sm"><RefreshCw style={{width:13,height:13}} /> Refresh</button>} />

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:20}}>
        {stats.map(s => (
          <div key={s.label} className="card" style={{padding:"12px 14px"}}>
            <p style={{fontSize:10,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{s.label}</p>
            <p style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:s.color}}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding:"5px 12px",borderRadius:99,fontSize:11,fontWeight:600,cursor:"pointer",border:"1px solid",transition:"all 0.15s",
            borderColor: statusFilter===s ? "var(--k)" : "var(--bd-1)",
            background:  statusFilter===s ? "var(--k-subtle)" : "transparent",
            color:       statusFilter===s ? "var(--k)" : "var(--tx-3)",
          }}>{s}</button>
        ))}
      </div>

      <div className="card" style={{padding:0}}>
        {loading ? (
          <div style={{display:"flex",justifyContent:"center",padding:48}}><Loader2 style={{width:24,height:24,color:"var(--k)"}} className="animate-spin" /></div>
        ) : orders.length === 0 ? (
          <div style={{textAlign:"center",padding:64}}>
            <ShoppingCart style={{width:32,height:32,color:"var(--tx-3)",margin:"0 auto 12px"}} />
            <p style={{fontSize:13,color:"var(--tx-3)"}}>No orders found</p>
          </div>
        ) : (
          <div style={{overflowX:"auto"}}>
            <table className="kx-table" style={{minWidth:700}}>
              <thead><tr><th>Order #</th><th>Customer Type</th><th>Value</th><th>Warehouse</th><th>Delivery</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {orders.map((o: SalesOrder) => (
                  <tr key={o.id}>
                    <td><span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--k)",fontWeight:600}}>{o.orderNumber}</span></td>
                    <td><span className="badge badge-blue" style={{fontSize:10}}>{o.customerType}</span></td>
                    <td><span style={{fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:500}}>₦{(o.totalAmount??0).toLocaleString()}</span></td>
                    <td><span style={{fontSize:12,color:"var(--tx-2)"}}>{o.warehouse?.name ?? "—"}</span></td>
                    <td>{o.delivery ? <StatusBadge status={o.delivery.status} /> : <span style={{fontSize:11,color:"var(--tx-3)"}}>—</span>}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>
                      <div style={{display:"flex",gap:4}}>
                        {STATUS_FLOW[o.status]?.length > 0 && (
                          <div style={{position:"relative"}}>
                            <button onClick={() => setSelected(o)} className="btn-primary btn-sm" style={{padding:"4px 8px",fontSize:11}}>
                              {updating===o.id ? <Loader2 style={{width:11,height:11}} className="animate-spin" /> : <ChevronDown style={{width:11,height:11}} />}
                              Update
                            </button>
                            {selected?.id === o.id && (
                              <div style={{position:"absolute",right:0,top:"calc(100% + 4px)",background:"var(--bg-overlay)",border:"1px solid var(--bd-1)",borderRadius:10,padding:4,zIndex:50,minWidth:160,boxShadow:"0 16px 40px rgba(0,0,0,0.4)"}}>
                                {STATUS_FLOW[o.status]?.map(ns => (
                                  <button key={ns} onClick={() => handleStatusChange(o, ns)} style={{display:"block",width:"100%",textAlign:"left",padding:"7px 10px",borderRadius:7,fontSize:12,cursor:"pointer",border:"none",background:"transparent",color:"var(--tx-2)"}}
                                    onMouseEnter={e=>{e.currentTarget.style.background="var(--bg-hover)";e.currentTarget.style.color="var(--tx-1)"}}
                                    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--tx-2)"}}>
                                    → {ns}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {["DRAFT","CONFIRMED"].includes(o.status) && (
                          <button onClick={() => setCancelId(o.id)} className="btn-secondary btn-sm" style={{padding:"4px 8px",fontSize:11,color:"#f43f5e"}}>
                            <X style={{width:11,height:11}} /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <div style={{position:"fixed",inset:0,zIndex:90}} onClick={() => setSelected(null)} />}

      {cancelId && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div className="card" style={{width:"100%",maxWidth:400}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:"var(--tx-1)",marginBottom:12}}>Cancel Order</h3>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
              <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Reason</label>
              <textarea value={cancelReason} onChange={e=>setCancelReason(e.target.value)} className="kx-input" style={{minHeight:70,resize:"vertical"}} placeholder="Why is this order being cancelled?" />
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button onClick={()=>{setCancelId(null);setCancelReason("")}} className="btn-secondary btn-sm">Back</button>
              <button onClick={handleCancel} disabled={!cancelReason.trim()||cancelOrder.loading} className="btn-primary btn-sm" style={{background:"#f43f5e"}}>
                {cancelOrder.loading ? <Loader2 style={{width:13,height:13}} className="animate-spin" /> : null} Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}