"use client";
import { PageHeader } from "@/components/ui/page-header";
export default function TraceabilityPage() {
  return (<div><PageHeader title="Batch Traceability" subtitle="End-to-end pharmaceutical supply chain traceability"/><div className="card"><input className="kx-input" placeholder="Enter batch number or GTIN to trace..." style={{marginBottom:16}}/><button className="btn-primary">Trace Batch</button></div></div>);
}