"use client";

function seededBars(seed: string, count: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    const t = (h % 1000) / 1000;
    bars.push(0.25 + t * 0.75);
  }
  return bars;
}

export default function Waveform({
  seed,
  bars = 46,
  playing = false,
  className = ""
}: {
  seed: string;
  bars?: number;
  playing?: boolean;
  className?: string;
}) {
  const heights = seededBars(seed, bars);
  const width = bars * 3;

  return (
    <svg
      viewBox={`0 0 ${width} 24`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 3}
          y={(24 - 24 * h) / 2}
          width="1.6"
          height={24 * h}
          rx="0.8"
          fill="currentColor"
          className={playing ? "wf-bar" : ""}
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            animationDelay: `${(i % 7) * 0.09}s`
          }}
        />
      ))}
    </svg>
  );
}
