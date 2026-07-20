"use client";
import { PageHeader } from "@/components/ui/page-header";
import { Download, Printer } from "lucide-react";
export default function LabelsPage() {
  return (
    <div>
      <PageHeader title="Label Printing" subtitle="Design and print product labels with barcodes"
        action={<><button className="btn-secondary btn-sm"><Download className="w-3.5 h-3.5"/>Download PDF</button><button className="btn-primary btn-sm"><Printer className="w-3.5 h-3.5"/>Print Labels</button></>} />
      <div className="kx-stack-mobile" style={{display:"grid",gridTemplateColumns:"240px 1fr",gap:20}}>
        <div className="card">
          <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:14}}>Label Options</p>
          {["Label Size","Code Type","Copies","Include Logo","Include Price"].map(f => (
            <div key={f} style={{marginBottom:12}}>
              <label style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:4}}>{f}</label>
              <input className="kx-input" style={{fontSize:12}} />
            </div>
          ))}
        </div>
        <div className="card" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:400}}>
          <div style={{width:220,height:140,background:"white",borderRadius:8,boxShadow:"0 4px 20px rgba(0,0,0,0.3)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,padding:16}}>
            <p style={{color:"#07080a",fontWeight:700,fontSize:11,textAlign:"center"}}>Paracetamol 500mg</p>
            <div style={{width:160,height:40,background:"#07080a",borderRadius:4}} />
            <p style={{color:"#07080a",fontFamily:"monospace",fontSize:9}}>0612345678901234</p>
          </div>
        </div>
      </div>
    </div>
  );
}