"use client";
import { KpiCard } from "@/components/ui/kpi-card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { MOCK_KPI, MOCK_SALES, MOCK_ORDERS, MOCK_INVENTORY_PIE, MOCK_AUDIT } from "@/lib/mock-data";
import { useApi } from "@/lib/hooks/use-api";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Package, ShoppingCart, Truck, Store, AlertTriangle, TrendingUp, BarChart2, Activity, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

const PIE_COLORS = ["#14b88e","#3b82f6","#f59e0b","#a855f7","#f43f5e","#22c55e"];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: {value: number}[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"var(--bg-overlay)",border:"1px solid var(--bd-2)",borderRadius:10,padding:"8px 12px"}}>
      <p style={{fontSize:11,color:"var(--tx-3)",marginBottom:4,fontFamily:"'DM Mono',monospace"}}>{label}</p>
      <p style={{fontSize:14,fontWeight:700,color:"var(--k)",fontFamily:"'Syne',sans-serif"}}>₦{payload[0].value}M</p>
    </div>
  );
};

interface AnalyticsData {
  totalRevenue?: number;
  activeOrders?: number;
  pharmacies?: number;
  ppMVs?: number;
  lowStock?: number;
  expiring?: number;
  delivered?: number;
  inventoryValue?: number;
  revenue?: { month: string; revenue: number; orders: number }[];
  inventoryMix?: { name: string; value: number }[];
  recentOrders?: {
    id: string; customer?: string; value?: string;
    status?: string; eta?: string;
  }[];
}

