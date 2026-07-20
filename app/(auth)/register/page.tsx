"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Lock, Mail, User, Phone } from "lucide-react";
import { KlaxonMark } from "@/components/layout/klaxon-mark";
import { useAuthStore } from "@/lib/auth-store";

export default function RegisterPage() {
  const router   = useRouter();
  const register = useAuthStore(s => s.register);
  const isLoading = useAuthStore(s => s.isLoading);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "", confirm: "",
  });
  const [showPwd, setShowPwd]   = useState(false);
  const [error,   setError]     = useState("");
  const [success, setSuccess]   = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(v => ({ ...v, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      await register({
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        password:  form.password,
        phone:     form.phone || undefined,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? "Registration failed. Please try again.";
      setError(msg);
    }
  };

  const field = (label: string, key: keyof typeof form, type = "text", icon: React.ReactNode, placeholder: string) => (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>
      <div style={{ position:"relative" }}>
        <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--tx-3)", pointerEvents:"none", display:"flex" }}>{icon}</span>
        <input type={type} value={form[key]} onChange={update(key)} placeholder={placeholder}
          className="kx-input" style={{ paddingLeft:32 }} required />
      </div>
    </div>
  );

  if (success) {
    return (
      <div style={{ minHeight:"100vh", background:"var(--bg-root)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center", maxWidth:400 }}>
          <div style={{ width:64, height:64, borderRadius:20, background:"var(--k-subtle)", border:"1px solid var(--bd-k)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--k)" strokeWidth={2} style={{ width:28, height:28 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, color:"var(--tx-1)", marginBottom:8 }}>Account Created!</h2>
          <p style={{ fontSize:13, color:"var(--tx-2)", lineHeight:1.6 }}>
            Check your email to verify your account. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight:"100vh", background:"var(--bg-root)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
      backgroundImage:"radial-gradient(ellipse at 20% 50%, rgba(20,184,142,0.06) 0%, transparent 60%)",
    }}>
      <div style={{ width:"100%", maxWidth:480 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-flex", marginBottom:16 }}>
            <KlaxonMark size="md" />
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, color:"var(--tx-1)", marginBottom:6 }}>Create your account</h1>
          <p style={{ fontSize:13, color:"var(--tx-2)" }}>Join the Klaxon healthcare network</p>
        </div>

        <div className="card">
          {error && (
            <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(244,63,94,0.08)", border:"1px solid rgba(244,63,94,0.2)", color:"#f43f5e", fontSize:12, marginBottom:16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {field("First Name", "firstName", "text", <User style={{ width:14, height:14 }} />, "John")}
              {field("Last Name",  "lastName",  "text", <User style={{ width:14, height:14 }} />, "Doe")}
            </div>
            {field("Email Address", "email", "email", <Mail style={{ width:14, height:14 }} />, "you@example.com")}
            {field("Phone (optional)", "phone", "tel", <Phone style={{ width:14, height:14 }} />, "+2348012345678")}

            {/* Password */}
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <label style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Password</label>
              <div style={{ position:"relative" }}>
                <Lock style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", width:14, height:14, color:"var(--tx-3)", pointerEvents:"none" }} />
                <input type={showPwd ? "text" : "password"} value={form.password} onChange={update("password")}
                  placeholder="Min 8 characters" className="kx-input" style={{ paddingLeft:32, paddingRight:36 }} required />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--tx-3)", display:"flex", padding:0 }}>
                  {showPwd ? <EyeOff style={{ width:14, height:14 }} /> : <Eye style={{ width:14, height:14 }} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <label style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Confirm Password</label>
              <div style={{ position:"relative" }}>
                <Lock style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", width:14, height:14, color:"var(--tx-3)", pointerEvents:"none" }} />
                <input type="password" value={form.confirm} onChange={update("confirm")}
                  placeholder="Repeat password" className="kx-input" style={{ paddingLeft:32 }} required />
              </div>
            </div>

            {/* Password checklist */}
            {form.password.length > 0 && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4 }}>
                {[
                  { label:"8+ characters",   ok: form.password.length >= 8 },
                  { label:"Uppercase letter", ok: /[A-Z]/.test(form.password) },
                  { label:"Number",           ok: /[0-9]/.test(form.password) },
                  { label:"Special char",     ok: /[@$!%*?&]/.test(form.password) },
                ].map(r => (
                  <div key={r.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background: r.ok ? "var(--k)" : "var(--tx-3)", flexShrink:0 }} />
                    <span style={{ fontSize:10, color: r.ok ? "var(--k)" : "var(--tx-3)", fontFamily:"'DM Mono',monospace" }}>{r.label}</span>
                  </div>
                ))}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary btn-lg" style={{ marginTop:4, justifyContent:"center" }}>
              {isLoading ? (
                <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:14, height:14, borderRadius:"50%", border:"2px solid rgba(7,8,10,0.3)", borderTopColor:"#07080a", animation:"spin 0.6s linear infinite", display:"inline-block" }} />
                  Creating account...
                </span>
              ) : (
                <><span>Create Account</span><ArrowRight style={{ width:16, height:16 }} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid var(--bd-1)", textAlign:"center" }}>
            <p style={{ fontSize:12, color:"var(--tx-3)" }}>
              Already have an account?{" "}
              <a href="/login" style={{ color:"var(--k)", textDecoration:"none", fontWeight:600 }}>Sign in</a>
            </p>
          </div>
        </div>

        <p style={{ marginTop:16, fontSize:11, color:"var(--tx-3)", textAlign:"center" }}>
          Want to register your organisation?{" "}
          <a href="/apply" style={{ color:"var(--k)", textDecoration:"none" }}>Apply here</a>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}