"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useRFQs, useCloseRFQ, type RFQ } from "@/lib/hooks/use-procurement";
import { FileText, Loader2, RefreshCw, X, Clock } from "lucide-react";

const STATUSES = ["All","OPEN","RESPONDED","CLOSED","CANCELLED"];

export default function RFQPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [closing, setClosing] = useState<string|null>(null);
  const { data, loading, refetch } = useRFQs(statusFilter==="All"?undefined:statusFilter);
  const rfqs = Array.isArray(data) ? data : [];

  const handleClose = async (id: string) => {
    setClosing(id);
    await useCloseRFQ(id).mutate();
    refetch(); setClosing(null);
  };

  return (
    <div>
      <PageHeader title="Request for Quotation" subtitle={`${rfqs.length} RFQs`}
        action={<button onClick={refetch} className="btn-secondary btn-sm"><RefreshCw style={{width:13,height:13}}/> Refresh</button>}/>

      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {STATUSES.map(s=>(
          <button key={s} onClick={()=>setStatusFilter(s)} style={{
            padding:"5px 12px",borderRadius:99,fontSize:11,fontWeight:600,cursor:"pointer",border:"1px solid",transition:"all 0.15s",
            borderColor:statusFilter===s?"var(--k)":"var(--bd-1)",background:statusFilter===s?"var(--k-subtle)":"transparent",color:statusFilter===s?"var(--k)":"var(--tx-3)",
          }}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div style={{display:"flex",justifyContent:"center",padding:64}}><Loader2 style={{width:24,height:24,color:"var(--k)"}} className="animate-spin"/></div>
      ) : rfqs.length===0 ? (
        <div style={{textAlign:"center",padding:64}}>
          <FileText style={{width:32,height:32,color:"var(--tx-3)",margin:"0 auto 12px"}}/>
          <p style={{fontSize:13,color:"var(--tx-3)"}}>No RFQs found</p>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {rfqs.map((r:RFQ)=>(
            <div key={r.id} className="card" style={{padding:"16px 20px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--k)",fontWeight:700}}>{r.rfqNumber}</span>
                    <StatusBadge status={r.status}/>
                  </div>
                  <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"var(--tx-1)",marginBottom:4}}>{r.title}</p>
                  <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,color:"var(--tx-3)"}}>{r.items?.length??0} items</span>
                    <span style={{fontSize:11,color:"var(--tx-3)"}}>{(r.responses as unknown[])?.length??0} responses</span>
                    {r.deadline && (
                      <span style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"var(--tx-3)"}}>
                        <Clock style={{width:11,height:11}}/> {new Date(r.deadline).toLocaleDateString("en-GB")}
                      </span>
                    )}
                  </div>
                </div>
                {r.status==="OPEN"&&(
                  <button onClick={()=>handleClose(r.id)} disabled={closing===r.id} className="btn-secondary btn-sm" style={{color:"#f43f5e"}}>
                    {closing===r.id?<Loader2 style={{width:13,height:13}} className="animate-spin"/>:<X style={{width:13,height:13}}/>} Close RFQ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}