export default function DashboardPage() {
  const { data: analytics, loading } = useApi<AnalyticsData>("/analytics/overview", {});

  // Use real data if available, fall back to mock
  const kpi = {
    inventoryValue: analytics?.inventoryValue ? `₦${(analytics.inventoryValue/1e9).toFixed(1)}B` : MOCK_KPI.inventoryValue,
    inventoryChange: MOCK_KPI.inventoryChange,
    activeOrders: analytics?.activeOrders ?? MOCK_KPI.activeOrders,
    ordersChange: MOCK_KPI.ordersChange,
    revenue: analytics?.totalRevenue ? `₦${(analytics.totalRevenue/1e6).toFixed(1)}M` : MOCK_KPI.revenue,
    revenueChange: MOCK_KPI.revenueChange,
    delivered: analytics?.delivered ?? MOCK_KPI.delivered,
    deliveredChange: MOCK_KPI.deliveredChange,
    pharmacies: analytics?.pharmacies ?? MOCK_KPI.pharmacies,
    pharmaciesChange: MOCK_KPI.pharmaciesChange,
    ppMVs: analytics?.ppMVs ?? MOCK_KPI.ppMVs,
    ppMVsChange: MOCK_KPI.ppMVsChange,
    lowStock: analytics?.lowStock ?? MOCK_KPI.lowStock,
    expiring: analytics?.expiring ?? MOCK_KPI.expiring,
    expiringChange: MOCK_KPI.expiringChange,
  };

  const salesData  = analytics?.revenue?.length    ? analytics.revenue    : MOCK_SALES;
  const pieData    = analytics?.inventoryMix?.length? analytics.inventoryMix: MOCK_INVENTORY_PIE;
  const recentOrders = analytics?.recentOrders?.length ? analytics.recentOrders : MOCK_ORDERS.slice(0,5);
  const recentLogs = MOCK_AUDIT.slice(0,5);

  return (
    <div>
      <PageHeader
        title="Platform Dashboard"
        subtitle="Real-time overview of your healthcare supply chain"
        badge={loading ? "LOADING" : "LIVE"}
        action={
          <div style={{display:"flex",gap:8}}>
            <button className="btn-secondary btn-sm">
              <Clock className="w-3.5 h-3.5" /> Last 30 days
            </button>
            <button className="btn-primary btn-sm">
              <Activity className="w-3.5 h-3.5" /> Export Report
            </button>
          </div>
        }
      />

      {/* KPI Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <KpiCard label="Inventory Value" value={kpi.inventoryValue} change={kpi.inventoryChange} icon={<Package className="w-4 h-4" />} />
        <KpiCard label="Active Orders"   value={kpi.activeOrders.toLocaleString()} change={kpi.ordersChange} icon={<ShoppingCart className="w-4 h-4" />} color="#3b82f6" />
        <KpiCard label="Revenue MTD"     value={kpi.revenue} change={kpi.revenueChange} icon={<TrendingUp className="w-4 h-4" />} color="#a855f7" />
        <KpiCard label="Deliveries"      value={kpi.delivered.toLocaleString()} change={kpi.deliveredChange} icon={<Truck className="w-4 h-4" />} color="#22c55e" />
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        <KpiCard label="Pharmacies"       value={kpi.pharmacies.toLocaleString()} change={kpi.pharmaciesChange} icon={<Store className="w-4 h-4" />} color="#f59e0b" />
        <KpiCard label="PPMVs Connected"  value={kpi.ppMVs.toLocaleString()} change={kpi.ppMVsChange} icon={<BarChart2 className="w-4 h-4" />} color="#14b88e" />
        <KpiCard label="Low Stock Alerts" value={kpi.lowStock} icon={<AlertTriangle className="w-4 h-4" />} color="#f43f5e" sub="Needs attention" />
        <KpiCard label="Expiring (30d)"   value={kpi.expiring} change={kpi.expiringChange} icon={<AlertTriangle className="w-4 h-4" />} color="#f59e0b" />
      </div>

      {/* Charts row */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,marginBottom:20}}>
        <div className="card">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div>
              <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"var(--tx-1)"}}>Revenue Trend</p>
              <p style={{fontSize:11,color:"var(--tx-3)",marginTop:2}}>Monthly revenue in millions (₦)</p>
            </div>
            <span className="badge badge-green">+14.6% YoY</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b88e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#14b88e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{fontSize:10,fill:"var(--tx-3)",fontFamily:"'DM Mono',monospace"}} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#14b88e" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"var(--tx-1)",marginBottom:4}}>Inventory Mix</p>
          <p style={{fontSize:11,color:"var(--tx-3)",marginBottom:12}}>By category (%)</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map((_: unknown, i: number) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={7} formatter={(v) => <span style={{fontSize:10,color:"var(--tx-2)"}}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables row */}
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:16}}>
        <div className="card" style={{padding:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderBottom:"1px solid var(--bd-1)"}}>
            <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"var(--tx-1)"}}>Recent Orders</p>
            <Link href="/fulfillment/orders" style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"var(--k)",textDecoration:"none"}}>
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <table className="kx-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Value</th><th>Status</th><th>ETA</th></tr></thead>
            <tbody>
              {recentOrders.map((o: {id:string;customer?:string;value?:string;status?:string;eta?:string}) => (
                <tr key={o.id}>
                  <td><span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--k)"}}>{o.id}</span></td>
                  <td><span style={{fontSize:12}}>{o.customer}</span></td>
                  <td><span style={{fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:500}}>{o.value}</span></td>
                  <td><StatusBadge status={o.status ?? ""} /></td>
                  <td><span style={{fontSize:11,color:"var(--tx-3)"}}>{o.eta}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{padding:0}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderBottom:"1px solid var(--bd-1)"}}>
            <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"var(--tx-1)"}}>Activity Feed</p>
            <Link href="/compliance/audit" style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"var(--k)",textDecoration:"none"}}>
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div style={{display:"flex",flexDirection:"column"}}>
            {recentLogs.map((log, i) => (
              <div key={log.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 16px",borderBottom: i < recentLogs.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background: log.severity==="critical"?"var(--red)":log.severity==="warning"?"var(--amber)":"var(--k)",marginTop:5,flexShrink:0,boxShadow:`0 0 6px ${log.severity==="critical"?"var(--red)":log.severity==="warning"?"var(--amber)":"var(--k)"}`}} />
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:12,fontWeight:500,color:"var(--tx-1)"}}>{log.action}</p>
                  <p style={{fontSize:11,color:"var(--tx-3)",marginTop:1}}>{log.user} · {log.resource}</p>
                </div>
                <span style={{fontSize:10,color:"var(--tx-3)",fontFamily:"'DM Mono',monospace",flexShrink:0}}>{log.time.split(",")[1]?.trim()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}