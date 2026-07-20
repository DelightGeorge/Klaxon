"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAuditLogs, type AuditLog } from "@/lib/hooks/use-compliance";
import { Shield, Loader2, RefreshCw, Search } from "lucide-react";

export default function AuditPage() {
  const [action, setAction] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading, refetch } = useAuditLogs({ action: action||undefined, page });
  const logs = data?.logs ?? [];

  return (
    <div>
      <PageHeader badge="LIVE" badgeVariant="live" title="Audit Logs" subtitle={`${data?.total??0} total events`}
        action={<button onClick={refetch} className="btn-secondary btn-sm"><RefreshCw style={{width:13,height:13}}/> Refresh</button>}/>

      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <div style={{position:"relative",maxWidth:280}}>
          <Search style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",width:13,height:13,color:"var(--tx-3)"}}/>
          <input value={action} onChange={e=>setAction(e.target.value)} placeholder="Filter by action..." className="kx-input" style={{paddingLeft:30}}/>
        </div>
      </div>

      <div className="card" style={{padding:0}}>
        {loading ? (
          <div style={{display:"flex",justifyContent:"center",padding:48}}><Loader2 style={{width:24,height:24,color:"var(--k)"}} className="animate-spin"/></div>
        ) : logs.length===0 ? (
          <div style={{textAlign:"center",padding:64}}>
            <Shield style={{width:32,height:32,color:"var(--tx-3)",margin:"0 auto 12px"}}/>
            <p style={{fontSize:13,color:"var(--tx-3)"}}>No audit logs found</p>
          </div>
        ) : (
          <>
            <div style={{overflowX:"auto"}}>
              <table className="kx-table" style={{minWidth:600}}>
                <thead><tr><th>Action</th><th>User</th><th>IP Address</th><th>Time</th></tr></thead>
                <tbody>
                  {logs.map((l:AuditLog)=>(
                    <tr key={l.id}>
                      <td><span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--k)",background:"var(--k-subtle)",padding:"2px 7px",borderRadius:5}}>{l.action}</span></td>
                      <td>
                        <p style={{fontSize:12,fontWeight:500}}>{l.user?`${l.user.firstName} ${l.user.lastName}`:"System"}</p>
                        {l.user && <p style={{fontSize:10,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace"}}>{l.user.email}</p>}
                      </td>
                      <td><span style={{fontSize:11,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace"}}>{l.ipAddress??"—"}</span></td>
                      <td><span style={{fontSize:11,color:"var(--tx-3)"}}>{new Date(l.createdAt).toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",borderTop:"1px solid var(--bd-1)"}}>
              <span style={{fontSize:11,color:"var(--tx-3)"}}>Page {page} of {data?.totalPages??1}</span>
              <div style={{display:"flex",gap:6}}>
                <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="btn-secondary btn-sm" style={{padding:"4px 10px"}}>Prev</button>
                <button disabled={page>=(data?.totalPages??1)} onClick={()=>setPage(p=>p+1)} className="btn-secondary btn-sm" style={{padding:"4px 10px"}}>Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}