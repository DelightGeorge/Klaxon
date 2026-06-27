// components/ui/page-header.tsx

type BadgeVariant = "k" | "green" | "amber" | "ink" | "red" | "blue";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: string;
  /** Controls the badge colour. Defaults to "k" (brand teal).
   *  Pass "green" for LIVE, "ink" for DEMO, "amber" for LOADING. */
  badgeVariant?: BadgeVariant;
}

export function PageHeader({
  title,
  subtitle,
  action,
  badge,
  badgeVariant = "k",
}: PageHeaderProps) {
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
          {badge && (
            <span className={`badge badge-${badgeVariant}`}>{badge}</span>
          )}
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