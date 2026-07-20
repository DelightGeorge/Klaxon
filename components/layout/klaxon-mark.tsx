interface KlaxonMarkProps {
  size?: "sm" | "md" | "lg";
  wordmark?: boolean;
}

export function KlaxonMark({ size = "md", wordmark = true }: KlaxonMarkProps) {
  const config = {
    sm: { r1: 14, r2:  9, sw: 1.4, kw: 1.6, dot: 2.2, font: 13, gap:  8 },
    md: { r1: 22, r2: 15, sw: 2,   kw: 2.4, dot: 3.2, font: 19, gap: 11 },
    lg: { r1: 34, r2: 23, sw: 2.5, kw: 3.4, dot: 4.8, font: 28, gap: 15 },
  };

  const s   = config[size];
  const d   = s.r1;
  const sz  = d * 2 + 4;
  const cx  = d + 2;

  const ax  = cx - d;
  const bx  = cx + d * 0.5;
  const by  = cx - d * 0.866;
  const bx2 = cx + d * 0.5;
  const by2 = cx + d * 0.866;

  const kx = cx - s.r2 * 0.3;
  const ky = s.r2 * 0.62;

  const dots: [number, number][] = [[ax, cx], [bx, by], [bx2, by2]];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: s.gap }}>
      <svg
        width={sz}
        height={sz}
        viewBox={`0 0 ${sz} ${sz}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx={cx} cy={cx} r={d} stroke="rgba(20,184,142,0.18)" strokeWidth="1" strokeDasharray="3 2.5" />
        <path d={`M ${ax},${cx} A ${d},${d} 0 0,1 ${bx},${by}`} stroke="#14b88e" strokeWidth={s.sw} strokeLinecap="round" />
        <path d={`M ${bx2},${by2} A ${d},${d} 0 0,1 ${cx - d * 0.5},${by2}`} stroke="#14b88e" strokeWidth={s.sw} strokeLinecap="round" />
        <circle cx={cx} cy={cx} r={s.r2} fill="rgba(20,184,142,0.07)" stroke="#14b88e" strokeWidth={s.sw * 0.65} />
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={s.dot} fill="#14b88e" />
        ))}
        <line x1={kx} y1={cx - ky} x2={kx} y2={cx + ky} stroke="#eeeef2" strokeWidth={s.kw} strokeLinecap="round" />
        <line x1={kx} y1={cx} x2={kx + s.r2 * 0.7} y2={cx - ky} stroke="#eeeef2" strokeWidth={s.kw} strokeLinecap="round" />
        <line x1={kx} y1={cx} x2={kx + s.r2 * 0.7} y2={cx + ky} stroke="#eeeef2" strokeWidth={s.kw} strokeLinecap="round" />
        <circle cx={kx} cy={cx} r={s.dot * 0.65} fill="#14b88e" />
      </svg>

      {wordmark && (
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: s.font,
            letterSpacing: "-0.04em",
            color: "var(--tx-1)",
            lineHeight: 1,
          }}
        >
          KLAXON
        </span>
      )}
    </div>
  );
}
