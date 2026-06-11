"use client";
import { PageHeader } from "@/components/ui/page-header";
import { ScanLine } from "lucide-react";
export default function ScannerPage() {
  return (
    <div>
      <PageHeader title="Barcode Scanner" subtitle="Scan product barcodes for instant lookup" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div className="card" style={{textAlign:"center",padding:"60px 20px"}}>
          <ScanLine className="w-16 h-16" style={{margin:"0 auto 16px",color:"var(--k)"}} />
          <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,marginBottom:8}}>Camera Scanner</p>
          <p style={{fontSize:12,color:"var(--tx-3)",marginBottom:20}}>Allow camera access to scan barcodes and QR codes</p>
          <button className="btn-primary">Enable Camera</button>
        </div>
        <div className="card">
          <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:16}}>Manual Lookup</p>
          <input className="kx-input" placeholder="Enter GTIN or barcode value..." style={{marginBottom:10}} />
          <button className="btn-primary" style={{width:"100%",justifyContent:"center"}}>Lookup Product</button>
        </div>
      </div>
    </div>
  );
}