"use client";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { MOCK_KPI } from "@/lib/mock-data";
import { Truck, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function FulfillmentDashboardPage() {
  return (
    <div>
      <PageHeader title="Fulfillment" subtitle="Order fulfillment and delivery operations" />
      <div className="kx-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        <KpiCard label="Total Delivered" value={MOCK_KPI.delivered.toLocaleString()} change={MOCK_KPI.deliveredChange} icon={<CheckCircle2 className="w-4 h-4"/>} color="#22c55e" />
        <KpiCard label="Active Orders" value={MOCK_KPI.activeOrders.toLocaleString()} change={MOCK_KPI.ordersChange} icon={<Truck className="w-4 h-4"/>} />
        <KpiCard label="Pending Dispatch" value="284" icon={<Clock className="w-4 h-4"/>} color="#f59e0b" />
        <KpiCard label="Cancelled" value="42" icon={<XCircle className="w-4 h-4"/>} color="#f43f5e" />
      </div>
      <div style={{padding:"40px",textAlign:"center",border:"1px dashed var(--bd-2)",borderRadius:14,color:"var(--tx-3)"}}>
        <Truck className="w-12 h-12" style={{margin:"0 auto 12px",color:"var(--bd-2)"}} />
        <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,marginBottom:6}}>Logistics Map</p>
        <p style={{fontSize:12}}>Integrate Google Maps or Mapbox to show live delivery routes here</p>
      </div>
    </div>
  );
}