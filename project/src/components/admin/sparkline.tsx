interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  // If true, lower values are "better" (e.g. conflict open-time)
  invert?: boolean;
}

export function Sparkline({
  values,
  width = 140,
  height = 36,
  stroke = "var(--accent)",
  fill,
  invert = false,
}: SparklineProps) {
  if (values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const stepX = values.length > 1 ? width / (values.length - 1) : 0;
  const pad = 3;
  const innerH = height - pad * 2;

  const points = values.map((v, i) => {
    const norm = (v - min) / range;
    const y = invert ? pad + norm * innerH : pad + (1 - norm) * innerH;
    return [i * stepX, y] as const;
  });

  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

  const areaPath =
    fill !== undefined
      ? `${path} L${(points[points.length - 1][0]).toFixed(2)},${height} L0,${height} Z`
      : null;

  const last = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="block"
      aria-hidden
    >
      {areaPath && <path d={areaPath} fill={fill} opacity={0.18} />}
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r={2.25} fill={stroke} />
    </svg>
  );
}
