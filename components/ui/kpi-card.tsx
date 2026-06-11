interface KpiCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
  sub?: string;
}

export function KpiCard({ label, value, change, icon, color = "var(--k)", sub }: KpiCardProps) {
  const pos = (change ?? 0) >= 0;
  return (
    <div className="kpi">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
        <div style={{width:36,height:36,borderRadius:10,background:`${color}18`,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${color}30`,color}}>
          {icon}
        </div>
        {change !== undefined && (
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:500,color: pos?"var(--green)":"var(--red)",background: pos?"rgba(34,197,94,0.08)":"rgba(244,63,94,0.08)",padding:"2px 7px",borderRadius:99}}>
            {pos ? "+" : ""}{change}%
          </span>
        )}
      </div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:"var(--tx-1)",letterSpacing:"-0.04em",lineHeight:1}}>
        {value}
      </div>
      <div style={{marginTop:5,fontSize:12,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.06em"}}>
        {label}
      </div>
      {sub && <div style={{marginTop:3,fontSize:11,color:"var(--tx-3)"}}>{sub}</div>}
    </div>
  );
}