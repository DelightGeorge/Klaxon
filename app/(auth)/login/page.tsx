"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Lock, Mail } from "lucide-react";
import { KlaxonMark } from "@/components/layout/klaxon-mark";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { tokenStore } from "@/lib/api";

const DEMO_ACCOUNTS = [
  {
    role: "Super Admin",
    email: "superadmin@healthcare.com",
    password: "Admin@123456",
  },
  { role: "Org Admin", email: "orgadmin@test.com", password: "Admin@123" },
  { role: "Doctor", email: "doctor@test.com", password: "Doctor@123" },
  { role: "Pharmacist", email: "pharma@test.com", password: "Pharma@123" },
  { role: "PPMV Operator", email: "ppmv@test.com", password: "Ppmv@123" },
  { role: "Distributor", email: "dist@test.com", password: "Dist@123" },
];

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("superadmin@healthcare.com");
  const [password, setPassword] = useState("Admin@123456");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password: password,
      });

      const { user, accessToken, refreshToken } = res.data;

      // Save tokens
      tokenStore.set(accessToken, refreshToken);

      // Save to store using proper actions
      const store = useAuthStore.getState();
      store.setTokens(accessToken, refreshToken);
      store.setUser(user);

      // Role-based redirect
      const ROLE_MAP: Record<string, string> = {
        SUPER_ADMIN: "/dashboard",
        ORG_ADMIN: "/dashboard",
        DOCTOR: "/dashboard",
        NURSE: "/dashboard",
        RECEPTIONIST: "/dashboard",
        PHARMACIST: "/inventory/products",
        LAB_TECHNICIAN: "/dashboard",
        RADIOLOGIST: "/dashboard",
        BILLING_OFFICER: "/admin/billing",
        INSURANCE_OFFICER: "/admin/billing",
        HR_MANAGER: "/admin/users",
        INVENTORY_MANAGER: "/inventory/products",
        PATIENT: "/dashboard",
        DISTRIBUTOR_ADMIN: "/fulfillment/orders",
        WAREHOUSE_MANAGER: "/inventory/warehouses",
        DELIVERY_AGENT: "/fulfillment/tracking",
        PPMV_OWNER: "/ppmv/dashboard",
      };

      const role = user?.roles?.[0] ?? "";
      const destination = ROLE_MAP[role] ?? "/dashboard";

      router.push(destination);
    } catch (err: unknown) {
      setLoading(false);

      const e = err as {
        response?: {
          status?: number;
          data?: { message?: string; error?: string };
        };
        code?: string;
        message?: string;
      };

      console.error(
        "Login error:",
        e?.response?.status,
        e?.response?.data,
        e?.message,
      );

      if (!e.response) {
        if (e.code === "ECONNABORTED") {
          setError(
            "Request timed out. The server may be starting up — try again.",
          );
        } else {
          setError(
            `Network error: ${e.message ?? "Cannot reach server"}. Check your connection.`,
          );
        }
        return;
      }

      const status = e.response.status;
      const msg = e.response.data?.message;

      if (status === 401) {
        setError("Wrong email or password.");
        return;
      }
      if (status === 403) {
        setError(
          "Account not verified. Check your email for a verification link.",
        );
        return;
      }
      if (status === 404) {
        setError("No account found with this email.");
        return;
      }
      if (status === 429) {
        setError("Too many attempts. Wait a few minutes and try again.");
        return;
      }
      if (status === 500) {
        setError("Server error. Please try again shortly.");
        return;
      }

      setError(
        Array.isArray(msg)
          ? msg.join(", ")
          : msg
            ? String(msg)
            : `Login failed (${status}).`,
      );
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
        {/* ── Left panel ─────────────────────────────── */}
        <div
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
                fontFamily: "'Syne',sans-serif",
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
              fulfillment coordination.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "₦2.8B+ inventory tracked",
                "12,830+ PPMVs connected",
                "98,000+ deliveries fulfilled",
                "Real-time compliance monitoring",
              ].map((f) => (
                <div
                  key={f}
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
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Demo accounts */}
          <div
            style={{
              marginTop: 40,
              paddingTop: 20,
              borderTop: "1px solid var(--bd-1)",
              position: "relative",
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: "var(--tx-3)",
                fontFamily: "'DM Mono',monospace",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 8,
              }}
            >
              Demo Accounts — click to fill
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword(acc.password);
                    setError("");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--bd-1)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    textAlign: "left",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--bd-k)";
                    e.currentTarget.style.background = "var(--k-subtle)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--bd-1)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--tx-1)",
                      fontWeight: 600,
                      fontFamily: "'Syne',sans-serif",
                    }}
                  >
                    {acc.role}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--tx-3)",
                      fontFamily: "'DM Mono',monospace",
                    }}
                  >
                    {acc.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel ────────────────────────────── */}
        <div
          style={{
            background: "var(--bg-surface)",
            padding: 48,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "'Syne',sans-serif",
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

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: "rgba(244,63,94,0.08)",
                border: "1px solid rgba(244,63,94,0.25)",
                color: "#f87171",
                fontSize: 13,
                marginBottom: 18,
                lineHeight: 1.5,
              }}
            >
              ⚠ {error}
            </div>
          )}

          {/* Email */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              marginBottom: 14,
            }}
          >
            <label
              style={{
                fontSize: 11,
                fontFamily: "'DM Mono',monospace",
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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="kx-input"
                style={{ paddingLeft: 32 }}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label
                style={{
                  fontSize: 11,
                  fontFamily: "'DM Mono',monospace",
                  color: "var(--tx-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Password
              </label>
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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="kx-input"
                style={{ paddingLeft: 32, paddingRight: 36 }}
                placeholder="••••••••"
                autoComplete="current-password"
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

          {/* Button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary btn-lg"
            style={{
              marginTop: 16,
              justifyContent: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
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

          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid var(--bd-1)",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 12, color: "var(--tx-3)" }}>
              Don&apos;t have an account?{" "}
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
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
