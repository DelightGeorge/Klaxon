"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Lock, Mail, Store, User } from "lucide-react";
import { KlaxonMark } from "@/components/layout/klaxon-mark";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { tokenStore } from "@/lib/api";
import Link from "next/link";

type PortalType = "ppmv" | "customer";

const PORTAL_ROLES: Record<string, string> = {
  PPMV_OWNER:    "/ppmv/dashboard",
  PATIENT:       "/dashboard",
  DELIVERY_AGENT:"/fulfillment/tracking",
};

export default function PortalLoginPage() {
  const router = useRouter();
  const [portalType, setPortalType] = useState<PortalType>("ppmv");
  const [tab, setTab]       = useState<"login" | "register">("login");
  const [email, setEmail]   = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState("");
  const [success, setSuccess]   = useState("");

  // Register fields
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [phone,     setPhone]     = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [bizName,   setBizName]   = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Enter your email and password"); return; }
    setError(""); setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(), password,
      });
      const { user, accessToken, refreshToken } = res.data;
      tokenStore.set(accessToken, refreshToken);
      useAuthStore.setState({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
      const role = user?.roles?.[0] ?? "";
      // Only allow portal roles
      const dest = PORTAL_ROLES[role];
      if (!dest) {
        setError("This account does not have portal access. Use the platform login.");
        tokenStore.clear();
        useAuthStore.setState({ user: null, isAuthenticated: false });
        setLoading(false);
        return;
      }
      router.push(dest);
    } catch (err: unknown) {
      setLoading(false);
      const e = err as { response?: { status?: number; data?: { message?: string } } };
      if (!e.response) { setError("Cannot reach server. Check your connection."); return; }
      const s = e.response.status;
      if (s === 401) { setError("Wrong email or password."); return; }
      if (s === 403) { setError("Account not verified. Check your email."); return; }
      setError(e.response.data?.message ?? `Login failed (${s})`);
    }
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) { setError("Fill in all required fields"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setError(""); setLoading(true);
    try {
      await api.post("/auth/register", {
        firstName, lastName, email: email.trim().toLowerCase(),
        password, phone: phone || undefined,
        ...(portalType === "ppmv" ? { businessName: bizName } : {}),
      });
      setSuccess("Account created! Check your email to verify.");
      setTab("login");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:"100vh", background:"var(--bg-root)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:20,
      backgroundImage:"radial-gradient(ellipse at 50% 30%, rgba(20,184,142,0.05) 0%, transparent 60%)",
    }}>
      {/* Back to landing */}
      <div style={{ position:"fixed", top:20, left:20 }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--tx-3)", textDecoration:"none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--tx-1)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--tx-3)")}>
          ← Back to home
        </Link>
      </div>

      {/* Logo */}
      <div style={{ marginBottom:28 }}>
        <KlaxonMark size="md" />
      </div>

      <div style={{ width:"100%", maxWidth:460 }}>
        {/* Portal type selector */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
          {([
            { key:"ppmv",     label:"PPMV / Vendor",    icon:Store, desc:"Patent medicine vendors" },
            { key:"customer", label:"Customer Access",   icon:User,  desc:"Patients & end users" },
          ] as { key: PortalType; label: string; icon: typeof Store; desc: string }[]).map(p => (
            <button key={p.key} type="button" onClick={() => { setPortalType(p.key); setError(""); }}
              style={{
                padding:"14px", borderRadius:12, border:`2px solid ${portalType===p.key?"var(--k)":"var(--bd-1)"}`,
                background: portalType===p.key ? "var(--k-subtle)" : "var(--bg-surface)",
                cursor:"pointer", transition:"all 0.15s", textAlign:"left",
              }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <p.icon style={{ width:14, height:14, color: portalType===p.key ? "var(--k)" : "var(--tx-3)" }} />
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color: portalType===p.key ? "var(--k)" : "var(--tx-1)" }}>{p.label}</span>
              </div>
              <p style={{ fontSize:11, color:"var(--tx-3)" }}>{p.desc}</p>
            </button>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, padding:4, background:"var(--bg-raised)", borderRadius:12, border:"1px solid var(--bd-1)", marginBottom:20 }}>
          {(["login","register"] as const).map(t => (
            <button key={t} type="button" onClick={() => { setTab(t); setError(""); setSuccess(""); }}
              style={{
                padding:"8px", borderRadius:9, fontSize:13, fontWeight:600,
                fontFamily:"'Syne',sans-serif", cursor:"pointer", border:"none", transition:"all 0.15s",
                background: tab===t ? "var(--bg-overlay)" : "transparent",
                color: tab===t ? "var(--k)" : "var(--tx-3)",
                boxShadow: tab===t ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
              }}>
              {t === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <div className="card">
          {/* Success */}
          {success && (
            <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(20,184,142,0.08)", border:"1px solid var(--bd-k)", color:"var(--k)", fontSize:12, marginBottom:14 }}>
              ✓ {success}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(244,63,94,0.08)", border:"1px solid rgba(244,63,94,0.25)", color:"#f87171", fontSize:13, marginBottom:14 }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {/* Register extra fields */}
            {tab === "register" && (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {[{label:"First Name",value:firstName,set:setFirstName},{label:"Last Name",value:lastName,set:setLastName}].map(f => (
                    <div key={f.label} style={{ display:"flex", flexDirection:"column", gap:4 }}>
                      <label style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{f.label} *</label>
                      <input value={f.value} onChange={e => f.set(e.target.value)} className="kx-input" placeholder={f.label} />
                    </div>
                  ))}
                </div>
                {portalType === "ppmv" && (
                  <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                    <label style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Business / Shop Name</label>
                    <input value={bizName} onChange={e => setBizName(e.target.value)} className="kx-input" placeholder="e.g. Mama Chidi Chemist" />
                  </div>
                )}
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <label style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Phone</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="kx-input" placeholder="+2348012345678" />
                </div>
              </>
            )}

            {/* Email */}
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              <label style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Email *</label>
              <div style={{ position:"relative" }}>
                <Mail style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", width:14, height:14, color:"var(--tx-3)", pointerEvents:"none" }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==="Enter" && (tab==="login"?handleLogin():handleRegister())}
                  className="kx-input" style={{ paddingLeft:32 }} placeholder="you@example.com" />
              </div>
            </div>

            {/* Password */}
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <label style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Password *</label>
                {tab === "login" && (
                  <Link href="/forgot-password" style={{ fontSize:11, color:"var(--tx-3)", textDecoration:"none" }}>Forgot?</Link>
                )}
              </div>
              <div style={{ position:"relative" }}>
                <Lock style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", width:14, height:14, color:"var(--tx-3)", pointerEvents:"none" }} />
                <input type={showPwd?"text":"password"} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==="Enter" && (tab==="login"?handleLogin():handleRegister())}
                  className="kx-input" style={{ paddingLeft:32, paddingRight:36 }} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd(v=>!v)}
                  style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--tx-3)", padding:0 }}>
                  {showPwd ? <EyeOff style={{ width:14, height:14 }} /> : <Eye style={{ width:14, height:14 }} />}
                </button>
              </div>
            </div>

            {/* Confirm password for register */}
            {tab === "register" && (
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Confirm Password *</label>
                <div style={{ position:"relative" }}>
                  <Lock style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", width:14, height:14, color:"var(--tx-3)", pointerEvents:"none" }} />
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                    className="kx-input" style={{ paddingLeft:32 }} placeholder="Repeat password" />
                </div>
              </div>
            )}

            {/* Submit */}
            <button type="button" onClick={tab==="login"?handleLogin:handleRegister} disabled={loading}
              className="btn-primary btn-lg" style={{ marginTop:4, justifyContent:"center" }}>
              {loading ? (
                <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:14, height:14, borderRadius:"50%", border:"2px solid rgba(7,8,10,0.3)", borderTopColor:"#07080a", animation:"spin 0.6s linear infinite", display:"inline-block" }} />
                  {tab==="login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                <><span>{tab==="login" ? "Sign in" : "Create Account"}</span><ArrowRight style={{ width:16, height:16 }} /></>
              )}
            </button>
          </div>
        </div>

        {/* Platform login link */}
        <p style={{ textAlign:"center", marginTop:16, fontSize:12, color:"var(--tx-3)" }}>
          Are you a distributor or organisation?{" "}
          <Link href="/login" style={{ color:"var(--k)", textDecoration:"none", fontWeight:600 }}>
            Platform login →
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}