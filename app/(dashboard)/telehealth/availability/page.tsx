"use client";
import { PageHeader } from "@/components/ui/page-header";
export default function AvailabilityPage() {
  return (<div><PageHeader title="Medication Availability" subtitle="Check drug availability across connected pharmacies"/><div className="card"><input className="kx-input" placeholder="Search for a medication..." style={{marginBottom:12}}/><p style={{fontSize:12,color:"var(--tx-3)",textAlign:"center",padding:"30px 0"}}>Enter a medication name to check real-time availability</p></div></div>);
}