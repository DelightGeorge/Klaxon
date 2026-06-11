"use client";
import { PageHeader } from "@/components/ui/page-header";
export default function ApprovalsPage() {
  return (<div><PageHeader title="Procurement Approvals" subtitle="Review and approve pending procurement requests"/><div className="card" style={{textAlign:"center",padding:"40px",color:"var(--tx-3)"}}>No items pending approval.</div></div>);
}