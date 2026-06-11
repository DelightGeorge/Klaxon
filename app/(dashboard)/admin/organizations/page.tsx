"use client";
import { PageHeader } from "@/components/ui/page-header";
export default function AdminOrgsPage() {
  return (<div><PageHeader title="Organizations" subtitle="Manage tenant organizations on the platform" action={<button className="btn-primary btn-sm">+ Add Organization</button>}/><div className="card" style={{textAlign:"center",padding:"40px",color:"var(--tx-3)"}}>Connect to backend to manage organizations.</div></div>);
}