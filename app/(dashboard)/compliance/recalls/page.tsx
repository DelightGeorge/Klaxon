"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useRecalls, useCreateRecall, type Recall } from "@/lib/hooks/use-compliance";
import { AlertTriangle, Plus, Loader2, RefreshCw, X } from "lucide-react";

const SEVERITIES = ["LOW","MEDIUM","HIGH","CRITICAL"];
const STATUSES = ["All","DRAFT","ACTIVE","IN_PROGRESS","COMPLETED","CANCELLED"];

export default function RecallsPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ productId:"",batchNumbers:"",reason:"",severity:"HIGH",correctiveAction:"",deadlineDate:"" });
  const { data, loading, refetch } = useRecalls(statusFilter==="All"?undefined:statusFilter);
  const recalls = Array.isArray(data) ? data : [];
  const create = useCreateRecall();

  const set_ = (k:keyof typeof form) => (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(v=>({...v,[k]:e.target.value}));

  const handleCreate = async (e:React.FormEvent) => {
    e.preventDefault();
    await create.mutate({
      productId: form.productId,
      batchNumbers: form.batchNumbers ? form.batchNumbers.split(",").map(s=>s.trim()) : [],
      reason: form.reason, severity: form.severity,
      correctiveAction: form.correctiveAction||undefined,
      deadlineDate: form.deadlineDate||undefined,
    });
    setShowCreate(false);
    setForm({productId:"",batchNumbers:"",reason:"",severity:"HIGH",correctiveAction:"",deadlineDate:""});
    refetch();
  };

  const severityColor = (s:string) => ({CRITICAL:"#f43f5e",HIGH:"#f59e0b",MEDIUM:"#3b82f6",LOW:"#22c55e"})[s]??"var(--tx-3)";

  return (
    <div>
      <PageHeader title="Product Recalls" subtitle={`${recalls.length} recalls`}
        action={
          <div style={{display:"flex",gap:8}}>
            <button onClick={refetch} className="btn-secondary btn-sm"><RefreshCw style={{width:13,height:13}}/> Refresh</button>
            <button onClick={()=>setShowCreate(true)} className="btn-primary btn-sm"><Plus style={{width:13,height:13}}/> New Recall</button>
          </div>
        }/>

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
      ) : recalls.length===0 ? (
        <div style={{textAlign:"center",padding:64}}>
          <AlertTriangle style={{width:32,height:32,color:"var(--tx-3)",margin:"0 auto 12px"}}/>
          <p style={{fontSize:13,color:"var(--tx-3)"}}>No recalls found</p>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {recalls.map((r:Recall)=>(
            <div key={r.id} className="card" style={{padding:"16px 20px",borderLeft:`3px solid ${severityColor(r.severity)}`}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--k)",fontWeight:700}}>{r.recallNumber}</span>
                    <StatusBadge status={r.status}/>
                    <span style={{fontSize:10,fontWeight:700,color:severityColor(r.severity),background:`${severityColor(r.severity)}18`,borderRadius:99,padding:"2px 8px",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.05em"}}>{r.severity}</span>
                  </div>
                  {r.product && <p style={{fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:14,color:"var(--tx-1)",marginBottom:4}}>{r.product.name}</p>}
                  <p style={{fontSize:12,color:"var(--tx-2)",lineHeight:1.5}}>{r.reason}</p>
                  {r.batchNumbers && r.batchNumbers.length>0 && (
                    <p style={{fontSize:11,color:"var(--tx-3)",marginTop:6,fontFamily:"'DM Mono',monospace"}}>
                      Batches: {r.batchNumbers.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div className="card" style={{width:"100%",maxWidth:500,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,color:"var(--tx-1)"}}>Create Recall</h2>
              <button onClick={()=>setShowCreate(false)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--tx-3)"}}><X style={{width:18,height:18}}/></button>
            </div>
            <form onSubmit={handleCreate} style={{display:"flex",flexDirection:"column",gap:12}}>
              {([
                {label:"Product ID",key:"productId",required:true,placeholder:"Product UUID"},
                {label:"Batch Numbers (comma-separated)",key:"batchNumbers",placeholder:"BATCH-001, BATCH-002 (leave empty for all)"},
                {label:"Deadline Date",key:"deadlineDate",placeholder:"",type:"datetime-local"},
              ] as {label:string;key:keyof typeof form;required?:boolean;placeholder:string;type?:string}[]).map(f=>(
                <div key={f.key} style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{f.label}</label>
                  <input type={f.type??"text"} value={form[f.key]} onChange={set_(f.key)} className="kx-input" required={f.required} placeholder={f.placeholder}/>
                </div>
              ))}
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Severity</label>
                <select value={form.severity} onChange={set_("severity")} className="kx-input">
                  {SEVERITIES.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Reason *</label>
                <textarea value={form.reason} onChange={set_("reason")} className="kx-input" style={{minHeight:70,resize:"vertical"}} required placeholder="Explain why this product is being recalled..."/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Corrective Action</label>
                <textarea value={form.correctiveAction} onChange={set_("correctiveAction")} className="kx-input" style={{minHeight:60,resize:"vertical"}} placeholder="Steps to address the issue..."/>
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:4}}>
                <button type="button" onClick={()=>setShowCreate(false)} className="btn-secondary btn-sm">Cancel</button>
                <button type="submit" disabled={create.loading} className="btn-primary btn-sm" style={{background:"#f43f5e"}}>
                  {create.loading?<Loader2 style={{width:13,height:13}} className="animate-spin"/>:<AlertTriangle style={{width:13,height:13}}/>} Create Recall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}