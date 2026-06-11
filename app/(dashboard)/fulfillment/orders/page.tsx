"use client";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, type Col } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { useState } from "react";

type Order = typeof MOCK_ORDERS[0];

const columns: Col<Order>[] = [
  { key:"id", header:"Order ID", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--k)",fontWeight:600}}>{r.id}</span> },
  { key:"customer", header:"Customer", render:r=>(
    <div>
      <p style={{fontWeight:600,fontSize:13}}>{r.customer}</p>
      <p style={{fontSize:10,color:"var(--tx-3)",marginTop:1}}>{r.type}</p>
    </div>
  )},
  { key:"qty", header:"Qty", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontWeight:600}}>{r.qty}</span> },
  { key:"value", header:"Value", render:r=><span style={{fontFamily:"'DM Mono',monospace",fontWeight:600,fontSize:12}}>{r.value}</span> },
  { key:"logistics", header:"Logistics" },
  { key:"eta", header:"ETA", render:r=><span style={{fontSize:12,color:"var(--tx-2)"}}>{r.eta}</span> },
  { key:"status", header:"Status", render:r=><StatusBadge status={r.status} /> },
  { key:"action", header:"", render:()=>(
    <button className="btn-secondary btn-sm" style={{padding:"4px 10px",fontSize:11}}>Track</button>
  )},
];

export default function OrdersPage() {
  const [status, setStatus] = useState("All");
  const statuses = ["All","Pending","Processing","Dispatched","Delivered","Cancelled"];
  const filtered = status==="All" ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status===status);

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${MOCK_ORDERS.length} total orders`}
        action={<button className="btn-primary btn-sm">+ New Order</button>} />
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {statuses.map(s => (
          <button key={s} onClick={()=>setStatus(s)}
            style={{padding:"5px 12px",borderRadius:99,fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer",border:"1px solid",transition:"all 0.15s",
              borderColor:status===s?"var(--k)":"var(--bd-1)",
              background:status===s?"var(--k-subtle)":"transparent",
              color:status===s?"var(--k)":"var(--tx-3)"}}>
            {s}
          </button>
        ))}
      </div>
      <DataTable columns={columns} data={filtered} searchKeys={["id","customer","logistics"] as (keyof Order)[]} />
    </div>
  );
}