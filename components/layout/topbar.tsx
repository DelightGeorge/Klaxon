"use client";
import { Bell, Search, ChevronDown, Settings, LogOut, User } from "lucide-react";
import { useState } from "react";
import { MOCK_USER } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

export function Topbar({ collapsed }: { collapsed: boolean }) {
  const [menu, setMenu] = useState(false);
  const router = useRouter();
  const left = collapsed ? 64 : 240;

  return (
    <header style={{
      position:"fixed", top:0, right:0, left,
      height:"var(--topbar)", zIndex:30,
      background:"rgba(12,14,18,0.85)",
      backdropFilter:"blur(20px)",
      borderBottom:"1px solid var(--bd-1)",
      display:"flex", alignItems:"center", gap:16, padding:"0 20px",
      transition:"left 0.3s cubic-bezier(0.4,0,0.2,1)",
    }}>
      {/* Search */}
      <div style={{flex:1, maxWidth:360, position:"relative"}}>
        <Search style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",width:14,height:14,color:"var(--tx-3)"}} />
        <input placeholder="Search products, orders, suppliers..." className="kx-input"
          style={{paddingLeft:32,fontSize:12,height:34}} />
      </div>

      <div style={{flex:1}} />

      {/* Status pill */}
      <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:99,background:"rgba(20,184,142,0.08)",border:"1px solid var(--bd-k)"}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"var(--k)",boxShadow:"0 0 6px var(--k)"}} />
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--k)",fontWeight:500}}>API LIVE</span>
      </div>

      {/* Alerts */}
      <button className="btn-ghost btn-sm" style={{position:"relative",padding:"6px 8px"}}>
        <Bell className="w-4 h-4" />
        <span style={{position:"absolute",top:4,right:4,width:6,height:6,borderRadius:"50%",background:"#f43f5e",border:"2px solid var(--bg-base)"}} />
      </button>

      {/* User */}
      <div style={{position:"relative"}}>
        <button onClick={() => setMenu(v => !v)}
          style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px",borderRadius:10,border:"1px solid var(--bd-1)",background:"var(--bg-raised)",cursor:"pointer",transition:"all 0.15s"}}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--bd-k)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--bd-1)")}>
          <div style={{width:26,height:26,borderRadius:8,background:"linear-gradient(135deg,var(--k),#0d9472)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#07080a",fontFamily:"'Syne',sans-serif"}}>
            {MOCK_USER.avatar}
          </div>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:12,fontWeight:600,color:"var(--tx-1)",fontFamily:"'Syne',sans-serif",lineHeight:1.2}}>{MOCK_USER.name}</div>
            <div style={{fontSize:10,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace"}}>{MOCK_USER.role}</div>
          </div>
          <ChevronDown style={{width:12,height:12,color:"var(--tx-3)",transform:menu?"rotate(180deg)":"none",transition:"transform 0.2s"}} />
        </button>

        {menu && (
          <>
            <div style={{position:"fixed",inset:0,zIndex:49}} onClick={() => setMenu(false)} />
            <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",width:200,background:"var(--bg-overlay)",border:"1px solid var(--bd-2)",borderRadius:12,overflow:"hidden",zIndex:50,boxShadow:"0 16px 40px rgba(0,0,0,0.4)"}}>
              <div style={{padding:"10px 14px",borderBottom:"1px solid var(--bd-1)"}}>
                <div style={{fontSize:12,fontWeight:600,color:"var(--tx-1)"}}>{MOCK_USER.name}</div>
                <div style={{fontSize:11,color:"var(--tx-3)",marginTop:1}}>{MOCK_USER.email}</div>
              </div>
              {[
                {icon:User,label:"Profile",action:()=>{}},
                {icon:Settings,label:"Settings",action:()=>router.push("/settings")},
              ].map(item => (
                <button key={item.label} onClick={item.action}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 14px",background:"transparent",border:"none",cursor:"pointer",color:"var(--tx-2)",fontSize:13,transition:"background 0.1s",fontFamily:"'DM Sans',sans-serif"}}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <item.icon className="w-4 h-4" />{item.label}
                </button>
              ))}
              <div style={{borderTop:"1px solid var(--bd-1)"}}>
                <button onClick={() => router.push("/login")}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 14px",background:"transparent",border:"none",cursor:"pointer",color:"#f43f5e",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(244,63,94,0.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <LogOut className="w-4 h-4" />Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}