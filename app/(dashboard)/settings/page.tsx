"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useAuthStore } from "@/lib/auth-store";
import { useActiveSessions, useRevokeSession } from "@/lib/hooks/use-users";
import { api } from "@/lib/api";
import { User, Lock, Monitor, Loader2, CheckCircle, LogOut, Shield } from "lucide-react";

export default function SettingsPage() {
  const user = useAuthStore(s => s.user);
  const [tab, setTab] = useState<"profile"|"password"|"sessions">("profile");
  const [pwForm, setPwForm] = useState({ currentPassword:"", newPassword:"", confirm:"" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwError, setPwError] = useState("");
  const { data: sessionsData, refetch } = useActiveSessions();
  const sessions = sessionsData?.sessions ?? [];
  const revokeSession = useRevokeSession();

  const handlePasswordChange = async (e:React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { setPwError("Passwords do not match"); return; }
    setSaving(true); setPwError("");
    try {
      await api.post("/auth/change-password", { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setSaved(true); setPwForm({ currentPassword:"", newPassword:"", confirm:"" });
      setTimeout(() => setSaved(false), 3000);
    } catch (e:unknown) {
      setPwError((e as {response?:{data?:{message?:string}}})?.response?.data?.message ?? "Failed to update password");
    } finally { setSaving(false); }
  };

  const handleRevoke = async (id: string) => {
    await revokeSession.mutate(undefined, `/auth/sessions/${id}`);
    refetch();
  };

  const TABS = [
    { key:"profile",  label:"Profile",  icon:<User style={{width:14,height:14}}/> },
    { key:"password", label:"Password", icon:<Lock style={{width:14,height:14}}/> },
    { key:"sessions", label:"Sessions", icon:<Monitor style={{width:14,height:14}}/> },
  ];

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account and security"/>

      <div style={{display:"flex",gap:0,marginBottom:24,borderBottom:"1px solid var(--bd-1)"}}>
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key as typeof tab)} style={{
            display:"flex",alignItems:"center",gap:6,padding:"9px 16px",fontSize:12,fontWeight:600,cursor:"pointer",border:"none",background:"transparent",fontFamily:"'Syne',sans-serif",
            borderBottom:tab===t.key?"2px solid var(--k)":"2px solid transparent",color:tab===t.key?"var(--k)":"var(--tx-3)",marginBottom:-1,transition:"all 0.15s",
          }}>{t.icon}{t.label}</button>
        ))}
      </div>

      {tab==="profile" && (
        <div className="card" style={{maxWidth:480}}>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"var(--tx-1)",marginBottom:16}}>Profile Information</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
            {[
              {label:"First Name",value:user?.firstName??"—"},
              {label:"Last Name",value:user?.lastName??"—"},
              {label:"Email",value:user?.email??"—"},
              {label:"Role",value:user?.roles?.[0]?.replace(/_/g," ")??"—"},
            ].map(r=>(
              <div key={r.label}>
                <p style={{fontSize:10,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{r.label}</p>
                <p style={{fontSize:13,color:"var(--tx-1)",fontWeight:500}}>{r.value}</p>
              </div>
            ))}
          </div>
          <div style={{padding:"10px 14px",borderRadius:10,background:"var(--k-subtle)",border:"1px solid var(--bd-k)",fontSize:12,color:"var(--tx-2)"}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><Shield style={{width:13,height:13,color:"var(--k)"}}/> Profile editing coming soon. Contact your admin to update details.</div>
          </div>
        </div>
      )}

      {tab==="password" && (
        <div className="card" style={{maxWidth:400}}>
          <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"var(--tx-1)",marginBottom:16}}>Change Password</h3>
          {saved && (
            <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(20,184,142,0.08)",border:"1px solid var(--bd-k)",color:"var(--k)",fontSize:12,marginBottom:16,display:"flex",alignItems:"center",gap:6}}>
              <CheckCircle style={{width:13,height:13}}/> Password updated successfully
            </div>
          )}
          {pwError && (
            <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(244,63,94,0.08)",border:"1px solid rgba(244,63,94,0.2)",color:"#f43f5e",fontSize:12,marginBottom:16}}>
              {pwError}
            </div>
          )}
          <form onSubmit={handlePasswordChange} style={{display:"flex",flexDirection:"column",gap:12}}>
            {[
              {label:"Current Password",key:"currentPassword"},
              {label:"New Password",key:"newPassword"},
              {label:"Confirm New Password",key:"confirm"},
            ].map(f=>(
              <div key={f.key} style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{f.label}</label>
                <input type="password" value={pwForm[f.key as keyof typeof pwForm]} onChange={e=>setPwForm(v=>({...v,[f.key]:e.target.value}))} className="kx-input" required/>
              </div>
            ))}
            <button type="submit" disabled={saving} className="btn-primary btn-sm" style={{marginTop:4,justifyContent:"center"}}>
              {saving?<Loader2 style={{width:13,height:13}} className="animate-spin"/>:<Lock style={{width:13,height:13}}/>}
              {saving?"Updating...":"Update Password"}
            </button>
          </form>
        </div>
      )}

      {tab==="sessions" && (
        <div style={{maxWidth:560}}>
          <p style={{fontSize:12,color:"var(--tx-3)",marginBottom:16}}>These are all devices currently logged into your account.</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {sessions.map(s=>(
              <div key={s.id} className="card" style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:36,height:36,borderRadius:10,background:"var(--bg-overlay)",border:"1px solid var(--bd-1)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Monitor style={{width:16,height:16,color:"var(--tx-2)"}}/>
                  </div>
                  <div>
                    <p style={{fontSize:12,fontWeight:600,color:"var(--tx-1)",textTransform:"capitalize"}}>{s.deviceType}</p>
                    <p style={{fontSize:10,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace"}}>{s.ipAddress} · Last active {new Date(s.lastActiveAt).toLocaleDateString("en-GB")}</p>
                  </div>
                </div>
                <button onClick={()=>handleRevoke(s.id)} disabled={revokeSession.loading} className="btn-secondary btn-sm" style={{padding:"4px 8px",fontSize:11,color:"#f43f5e",flexShrink:0}}>
                  <LogOut style={{width:11,height:11}}/> Revoke
                </button>
              </div>
            ))}
            {sessions.length===0 && <p style={{fontSize:13,color:"var(--tx-3)",textAlign:"center",padding:32}}>No active sessions found</p>}
          </div>
        </div>
      )}
    </div>
  );
}