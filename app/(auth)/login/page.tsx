"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Lock, Mail } from "lucide-react";
import { KlaxonMark } from "@/components/layout/klaxon-mark";
import { useAuthStore } from "@/lib/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const destination = await login(email, password);
      router.push(destination);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Invalid email or password.";
      setError(msg);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-root)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(20,184,142,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 10%, rgba(20,184,142,0.04) 0%, transparent 50%)",
      }}
    >
      <div
        className="login-card"
        style={{
          width: "100%",
          maxWidth: 880,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid var(--bd-1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Left panel — hidden on mobile */}
        <div
          className="login-left"
          style={{
            background: "linear-gradient(135deg, #0d1a15 0%, #07080a 100%)",
            padding: 48,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(20,184,142,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -40,
              left: -40,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(20,184,142,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ marginBottom: 48, position: "relative" }}>
            <KlaxonMark size="md" />
          </div>

          <div style={{ flex: 1, position: "relative" }}>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: "var(--tx-1)",
                letterSpacing: "-0.04em",
                lineHeight: 1.2,
                marginBottom: 12,
              }}
            >
              Healthcare Supply Chain Infrastructure
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "var(--tx-2)",
                lineHeight: 1.7,
                marginBottom: 32,
              }}
            >
              Drug inventory management, GTIN tracking, digital procurement, and
              fulfillment coordination — all in one platform.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "₦2.8B+ inventory tracked",
                "12,830+ PPMVs connected",
                "98,000+ deliveries fulfilled",
                "Real-time compliance monitoring",
              ].map((feat) => (
                <div
                  key={feat}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "var(--k)",
                      boxShadow: "0 0 6px var(--k)",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 12, color: "var(--tx-2)" }}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 40,
              paddingTop: 20,
              borderTop: "1px solid var(--bd-1)",
            }}
          >
            <p style={{ fontSize: 12, color: "var(--tx-3)", lineHeight: 1.6 }}>
              Klaxon connects manufacturers, distributors, pharmacies, and PPMVs
              on a single verified supply chain platform.
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div
          style={{
            background: "var(--bg-surface)",
            padding: 48,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          className="login-right"
        >
          {/* Logo shown only on mobile (left panel is hidden) */}
          <div
            className="login-mobile-logo"
            style={{ display: "none", marginBottom: 24 }}
          >
            <KlaxonMark size="md" />
          </div>

          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--tx-1)",
              letterSpacing: "-0.03em",
              marginBottom: 6,
            }}
          >
            Sign in
          </h1>
          <p style={{ fontSize: 13, color: "var(--tx-2)", marginBottom: 28 }}>
            Access your Klaxon dashboard
          </p>

          {error && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(244,63,94,0.08)",
                border: "1px solid rgba(244,63,94,0.2)",
                color: "#f43f5e",
                fontSize: 12,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label
                style={{
                  fontSize: 11,
                  fontFamily: "'DM Mono', monospace",
                  color: "var(--tx-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 14,
                    height: 14,
                    color: "var(--tx-3)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="kx-input"
                  style={{ paddingLeft: 32 }}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label
                style={{
                  fontSize: 11,
                  fontFamily: "'DM Mono', monospace",
                  color: "var(--tx-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 14,
                    height: 14,
                    color: "var(--tx-3)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="kx-input"
                  style={{ paddingLeft: 32, paddingRight: 36 }}
                  placeholder="Your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--tx-3)",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  {showPwd ? (
                    <EyeOff style={{ width: 14, height: 14 }} />
                  ) : (
                    <Eye style={{ width: 14, height: 14 }} />
                  )}
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: -6,
              }}
            >
              <a
                href="/forgot-password"
                style={{
                  fontSize: 11,
                  color: "var(--tx-3)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--k)")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--tx-3)")
                }
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary btn-lg"
              style={{ marginTop: 4, justifyContent: "center" }}
            >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: "2px solid rgba(7,8,10,0.3)",
                      borderTopColor: "#07080a",
                      animation: "spin 0.6s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Signing in...
                </span>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          </form>

          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid var(--bd-1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <p style={{ fontSize: 12, color: "var(--tx-3)" }}>
              {"Don't have an account? "}
              <a
                href="/register"
                style={{
                  color: "var(--k)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Create account
              </a>
            </p>
            <p style={{ fontSize: 12, color: "var(--tx-3)" }}>
              <a
                href="/shop"
                style={{
                  color: "var(--k)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Browse Medicine Shop
              </a>
              {" · "}
              <a
                href="/apply"
                style={{ color: "var(--tx-3)", textDecoration: "none" }}
              >
                Register Organisation
              </a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .login-card {
            grid-template-columns: 1fr !important;
            max-width: 440px !important;
          }
          .login-left {
            display: none !important;x
          }
          .login-right {
            padding: 32px 24px !important;
          }
          .login-mobile-logo {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
