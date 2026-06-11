"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Zap, Eye, EyeOff, ArrowRight, Lock, Mail } from "lucide-react";

const DEMO_ACCOUNTS = [
  { role:"Super Admin",    email:"admin@klaxon.health",    password:"Admin@123" },
  { role:"Manufacturer",   email:"mfg@klaxon.health",      password:"Mfg@123" },
  { role:"Distributor",    email:"dist@klaxon.health",     password:"Dist@123" },
  { role:"Pharmacy Admin", email:"pharma@klaxon.health",   password:"Pharma@123" },
  { role:"PPMV Operator",  email:"ppmv@klaxon.health",     password:"Ppmv@123" },
  { role:"Warehouse Mgr",  email:"warehouse@klaxon.health",password:"Wh@123" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@klaxon.health");
  const [password, setPassword] = useState("Admin@123");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const valid = DEMO_ACCOUNTS.find(a => a.email === email && a.password === password);
    if (!valid) { setError("Invalid credentials. Use a demo account below."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    router.push("/dashboard");
  };

  return (
    <div style={{minHeight:"100vh",background:"var(--bg-root)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,
      backgroundImage:"radial-gradient(ellipse at 20% 50%, rgba(20,184,142,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 10%, rgba(20,184,142,0.04) 0%, transparent 50%)"}}>
      <div style={{width:"100%",maxWidth:880,display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,borderRadius:20,overflow:"hidden",border:"1px solid var(--bd-1)",boxShadow:"0 32px 80px rgba(0,0,0,0.5)"}}>

        {/* Left panel */}
        <div style={{background:"linear-gradient(135deg, #0d1a15 0%, #07080a 100%)",padding:48,display:"flex",flexDirection:"column",gap:0,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-80,right:-80,width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle, rgba(20,184,142,0.12) 0%, transparent 70%)",pointerEvents:"none"}} />
          <div style={{position:"absolute",bottom:-40,left:-40,width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle, rgba(20,184,142,0.06) 0%, transparent 70%)",pointerEvents:"none"}} />

          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:48}}>
            <div style={{width:36,height:36,borderRadius:10,background:"var(--k)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 20px var(--k-glow)"}}>
              <Zap className="w-5 h-5" style={{color:"#07080a"}} />
            </div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:20,letterSpacing:"-0.03em",color:"var(--tx-1)"}}>KLAXON</span>
          </div>

          <div style={{flex:1}}>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:"var(--tx-1)",letterSpacing:"-0.04em",lineHeight:1.2,marginBottom:12}}>
              Healthcare Supply Chain Infrastructure
            </h2>
            <p style={{fontSize:13,color:"var(--tx-2)",lineHeight:1.7,marginBottom:32}}>
              Drug inventory management, GTIN tracking, digital procurement, and fulfillment coordination — all in one platform.
            </p>

            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {["₦2.8B+ inventory tracked","12,830+ PPMVs connected","98,000+ deliveries fulfilled","Real-time compliance monitoring"].map(f => (
                <div key={f} style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"var(--k)",boxShadow:"0 0 6px var(--k)",flexShrink:0}} />
                  <span style={{fontSize:12,color:"var(--tx-2)"}}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{marginTop:40,paddingTop:20,borderTop:"1px solid var(--bd-1)"}}>
            <p style={{fontSize:11,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Demo Accounts</p>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {DEMO_ACCOUNTS.map(a => (
                <button key={a.email} onClick={() => { setEmail(a.email); setPassword(a.password); }}
                  style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 10px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid var(--bd-1)",cursor:"pointer",transition:"all 0.15s",textAlign:"left"}}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="var(--bd-k)"; e.currentTarget.style.background="var(--k-subtle)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="var(--bd-1)"; e.currentTarget.style.background="rgba(255,255,255,0.03)"; }}>
                  <span style={{fontSize:11,color:"var(--tx-1)",fontWeight:600,fontFamily:"'Syne',sans-serif"}}>{a.role}</span>
                  <span style={{fontSize:10,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace"}}>{a.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{background:"var(--bg-surface)",padding:48,display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:"var(--tx-1)",letterSpacing:"-0.03em",marginBottom:6}}>
            Sign in
          </h1>
          <p style={{fontSize:13,color:"var(--tx-2)",marginBottom:28}}>Access your Klaxon dashboard</p>

          {error && (
            <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(244,63,94,0.08)",border:"1px solid rgba(244,63,94,0.2)",color:"#f43f5e",fontSize:12,marginBottom:16}}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Email</label>
              <div style={{position:"relative"}}>
                <Mail style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",width:14,height:14,color:"var(--tx-3)"}} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="kx-input" style={{paddingLeft:32}} required />
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Password</label>
              <div style={{position:"relative"}}>
                <Lock style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",width:14,height:14,color:"var(--tx-3)"}} />
                <input type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  className="kx-input" style={{paddingLeft:32,paddingRight:36}} required />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--tx-3)"}}>
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary btn-lg" style={{marginTop:4,justifyContent:"center"}}>
              {loading ? (
                <span style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(7,8,10,0.3)",borderTopColor:"#07080a",animation:"spin 0.6s linear infinite"}} />
                  Signing in...
                </span>
              ) : (
                <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p style={{marginTop:20,fontSize:11,color:"var(--tx-3)",textAlign:"center"}}>
            Click any demo account on the left to auto-fill credentials
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}