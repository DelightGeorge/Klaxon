"use client";
import { PageHeader } from "@/components/ui/page-header";
import { MOCK_WAREHOUSES } from "@/lib/mock-data";

export default function TransfersPage() {
  return (
    <div>
      <PageHeader title="Stock Transfers" subtitle="Move inventory between warehouses"
        action={<button className="btn-primary btn-sm">+ New Transfer</button>} />
      <div className="card" style={{maxWidth:600}}>
        <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:16}}>Create Transfer</p>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[{label:"From Warehouse"},{label:"To Warehouse"},{label:"Product"},{label:"Quantity"},{label:"Notes"}].map(f => (
            <div key={f.label} style={{display:"flex",flexDirection:"column",gap:5}}>
              <label style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--tx-3)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{f.label}</label>
              {f.label.includes("Warehouse") ? (
                <select className="kx-input">
                  {MOCK_WAREHOUSES.map(w => <option key={w.id}>{w.name}</option>)}
                </select>
              ) : <input className="kx-input" placeholder={`Enter ${f.label.toLowerCase()}...`} />}
            </div>
          ))}
          <button className="btn-primary" style={{marginTop:4}}>Initiate Transfer</button>
        </div>
      </div>
    </div>
  );
}