"use client";
import { PageHeader } from "@/components/ui/page-header";
import { Package, Truck, AlertTriangle, CheckCircle2, FileText } from "lucide-react";

const NOTIFS = [
  {icon:AlertTriangle,color:"#f43f5e",title:"Low Stock Alert",desc:"Paracetamol 500mg — Lagos Central Warehouse below reorder level (120 units remaining)",time:"2 min ago",read:false},
  {icon:Truck,color:"#14b88e",title:"Order Dispatched",desc:"ORD-50021 dispatched via GIG Logistics. Estimated delivery: Tomorrow",time:"15 min ago",read:false},
  {icon:Package,color:"#3b82f6",title:"Stock Received",desc:"500 units of Amoxicillin 250mg received at Abuja Hub from PharmaCorp Nigeria",time:"1 hr ago",read:false},
  {icon:AlertTriangle,color:"#f59e0b",title:"Expiry Alert",desc:"3 batches of Artemether/Lumefantrine expiring within 30 days — action required",time:"2 hrs ago",read:true},
  {icon:CheckCircle2,color:"#22c55e",title:"PO Approved",desc:"Purchase Order PO-20241201 has been approved. Supplier notified automatically",time:"3 hrs ago",read:true},
  {icon:FileText,color:"#a855f7",title:"Prescription Routed",desc:"RX-2014 routed to CityPharm Lagos for dispensing",time:"4 hrs ago",read:true},
  {icon:Truck,color:"#14b88e",title:"Delivery Completed",desc:"ORD-50019 delivered to Kano Pharma. Proof of delivery uploaded",time:"5 hrs ago",read:true},
  {icon:AlertTriangle,color:"#f43f5e",title:"Batch Recall Notice",desc:"NAFDAC recall notice received for batch BCH-2024-047. Quarantine initiated",time:"Yesterday",read:true},
];

export default function NotificationsPage() {
  const unread = NOTIFS.filter(n => !n.read).length;
  return (
    <div>
      <PageHeader title="Notifications" subtitle={`${unread} unread notifications`}
        action={<button className="btn-secondary btn-sm">Mark all read</button>} />
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {NOTIFS.map((n, i) => (
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"14px 16px",borderRadius:12,background: n.read?"var(--bg-surface)":"var(--bg-raised)",border:`1px solid ${n.read?"var(--bd-1)":"var(--bd-2)"}`,transition:"all 0.15s",cursor:"pointer"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--bd-k)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=n.read?"var(--bd-1)":"var(--bd-2)";}}>
            <div style={{width:36,height:36,borderRadius:10,background:`${n.color}15`,border:`1px solid ${n.color}25`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <n.icon className="w-4 h-4" style={{color:n.color}} />
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
                <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"var(--tx-1)"}}>{n.title}</p>
                <span style={{fontSize:10,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace",flexShrink:0,marginLeft:12}}>{n.time}</span>
              </div>
              <p style={{fontSize:12,color:"var(--tx-2)",lineHeight:1.5}}>{n.desc}</p>
            </div>
            {!n.read && (
              <div style={{width:6,height:6,borderRadius:"50%",background:"var(--k)",boxShadow:"0 0 6px var(--k)",flexShrink:0,marginTop:5}} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}