"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_API_KEYS } from "@/lib/mock-data";
import { Copy, Plus, Eye, EyeOff, Trash2 } from "lucide-react";

export default function ApiKeysPage() {
  const [shown, setShown] = useState<string[]>([]);
  const toggle = (id: string) => setShown(v => v.includes(id) ? v.filter(x=>x!==id) : [...v,id]);

  return (
    <div>
      <PageHeader title="API Keys" subtitle="Manage programmatic access to the Klaxon API"
        action={<button className="btn-primary btn-sm"><Plus className="w-3.5 h-3.5"/>Generate Key</button>} />

      <div style={{marginBottom:16,padding:"12px 16px",borderRadius:12,background:"rgba(20,184,142,0.06)",border:"1px solid var(--bd-k)"}}>
        <p style={{fontSize:12,color:"var(--tx-2)"}}>
          🔐 Keep your API keys secret. Never expose them in client-side code or public repositories.
          Keys prefixed with <span style={{fontFamily:"'DM Mono',monospace",color:"var(--k)"}}>klx_live_</span> are production keys.
        </p>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {MOCK_API_KEYS.map(k => (
          <div key={k.id} className="card" style={{opacity: k.status==="Revoked"?0.5:1}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
              <div>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"var(--tx-1)"}}>{k.name}</p>
                <p style={{fontSize:11,color:"var(--tx-3)",marginTop:2}}>Created {k.created} · Last used {k.lastUsed}</p>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <StatusBadge status={k.status} />
                {k.status !== "Revoked" && (
                  <button className="btn-danger btn-sm" style={{padding:"4px 8px"}}>
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:8,background:"var(--bg-root)",border:"1px solid var(--bd-1)"}}>
              <code style={{flex:1,fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--tx-2)"}}>
                {shown.includes(k.id) ? k.key.replace(/•/g,"x") : k.key}
              </code>
              <button onClick={() => toggle(k.id)} className="btn-ghost btn-sm" style={{padding:"4px 6px"}}>
                {shown.includes(k.id) ? <EyeOff className="w-3.5 h-3.5"/> : <Eye className="w-3.5 h-3.5"/>}
              </button>
              <button onClick={() => navigator.clipboard.writeText(k.key)} className="btn-ghost btn-sm" style={{padding:"4px 6px"}}>
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div style={{display:"flex",gap:5,marginTop:10}}>
              {k.perms.map(p => <span key={p} className="badge badge-k" style={{fontSize:10}}>{p}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}