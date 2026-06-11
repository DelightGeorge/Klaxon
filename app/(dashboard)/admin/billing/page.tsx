"use client";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { DollarSign, CreditCard, Users, TrendingUp } from "lucide-react";
export default function BillingPage() {
  return (<div><PageHeader title="Billing & Subscriptions" subtitle="Platform subscription management"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
      <KpiCard label="MRR" value="₦4.2M" change={8.4} icon={<DollarSign className="w-4 h-4"/>}/>
      <KpiCard label="Active Subscriptions" value="284" icon={<CreditCard className="w-4 h-4"/>} color="#3b82f6"/>
      <KpiCard label="Paying Customers" value="241" icon={<Users className="w-4 h-4"/>} color="#a855f7"/>
      <KpiCard label="Churn Rate" value="1.2%" icon={<TrendingUp className="w-4 h-4"/>} color="#22c55e"/>
    </div>
    <div className="card" style={{textAlign:"center",padding:"40px",color:"var(--tx-3)"}}>Integrate Paystack or Stripe for subscription management.</div></div>);
}