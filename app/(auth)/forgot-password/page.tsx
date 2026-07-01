"use client";
import { useState } from "react";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { KlaxonMark } from "@/components/layout/klaxon-mark";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch {
      // Always show success to prevent email enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-root)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(20,184,142,0.06) 0%, transparent 60%)",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:32 }}>
          <KlaxonMark size="md" />
        </div>

        {!sent ? (
          <div className="card">
            {/* Header */}
            <div style={{ marginBottom:24 }}>
              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:"var(--tx-1)", marginBottom:6 }}>
                Reset your password
              </h1>
              <p style={{ fontSize:13, color:"var(--tx-2)", lineHeight:1.6 }}>
                Enter your email and we'll send you a link to reset your password.
              </p>
            </div>

            {error && (
              <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(244,63,94,0.08)", border:"1px solid rgba(244,63,94,0.2)", color:"#f43f5e", fontSize:12, marginBottom:16 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                <label style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                  Email Address
                </label>
                <div style={{ position:"relative" }}>
                  <Mail style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", width:14, height:14, color:"var(--tx-3)", pointerEvents:"none" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="kx-input"
                    style={{ paddingLeft:32 }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary btn-lg"
                style={{ justifyContent:"center" }}
              >
                {loading ? (
                  <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ width:14, height:14, borderRadius:"50%", border:"2px solid rgba(7,8,10,0.3)", borderTopColor:"#07080a", animation:"spin 0.6s linear infinite", display:"inline-block" }} />
                    Sending...
                  </span>
                ) : (
                  <><span>Send Reset Link</span><ArrowRight style={{ width:16, height:16 }} /></>
                )}
              </button>
            </form>

            <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid var(--bd-1)", textAlign:"center" }}>
              <a href="/login" style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:12, color:"var(--tx-3)", textDecoration:"none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--k)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--tx-3)")}>
                <ArrowLeft style={{ width:12, height:12 }} /> Back to login
              </a>
            </div>
          </div>
        ) : (
          /* Success state */
          <div className="card" style={{ textAlign:"center" }}>
            <div style={{ width:60, height:60, borderRadius:18, background:"var(--k-subtle)", border:"1px solid var(--bd-k)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px" }}>
              <Mail style={{ width:28, height:28, color:"var(--k)" }} />
            </div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:"var(--tx-1)", marginBottom:8 }}>
              Check your inbox
            </h2>
            <p style={{ fontSize:13, color:"var(--tx-2)", lineHeight:1.6, marginBottom:6 }}>
              If an account exists for <strong style={{ color:"var(--tx-1)" }}>{email}</strong>, you'll receive a password reset link shortly.
            </p>
            <p style={{ fontSize:11, color:"var(--tx-3)", marginBottom:24 }}>
              Check your spam folder if you don't see it within a few minutes.
            </p>
            <a href="/login"
              style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:12, color:"var(--tx-3)", textDecoration:"none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--k)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--tx-3)")}>
              <ArrowLeft style={{ width:12, height:12 }} /> Back to login
            </a>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}