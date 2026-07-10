"use client";
import { useAuthStore } from "@/lib/auth-store";
import { useApi } from "@/lib/hooks/use-api";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Package, ShoppingCart, Truck, Store,
  AlertTriangle, TrendingUp, BarChart2,
  Activity, ArrowRight, Clock, RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { MOCK_SALES, MOCK_INVENTORY_PIE, MOCK_AUDIT } from "@/lib/mock-data";

interface InventoryStats {
  totalProducts:     number;
  totalQuantity:     number;
  lowStockCount:     number;
  expiringSoonCount: number;
  totalValue:        number;
  warehouseCount:    number;
}
interface Product {
  id: string; name: string; sku: string;
  quantity: number; status: string; category: string;
}
interface Transaction {
  id: string; type: string; quantity: number; createdAt: string;
  product?: { name: string };
  warehouse?: { name: string };
  performedBy?: { firstName: string; lastName: string };
}
interface Warehouse {
  id: string; name: string; capacity: number; status: string;
}

const fmt = (n: number) =>
  n >= 1_000_000_000 ? `₦${(n / 1_000_000_000).toFixed(1)}B`
  : n >= 1_000_000   ? `₦${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000       ? `₦${(n / 1_000).toFixed(1)}K`
  : `₦${n}`;

const PIE_COLORS = ["#14b88e","#3b82f6","#f59e0b","#a855f7","#f43f5e","#22c55e"];

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean; payload?: { value: number }[]; label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"var(--bg-overlay)", border:"1px solid var(--bd-2)", borderRadius:10, padding:"8px 12px" }}>
      <p style={{ fontSize:11, color:"var(--tx-3)", marginBottom:4, fontFamily:"'DM Mono',monospace" }}>{label}</p>
      <p style={{ fontSize:14, fontWeight:700, color:"var(--k)", fontFamily:"'Syne',sans-serif" }}>
        ₦{payload[0].value}M
      </p>
    </div>
  );
};

function KpiCard({ label, value, sub, icon, color = "var(--k)", change, loading }: {
  label: string; value: string | number; sub?: string;
  icon: React.ReactNode; color?: string; change?: number; loading?: boolean;
}) {
  const pos = (change ?? 0) >= 0;
  return (
    <div className="kpi">
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:`${color}18`, border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", color }}>
          {icon}
        </div>
        {change !== undefined && (
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:500, color: pos ? "var(--green)" : "var(--red)", background: pos ? "rgba(34,197,94,0.08)" : "rgba(244,63,94,0.08)", padding:"2px 7px", borderRadius:99 }}>
            {pos ? "+" : ""}{change}%
          </span>
        )}
      </div>
      {loading ? (
        <>
          <div className="skeleton" style={{ height:28, width:"60%", marginBottom:6 }} />
          <div className="skeleton" style={{ height:12, width:"80%" }} />
        </>
      ) : (
        <>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:"var(--tx-1)", letterSpacing:"-0.04em", lineHeight:1 }}>
            {value}
          </div>
          <div style={{ marginTop:5, fontSize:12, color:"var(--tx-3)", fontFamily:"'DM Mono',monospace", textTransform:"uppercase", letterSpacing:"0.06em" }}>
            {label}
          </div>
          {sub && <div style={{ marginTop:3, fontSize:11, color:"var(--tx-3)" }}>{sub}</div>}
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore(s => s.user);

  const { data: stats, loading: statsLoading, refetch: refetchStats } =
    useApi<InventoryStats>("/inventory/stats", null);

  const { data: productsData, loading: productsLoading } =
    useApi<{ products: Product[]; total: number }>("/inventory/products?limit=5&page=1", null);

  const { data: txData, loading: txLoading } =
    useApi<{ transactions: Transaction[] }>("/inventory/transactions?limit=6", null);

  const { data: warehousesData } =
    useApi<{ warehouses: Warehouse[] }>("/warehouses?limit=10", null);

  const products   = productsData?.products   ?? [];
  const txList     = txData?.transactions      ?? [];
  const warehouses = warehousesData?.warehouses ?? [];

  const txTypeColor = (type: string) => {
    if (type.includes("IN")  || type === "RETURN")   return "var(--k)";
    if (type.includes("OUT") || type === "DISPOSAL")  return "var(--red)";
    if (type.includes("TRANSFER"))                     return "#3b82f6";
    return "var(--amber)";
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <h1 className="page-title">Platform Dashboard</h1>
            <span className="badge badge-k">LIVE</span>
          </div>
          <p className="page-sub">
            Welcome back, {user?.firstName ?? "—"} · Real-time supply chain overview
          </p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-secondary btn-sm" onClick={() => refetchStats()}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button className="btn-primary btn-sm">
            <Activity className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:12 }}>
        <KpiCard label="Inventory Value"   value={stats ? fmt(stats.totalValue) : "—"}                    icon={<Package className="w-4 h-4" />}   loading={statsLoading} />
        <KpiCard label="Total Products"    value={stats?.totalProducts?.toLocaleString() ?? "—"}           icon={<ShoppingCart className="w-4 h-4" />} color="#3b82f6" loading={statsLoading} />
        <KpiCard label="Total Stock Units" value={stats?.totalQuantity?.toLocaleString() ?? "—"}           icon={<TrendingUp className="w-4 h-4" />}   color="#a855f7" loading={statsLoading} />
        <KpiCard label="Warehouses"        value={stats?.warehouseCount ?? warehouses.length}              icon={<Truck className="w-4 h-4" />}         color="#22c55e" loading={statsLoading} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        <KpiCard label="Low Stock Alerts"    value={stats?.lowStockCount ?? "—"}      sub="Needs reorder"   icon={<AlertTriangle className="w-4 h-4" />} color="#f43f5e" loading={statsLoading} />
        <KpiCard label="Expiring Soon (30d)" value={stats?.expiringSoonCount ?? "—"}  sub="Within 30 days"  icon={<Clock className="w-4 h-4" />}         color="#f59e0b" loading={statsLoading} />
        <KpiCard label="Active PPMVs"        value="12,830"                            icon={<Store className="w-4 h-4" />}         color="#14b88e" change={19.3} />
        <KpiCard label="Deliveries (MTD)"    value="98,210"                            icon={<BarChart2 className="w-4 h-4" />}     color="#3b82f6" change={22.1} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, marginBottom:20 }}>
        <div className="card">
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div>
              <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"var(--tx-1)" }}>Revenue Trend</p>
              <p style={{ fontSize:11, color:"var(--tx-3)", marginTop:2 }}>Monthly revenue in millions (₦)</p>
            </div>
            <span className="badge badge-green">+14.6% YoY</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_SALES}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#14b88e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#14b88e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize:10, fill:"var(--tx-3)", fontFamily:"'DM Mono',monospace" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#14b88e" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"var(--tx-1)", marginBottom:4 }}>Inventory Mix</p>
          <p style={{ fontSize:11, color:"var(--tx-3)", marginBottom:12 }}>By category (%)</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={MOCK_INVENTORY_PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {MOCK_INVENTORY_PIE.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={7}
                formatter={v => <span style={{ fontSize:10, color:"var(--tx-2)" }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:16 }}>
        <div className="card" style={{ padding:0 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderBottom:"1px solid var(--bd-1)" }}>
            <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:"var(--tx-1)" }}>Recent Products</p>
            <Link href="/inventory/products" style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"var(--k)", textDecoration:"none" }}>
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {productsLoading ? (
            <div style={{ padding:16, display:"flex", flexDirection:"column", gap:8 }}>
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height:40, borderRadius:8 }} />)}
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding:"40px 0", textAlign:"center", color:"var(--tx-3)", fontSize:13 }}>No products yet</div>
          ) : (
            <table className="kx-table">
              <thead><tr><th>Product</th><th>SKU</th><th>Qty</th><th>Status</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td><div><p style={{ fontWeight:600, fontSize:12 }}>{p.name}</p><p style={{ fontSize:10, color:"var(--tx-3)", marginTop:1 }}>{p.category}</p></div></td>
                    <td><span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"var(--tx-3)" }}>{p.sku}</span></td>
                    <td><span style={{ fontFamily:"'DM Mono',monospace", fontWeight:600 }}>{p.quantity?.toLocaleString()}</span></td>
                    <td>
                      <span className={`badge ${p.status === "ACTIVE" ? "badge-green" : p.status === "LOW_STOCK" ? "badge-amber" : p.status === "OUT_OF_STOCK" ? "badge-red" : "badge-ink"}`}>
                        {p.status?.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ padding:0 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderBottom:"1px solid var(--bd-1)" }}>
            <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:"var(--tx-1)" }}>Activity Feed</p>
            <Link href="/compliance/audit" style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"var(--k)", textDecoration:"none" }}>
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {txLoading ? (
            <div style={{ padding:16, display:"flex", flexDirection:"column", gap:8 }}>
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height:52, borderRadius:8 }} />)}
            </div>
          ) : txList.length === 0 ? (
            <div style={{ display:"flex", flexDirection:"column" }}>
              {MOCK_AUDIT.slice(0, 6).map((log, i) => (
                <div key={log.id} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"11px 16px", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background: log.severity === "critical" ? "var(--red)" : log.severity === "warning" ? "var(--amber)" : "var(--k)", marginTop:5, flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:12, fontWeight:500, color:"var(--tx-1)" }}>{log.action}</p>
                    <p style={{ fontSize:11, color:"var(--tx-3)", marginTop:1 }}>{log.user} · {log.resource}</p>
                  </div>
                  <span style={{ fontSize:10, color:"var(--tx-3)", fontFamily:"'DM Mono',monospace", flexShrink:0 }}>{log.time.split(",")[1]?.trim()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column" }}>
              {txList.map((tx, i) => (
                <div key={tx.id} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"11px 16px", borderBottom: i < txList.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background: txTypeColor(tx.type), marginTop:5, flexShrink:0, boxShadow:`0 0 6px ${txTypeColor(tx.type)}` }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:12, fontWeight:500, color:"var(--tx-1)" }}>{tx.type.replace(/_/g, " ")} — {tx.product?.name ?? "Unknown product"}</p>
                    <p style={{ fontSize:11, color:"var(--tx-3)", marginTop:1 }}>Qty: {tx.quantity} · {tx.warehouse?.name ?? ""}{tx.performedBy ? ` · ${tx.performedBy.firstName} ${tx.performedBy.lastName}` : ""}</p>
                  </div>
                  <span style={{ fontSize:10, color:"var(--tx-3)", fontFamily:"'DM Mono',monospace", flexShrink:0 }}>
                    {new Date(tx.createdAt).toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {warehouses.length > 0 && (
        <div className="card" style={{ marginTop:16 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"var(--tx-1)" }}>Warehouse Capacity</p>
            <Link href="/inventory/warehouses" style={{ fontSize:11, color:"var(--k)", textDecoration:"none" }}>Manage warehouses →</Link>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
            {warehouses.slice(0, 4).map(w => {
              const pct = w.capacity ?? 0;
              return (
                <div key={w.id} style={{ padding:"12px 14px", borderRadius:10, background:"var(--bg-raised)", border:"1px solid var(--bd-1)" }}>
                  <p style={{ fontWeight:600, fontSize:12, color:"var(--tx-1)", marginBottom:8, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{w.name}</p>
                  <div style={{ height:5, background:"var(--bg-overlay)", borderRadius:99, overflow:"hidden", marginBottom:5 }}>
                    <div style={{ height:"100%", width:`${Math.min(pct, 100)}%`, background: pct > 80 ? "var(--amber)" : "var(--k)", borderRadius:99 }} />
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:10, color:"var(--tx-3)" }}>{w.status}</span>
                    <span style={{ fontSize:10, fontFamily:"'DM Mono',monospace", color: pct > 80 ? "var(--amber)" : "var(--k)" }}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}