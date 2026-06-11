export function KlaxonMark({
  size = "md",
  wordmark = true,
}: {
  size?: "sm" | "md" | "lg";
  wordmark?: boolean;
}) {
  const s = {
    sm: { r1: 16, r2: 10, sw: 1.5, kw: 1.75, dot: 2.5, font: 14, gap: 10 },
    md: { r1: 24, r2: 16, sw: 2,   kw: 2.5,  dot: 3.5, font: 20, gap: 12 },
    lg: { r1: 36, r2: 24, sw: 2.5, kw: 3.5,  dot: 5,   font: 30, gap: 16 },
  }[size];

  const d = s.r1;
  const svgSize = d * 2 + 4;
  const cx = d + 2;

  // arc endpoints: left, upper-right, lower-right
  const ax = cx - d;
  const bx = cx + d * 0.5, by = cx - d * 0.866;
  const bx2 = cx + d * 0.5, by2 = cx + d * 0.866;

  // K proportions relative to inner circle
  const kx = cx - s.r2 * 0.3;
  const ky = s.r2 * 0.62;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: s.gap }}>
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* outer dashed ring */}
        <circle cx={cx} cy={cx} r={d} stroke="rgba(20,184,142,0.18)" strokeWidth="1" strokeDasharray="3 2.5"/>
        {/* arc 1: left → upper-right */}
        <path d={`M ${ax},${cx} A ${d},${d} 0 0,1 ${bx},${by}`} stroke="#14b88e" strokeWidth={s.sw} strokeLinecap="round"/>
        {/* arc 2: lower-right → lower-left */}
        <path d={`M ${bx2},${by2} A ${d},${d} 0 0,1 ${cx - d * 0.5},${by2}`} stroke="#14b88e" strokeWidth={s.sw} strokeLinecap="round"/>
        {/* inner circle */}
        <circle cx={cx} cy={cx} r={s.r2} fill="rgba(20,184,142,0.07)" stroke="#14b88e" strokeWidth={s.sw * 0.65}/>
        {/* endpoint dots */}
        {[[ax, cx], [bx, by], [bx2, by2]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={s.dot} fill="#14b88e"/>
        ))}
        {/* K strokes */}
        <line x1={kx} y1={cx - ky} x2={kx} y2={cx + ky} stroke="#eeeef2" strokeWidth={s.kw} strokeLinecap="round"/>
        <line x1={kx} y1={cx} x2={kx + s.r2 * 0.7} y2={cx - ky} stroke="#eeeef2" strokeWidth={s.kw} strokeLinecap="round"/>
        <line x1={kx} y1={cx} x2={kx + s.r2 * 0.7} y2={cx + ky} stroke="#eeeef2" strokeWidth={s.kw} strokeLinecap="round"/>
        {/* pivot dot */}
        <circle cx={kx} cy={cx} r={s.dot * 0.65} fill="#14b88e"/>
      </svg>

      {wordmark && (
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: s.font,
          letterSpacing: "-0.04em",
          color: "var(--tx-1)",
          lineHeight: 1,
        }}>
          KLAXON
        </span>
      )}
    </div>
  );
}