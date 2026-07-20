"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Download, RefreshCw, QrCode } from "lucide-react";

export default function GeneratorPage() {
  const [type, setType] = useState("QR Code");
  const [value, setValue] = useState("0612345678901234");
  const types = ["QR Code","Barcode (EAN-14)","DataMatrix","GS1-128"];

  return (
    <div>
      <PageHeader title="Barcode Generator" subtitle="Generate QR codes, barcodes and DataMatrix for drug packaging" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:900}}>
        <div className="card" style={{display:"flex",flexDirection:"column",gap:16}}>
          <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14}}>Configuration</p>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Code Type</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {types.map(t => (
                <button key={t} onClick={() => setType(t)}
                  style={{padding:"8px 10px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",border:"1px solid",transition:"all 0.15s",
                    borderColor:type===t?"var(--k)":"var(--bd-1)",
                    background:type===t?"var(--k-subtle)":"transparent",
                    color:type===t?"var(--k)":"var(--tx-2)"}}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Value / GTIN</label>
            <input value={value} onChange={e => setValue(e.target.value)} className="kx-input" placeholder="Enter GTIN or custom value" />
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn-primary" style={{flex:1,justifyContent:"center"}}><RefreshCw className="w-3.5 h-3.5" />Generate</button>
            <button className="btn-secondary"><Download className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        <div className="card" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:280,gap:12}}>
          <div style={{width:160,height:160,borderRadius:16,background:"white",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>
            <QrCode className="w-24 h-24" style={{color:"#07080a"}} />
          </div>
          <p style={{fontSize:12,color:"var(--tx-2)",fontFamily:"'DM Mono',monospace"}}>{type}</p>
          <p style={{fontSize:11,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace"}}>{value}</p>
          <div style={{display:"flex",gap:6}}>
            <button className="btn-secondary btn-sm">PNG</button>
            <button className="btn-secondary btn-sm">SVG</button>
            <button className="btn-secondary btn-sm">PDF Label</button>
          </div>
        </div>
      </div>
    </div>
  );
}