"use client";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { MOCK_SALES, MOCK_KPI } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { TrendingUp, DollarSign, ShoppingCart, Users } from "lucide-react";

export default function SalesDashboardPage() {
  return (
    <div>
      <PageHeader title="Sales Intelligence" subtitle="Revenue analytics and demand forecasting" />
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        <KpiCard label="Total Revenue" value={MOCK_KPI.revenue} change={MOCK_KPI.revenueChange} icon={<DollarSign className="w-4 h-4"/>} />
        <KpiCard label="Orders" value={MOCK_KPI.activeOrders.toLocaleString()} change={MOCK_KPI.ordersChange} icon={<ShoppingCart className="w-4 h-4"/>} color="#3b82f6" />
        <KpiCard label="Pharmacies" value={MOCK_KPI.pharmacies.toLocaleString()} change={MOCK_KPI.pharmaciesChange} icon={<Users className="w-4 h-4"/>} color="#a855f7" />
        <KpiCard label="PPMVs" value={MOCK_KPI.ppMVs.toLocaleString()} change={MOCK_KPI.ppMVsChange} icon={<TrendingUp className="w-4 h-4"/>} color="#f59e0b" />
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card">
          <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:4}}>Monthly Revenue (₦M)</p>
          <p style={{fontSize:11,color:"var(--tx-3)",marginBottom:16}}>12-month trend</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_SALES}>
              <XAxis dataKey="month" tick={{fontSize:10,fill:"var(--tx-3)",fontFamily:"'DM Mono',monospace"}} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v: number) => [`₦${v}M`,"Revenue"]} contentStyle={{background:"var(--bg-overlay)",border:"1px solid var(--bd-2)",borderRadius:10,fontSize:12}} />
              <Bar dataKey="revenue" fill="#14b88e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,marginBottom:4}}>Order Volume</p>
          <p style={{fontSize:11,color:"var(--tx-3)",marginBottom:16}}>Monthly orders</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MOCK_SALES}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bd-1)" />
              <XAxis dataKey="month" tick={{fontSize:10,fill:"var(--tx-3)",fontFamily:"'DM Mono',monospace"}} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v: number) => [v,"Orders"]} contentStyle={{background:"var(--bg-overlay)",border:"1px solid var(--bd-2)",borderRadius:10,fontSize:12}} />
              <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}