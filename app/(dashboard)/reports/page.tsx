"use client";
import { PageHeader } from "@/components/ui/page-header";
import { FileText, Download, TrendingUp, Package, Truck, ShieldCheck } from "lucide-react";

const REPORTS = [
  {icon:TrendingUp,title:"Sales & Revenue Report",desc:"Monthly revenue breakdown, top products, regional performance",color:"var(--k)"},
  {icon:Package,title:"Inventory Valuation Report",desc:"Current stock value, turnover rates, dead stock analysis",color:"#3b82f6"},
  {icon:Truck,title:"Fulfillment Performance",desc:"Delivery success rates, logistics partners, SLA compliance",color:"#a855f7"},
  {icon:ShieldCheck,title:"Compliance & Audit Report",desc:"NAFDAC compliance, batch traceability, recall history",color:"#f59e0b"},
  {icon:FileText,title:"Procurement Analysis",desc:"Supplier performance, PO cycle times, cost savings",color:"#22c55e"},
  {icon:TrendingUp,title:"PPMV Activity Report",desc:"Vendor engagement, restock patterns, revenue per PPMV",color:"#f43f5e"},
];

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" subtitle="Generate and download platform reports" />
      <div className="kx-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {REPORTS.map(r => (
          <div key={r.title} className="card" style={{cursor:"pointer",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--bd-k)";e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--bd-1)";e.currentTarget.style.transform="none";}}>
            <div style={{width:40,height:40,borderRadius:12,background:`${r.color}15`,border:`1px solid ${r.color}30`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
              <r.icon className="w-5 h-5" style={{color:r.color}} />
            </div>
            <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"var(--tx-1)",marginBottom:5}}>{r.title}</p>
            <p style={{fontSize:11,color:"var(--tx-3)",lineHeight:1.5,marginBottom:14}}>{r.desc}</p>
            <div style={{display:"flex",gap:6}}>
              <button className="btn-primary btn-sm" style={{flex:1,justifyContent:"center"}}>Generate</button>
              <button className="btn-secondary btn-sm" style={{padding:"6px 8px"}}><Download className="w-3.5 h-3.5"/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}