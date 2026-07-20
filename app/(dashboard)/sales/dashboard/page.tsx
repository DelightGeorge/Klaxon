"use client";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { useApi } from "@/lib/hooks/use-api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Loader2,
} from "lucide-react";

interface SalesOverview {
  totalRevenue?: number;
  totalOrders?: number;
  totalPharmacies?: number;
  totalPPMVs?: number;
  revenueChange?: number;
  ordersChange?: number;
  monthlyRevenue?: { month: string; revenue: number; orders: number }[];
}

export default function SalesDashboardPage() {
  const { data, loading } = useApi<SalesOverview>("/analytics/overview", {});
  const { data: salesData, loading: salesLoading } = useApi<
    { month: string; revenue: number; orders: number }[]
  >("/analytics/sales", []);

  const chartData =
    Array.isArray(salesData) && salesData.length > 0
      ? salesData
      : (data?.monthlyRevenue ?? []);

  const fmt = (n?: number) =>
    n !== undefined ? `₦${(n / 1000000).toFixed(1)}M` : "—";

  return (
    <div>
      <PageHeader
        title="Sales Intelligence"
        subtitle="Revenue analytics and demand forecasting"
        badge="LIVE"
        badgeVariant="green"
      />

      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="card"
              style={{
                height: 80,
                background: "var(--bg-overlay)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <KpiCard
            label="Total Revenue"
            value={fmt(data?.totalRevenue)}
            change={data?.revenueChange}
            icon={<DollarSign className="w-4 h-4" />}
          />
          <KpiCard
            label="Orders"
            value={(data?.totalOrders ?? 0).toLocaleString()}
            change={data?.ordersChange}
            icon={<ShoppingCart className="w-4 h-4" />}
            color="#3b82f6"
          />
          <KpiCard
            label="Pharmacies"
            value={(data?.totalPharmacies ?? 0).toLocaleString()}
            icon={<Users className="w-4 h-4" />}
            color="#a855f7"
          />
          <KpiCard
            label="PPMVs"
            value={(data?.totalPPMVs ?? 0).toLocaleString()}
            icon={<TrendingUp className="w-4 h-4" />}
            color="#f59e0b"
          />
        </div>
      )}

      {salesLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Loader2
            style={{ width: 24, height: 24, color: "var(--k)" }}
            className="animate-spin"
          />
        </div>
      ) : chartData.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 48,
            color: "var(--tx-3)",
            fontSize: 13,
          }}
        >
          No sales data available yet — data will appear as orders are
          processed.
        </div>
      ) : (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div className="card">
            <p
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 14,
                marginBottom: 4,
              }}
            >
              Monthly Revenue (₦M)
            </p>
            <p style={{ fontSize: 11, color: "var(--tx-3)", marginBottom: 16 }}>
              12-month trend
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 10,
                    fill: "var(--tx-3)",
                    fontFamily: "'DM Mono',monospace",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(v) => [
                    `₦${(Number(v) / 1000000).toFixed(2)}M`,
                    "Revenue",
                  ]}
                  contentStyle={{
                    background: "var(--bg-overlay)",
                    border: "1px solid var(--bd-2)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="revenue" fill="#14b88e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <p
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 14,
                marginBottom: 4,
              }}
            >
              Order Volume
            </p>
            <p style={{ fontSize: 11, color: "var(--tx-3)", marginBottom: 16 }}>
              Monthly orders
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--bd-1)" />
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 10,
                    fill: "var(--tx-3)",
                    fontFamily: "'DM Mono',monospace",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(v) => [v, "Orders"]}
                  contentStyle={{
                    background: "var(--bg-overlay)",
                    border: "1px solid var(--bd-2)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
