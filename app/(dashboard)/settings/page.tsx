"use client";
import { PageHeader } from "@/components/ui/page-header";
import { MOCK_USER } from "@/lib/mock-data";
import { useState } from "react";

const SECTIONS = ["Profile","Security","Notifications","Integrations","Billing","Advanced"];

export default function SettingsPage() {
  const [active, setActive] = useState("Profile");

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account and platform configuration" />
      <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:20}}>
        <div className="card" style={{padding:"8px",height:"fit-content"}}>
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setActive(s)}
              className={`nav-item w-full ${active===s?"active":""}`}
              style={{width:"100%",justifyContent:"flex-start"}}>
              {s}
            </button>
          ))}
        </div>

        <div className="card">
          {active === "Profile" && (
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16}}>Profile Settings</p>
              <div style={{display:"flex",alignItems:"center",gap:16,padding:"16px",borderRadius:12,background:"var(--bg-raised)",border:"1px solid var(--bd-1)"}}>
                <div style={{width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,var(--k),#0d9472)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#07080a",fontFamily:"'Syne',sans-serif"}}>
                  {MOCK_USER.avatar}
                </div>
                <div>
                  <p style={{fontWeight:700,fontSize:15,color:"var(--tx-1)"}}>{MOCK_USER.name}</p>
                  <p style={{fontSize:12,color:"var(--tx-3)",marginTop:2}}>{MOCK_USER.email}</p>
                  <span className="badge badge-k" style={{marginTop:5,display:"inline-flex"}}>{MOCK_USER.role}</span>
                </div>
                <button className="btn-secondary btn-sm" style={{marginLeft:"auto"}}>Change Photo</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[{label:"First Name",value:"Delight"},{label:"Last Name",value:"George"},{label:"Email",value:MOCK_USER.email},{label:"Organisation",value:MOCK_USER.org}].map(f => (
                  <div key={f.label} style={{display:"flex",flexDirection:"column",gap:5}}>
                    <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{f.label}</label>
                    <input defaultValue={f.value} className="kx-input" />
                  </div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"flex-end",paddingTop:8,borderTop:"1px solid var(--bd-1)"}}>
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          )}
          {active !== "Profile" && (
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <p style={{fontSize:14,color:"var(--tx-2)",fontWeight:600}}>{active} settings</p>
              <p style={{fontSize:12,color:"var(--tx-3)",marginTop:6}}>Configuration options for {active.toLowerCase()} coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}