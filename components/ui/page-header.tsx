// components/ui/page-header.tsx

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: string;
  /**
   * Controls badge styling:
   * - "live"  ? green, this page reads/writes the real backend
   * - "demo"  ? amber/neutral, this page is showing mock data only
   * - "k"     ? default brand green (legacy behavior, e.g. dashboard's "LIVE"/"LOADING")
   * - "green" ? alias for "live", same styling
   */
  badgeVariant?: "live" | "demo" | "k" | "green";
}

const BADGE_CLASS: Record<NonNullable<PageHeaderProps["badgeVariant"]>, string> = {
  live: "badge-green",
  green: "badge-green",
  demo: "badge-amber",
  k: "badge-k",
};

export function PageHeader({ title, subtitle, action, badge, badgeVariant = "k" }: PageHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 24,
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 className="page-title">{title}</h1>
          {badge && <span className={`badge ${BADGE_CLASS[badgeVariant]}`}>{badge}</span>}
        </div>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
      {action && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {action}
        </div>
      )}
    </div>
  );
}