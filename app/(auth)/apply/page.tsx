"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Building2, Mail, Phone, MapPin, User, FileText, CheckCircle, Loader2 } from "lucide-react";
import { KlaxonMark } from "@/components/layout/klaxon-mark";
import { api } from "@/lib/api";

const ORG_TYPES = [
  { value:"HOSPITAL",              label:"Hospital" },
  { value:"CLINIC",                label:"Clinic" },
  { value:"PHARMACY",              label:"Pharmacy" },
  { value:"LABORATORY",            label:"Laboratory" },
  { value:"DENTAL_PRACTICE",       label:"Dental Practice" },
  { value:"MENTAL_HEALTH_CENTER",  label:"Mental Health Center" },
  { value:"NGO",                   label:"NGO" },
  { value:"PHYSIOTHERAPY_CENTER",  label:"Physiotherapy Center" },
  { value:"BLOOD_BANK",            label:"Blood Bank" },
  { value:"RADIOLOGY_CENTER",      label:"Radiology Center" },
  { value:"TELEMEDICINE_PROVIDER", label:"Telemedicine Provider" },
];

const STEPS = ["Organisation Info", "Contact Details", "Review & Submit"];

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "", type: "HOSPITAL", email: "", phone: "",
    address: "", contactPerson: "", licenseNumber: "",
  });

  const set_ = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(v => ({ ...v, [k]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      await api.post("/organizations/apply", form);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? "Submission failed. Please try again.";
      setError(msg);
    } finally { setLoading(false); }
  };

  const inp = (label: string, k: keyof typeof form, icon: React.ReactNode, type = "text", placeholder = "") => (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>
      <div style={{ position:"relative" }}>
        <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--tx-3)", display:"flex", pointerEvents:"none" }}>{icon}</span>
        <input type={type} value={form[k]} onChange={set_(k)} placeholder={placeholder}
          className="kx-input" style={{ paddingLeft:32 }} required />
      </div>
    </div>
  );

  if (success) return (
    <div style={{ minHeight:"100vh", background:"var(--bg-root)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ textAlign:"center", maxWidth:440 }}>
        <div style={{ width:72, height:72, borderRadius:20, background:"var(--k-subtle)", border:"1px solid var(--bd-k)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
          <CheckCircle style={{ width:32, height:32, color:"var(--k)" }} />
        </div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:"var(--tx-1)", marginBottom:10 }}>Application Submitted!</h2>
        {/* FIX: wrapped in template literal to avoid unescaped-entities lint error */}
        <p style={{ fontSize:13, color:"var(--tx-2)", lineHeight:1.7, marginBottom:28 }}>
          {`Your organisation application has been received. Our team will review it and get back to you within 24-48 hours via email.`}
        </p>
        <button onClick={() => router.push("/login")} className="btn-primary btn-sm" style={{ margin:"0 auto" }}>
          Back to Login <ArrowRight style={{ width:14, height:14 }} />
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight:"100vh", background:"var(--bg-root)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
      backgroundImage:"radial-gradient(ellipse at 20% 50%, rgba(20,184,142,0.06) 0%, transparent 60%)",
    }}>
      <div style={{ width:"100%", maxWidth:540 }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"inline-flex", marginBottom:16 }}><KlaxonMark size="md" /></div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, color:"var(--tx-1)", marginBottom:6 }}>Register Your Organisation</h1>
          <p style={{ fontSize:13, color:"var(--tx-2)" }}>Join Klaxon&apos;s healthcare supply chain network</p>
        </div>

        {/* Step indicator */}
        <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:28 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display:"flex", alignItems:"center", flex: i < STEPS.length - 1 ? 1 : "initial" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{
                  width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:11, fontWeight:700, fontFamily:"'DM Mono',monospace",
                  background: i <= step ? "var(--k)" : "var(--bg-overlay)",
                  color: i <= step ? "#07080a" : "var(--tx-3)",
                  border: i <= step ? "none" : "1px solid var(--bd-1)",
                  transition:"all 0.2s",
                }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize:9, color: i <= step ? "var(--k)" : "var(--tx-3)", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.04em", whiteSpace:"nowrap" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex:1, height:1, background: i < step ? "var(--k)" : "var(--bd-1)", margin:"0 8px", marginBottom:16, transition:"background 0.3s" }} />
              )}
            </div>
          ))}
        </div>

        <div className="card">
          {error && (
            <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(244,63,94,0.08)", border:"1px solid rgba(244,63,94,0.2)", color:"#f43f5e", fontSize:12, marginBottom:16 }}>
              {error}
            </div>
          )}

          {/* Step 0: Org Info */}
          {step === 0 && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:"var(--tx-1)", marginBottom:4 }}>Organisation Information</h2>
              {inp("Organisation Name", "name", <Building2 style={{ width:14, height:14 }} />, "text", "Lagos General Hospital")}
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                <label style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"var(--tx-3)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Organisation Type</label>
                <select value={form.type} onChange={set_("type")} className="kx-input">
                  {ORG_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              {inp("NAFDAC / License Number", "licenseNumber", <FileText style={{ width:14, height:14 }} />, "text", "LIC-2024-12345")}
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:4 }}>
                <button onClick={() => { if (!form.name || !form.licenseNumber) { setError("Please fill all fields"); return; } setError(""); setStep(1); }} className="btn-primary btn-sm">
                  Continue <ArrowRight style={{ width:14, height:14 }} />
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Contact */}
          {step === 1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:"var(--tx-1)", marginBottom:4 }}>Contact Details</h2>
              {inp("Contact Person", "contactPerson", <User style={{ width:14, height:14 }} />, "text", "Dr. Emeka Obi")}
              {inp("Email Address", "email", <Mail style={{ width:14, height:14 }} />, "email", "admin@yourhospital.com")}
              {inp("Phone Number", "phone", <Phone style={{ width:14, height:14 }} />, "tel", "+2348012345678")}
              {inp("Address", "address", <MapPin style={{ width:14, height:14 }} />, "text", "123 Marina Road, Lagos")}
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                <button onClick={() => { setError(""); setStep(0); }} className="btn-secondary btn-sm">
                  <ArrowLeft style={{ width:14, height:14 }} /> Back
                </button>
                <button onClick={() => { if (!form.email || !form.phone || !form.address || !form.contactPerson) { setError("Please fill all fields"); return; } setError(""); setStep(2); }} className="btn-primary btn-sm">
                  Review <ArrowRight style={{ width:14, height:14 }} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:"var(--tx-1)", marginBottom:4 }}>Review Your Application</h2>
              <div style={{ display:"flex", flexDirection:"column", gap:0, borderRadius:12, overflow:"hidden", border:"1px solid var(--bd-1)" }}>
                {[
                  { label:"Organisation", value: form.name },
                  { label:"Type",         value: ORG_TYPES.find(t => t.value === form.type)?.label },
                  { label:"License No.",  value: form.licenseNumber },
                  { label:"Contact",      value: form.contactPerson },
                  { label:"Email",        value: form.email },
                  { label:"Phone",        value: form.phone },
                  { label:"Address",      value: form.address },
                ].map((row, i) => (
                  <div key={row.label} style={{
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                    padding:"10px 14px",
                    background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                    borderBottom: i < 6 ? "1px solid var(--bd-1)" : "none",
                  }}>
                    <span style={{ fontSize:11, color:"var(--tx-3)", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.04em" }}>{row.label}</span>
                    <span style={{ fontSize:12, color:"var(--tx-1)", fontWeight:500, maxWidth:"60%", textAlign:"right" }}>{row.value}</span>
                  </div>
                ))}
              </div>
              {/* FIX: wrapped in template literal to avoid unescaped-entities lint error */}
              <p style={{ fontSize:11, color:"var(--tx-3)", lineHeight:1.6 }}>
                {`By submitting, you confirm that the information above is accurate. Our team will review your application and contact you within 24-48 hours.`}
              </p>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                <button onClick={() => { setError(""); setStep(1); }} className="btn-secondary btn-sm">
                  <ArrowLeft style={{ width:14, height:14 }} /> Back
                </button>
                <button onClick={handleSubmit} disabled={loading} className="btn-primary btn-sm">
                  {loading ? <><Loader2 style={{ width:14, height:14 }} className="animate-spin" /> Submitting...</> : <>Submit Application <ArrowRight style={{ width:14, height:14 }} /></>}
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop:16, textAlign:"center" }}>
          <p style={{ fontSize:12, color:"var(--tx-3)" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color:"var(--k)", textDecoration:"none", fontWeight:600 }}>Sign in</a>
            {" · "}
            <a href="/register" style={{ color:"var(--k)", textDecoration:"none", fontWeight:600 }}>Register as individual</a>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}