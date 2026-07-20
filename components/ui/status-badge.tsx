type Status =
  | "LIVE" | "DEMO" | "LOADING"
  | "Active" | "Inactive" | "In Stock" | "Low Stock" | "Expiring Soon"
  | "Pending" | "Processing" | "Dispatched" | "Delivered" | "Cancelled"
  | "Operational" | "Maintenance" | "Draft" | "Sent" | "Responded"
  | "Approved" | "Rejected" | "Dispensed" | "Expired" | "Routed" | "Revoked"
  | "info" | "warning" | "critical"
  | string;

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<string, string> = {
    // Data source indicators
    "LIVE":        "badge-green",
    "LOADING":     "badge-amber",
    "DEMO":        "badge-ink",

    // Entity / order states
    "Active":      "badge-green",
    "Operational": "badge-green",
    "Delivered":   "badge-green",
    "In Stock":    "badge-green",
    "Approved":    "badge-green",
    "Dispensed":   "badge-green",
    "Responded":   "badge-green",

    "Pending":      "badge-amber",
    "Processing":   "badge-amber",
    "Sent":         "badge-amber",
    "Expiring Soon":"badge-amber",
    "Maintenance":  "badge-amber",
    "Draft":        "badge-amber",
    "Low Stock":    "badge-amber",
    "Routed":       "badge-amber",
    "warning":      "badge-amber",

    "Inactive":   "badge-ink",
    "Cancelled":  "badge-ink",
    "Revoked":    "badge-ink",
    "Expired":    "badge-ink",

    "Rejected": "badge-red",
    "critical": "badge-red",

    "Dispatched": "badge-blue",
    "info":       "badge-blue",
  };

  return (
    <span className={`badge ${map[status] ?? "badge-k"}`}>
      {status}
    </span>
  );
}