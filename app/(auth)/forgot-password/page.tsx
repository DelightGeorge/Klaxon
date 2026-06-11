"use client";

import { useState } from "react";
import { ArrowRight, Mail, ArrowLeft } from "lucide-react";
import { KlaxonMark } from "@/components/layout/klaxon-mark";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-root)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(20,184,142,0.06) 0%, transparent 60%)",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", marginBottom: 16 }}>
            <KlaxonMark size="md" />
          </div>
        </div>

        <div style={{ background: "var(--bg-surface)", borderRadius: 16, padding: 36, border: "1px solid var(--bd-1)" }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--k-subtle)", border: "1px solid var(--bd-k)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Mail style={{ width: 24, height: 24, color: "var(--k)" }} />
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--tx-1)", marginBottom: 8 }}>Check your email</h1>
              <p style={{ fontSize: 13, color: "var(--tx-2)", lineHeight: 1.6, marginBottom: 24 }}>
                We sent a password reset link to <strong style={{ color: "var(--tx-1)" }}>{email}</strong>
              </p>
              <a href="/login" style={{ fontSize: 12, color: "var(--k)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <ArrowLeft style={{ width: 14, height: 14 }} /> Back to sign in
              </a>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--tx-1)", marginBottom: 6 }}>Reset your password</h1>
              <p style={{ fontSize: 13, color: "var(--tx-2)", marginBottom: 24, lineHeight: 1.6 }}>
                Enter your email and we will send you a reset link.
              </p>

              {error && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", color: "#f43f5e", fontSize: 12, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <label style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</label>
                  <div style={{ position: "relative" }}>
                    <Mail style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--tx-3)", pointerEvents: "none" }} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="kx-input" style={{ paddingLeft: 32 }} placeholder="you@example.com" required />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary btn-lg" style={{ marginTop: 4, justifyContent: "center" }}>
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(7,8,10,0.3)", borderTopColor: "#07080a", animation: "spin 0.6s linear infinite", display: "inline-block" }} />
                      Sending...
                    </span>
                  ) : (
                    <><span>Send reset link</span><ArrowRight style={{ width: 16, height: 16 }} /></>
                  )}
                </button>
              </form>

              <div style={{ marginTop: 20, textAlign: "center" }}>
                <a href="/login" style={{ fontSize: 12, color: "var(--tx-3)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--k)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--tx-3)")}>
                  <ArrowLeft style={{ width: 13, height: 13 }} /> Back to sign in
                </a>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
