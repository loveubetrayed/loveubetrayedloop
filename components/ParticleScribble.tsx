// Deterministic "particle cloud" of thin pink strokes + dots (no Math.random,
// so server and client render the exact same thing).
function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const { strokes, dots } = (() => {
  const r = rng(11);
  const strokes: string[] = [];
  const dots: { x: number; y: number; r: number }[] = [];
  const cx = 100;
  const cy = 78;
  for (let i = 0; i < 52; i++) {
    const a = r() * Math.PI * 2;
    const d1 = 6 + r() * 46;
    const d2 = d1 + 8 + r() * 34;
    const a2 = a + (r() - 0.5) * 0.9;
    const x1 = cx + Math.cos(a) * d1;
    const y1 = cy + Math.sin(a) * d1 * 0.8;
    const x2 = cx + Math.cos(a2) * d2;
    const y2 = cy + Math.sin(a2) * d2 * 0.8;
    const qx = (x1 + x2) / 2 + (r() - 0.5) * 22;
    const qy = (y1 + y2) / 2 + (r() - 0.5) * 22;
    strokes.push(`M${x1.toFixed(1)} ${y1.toFixed(1)}Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`);
  }
  for (let i = 0; i < 70; i++) {
    const a = r() * Math.PI * 2;
    const d = r() * 62;
    dots.push({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * 0.8, r: 0.4 + r() * 1 });
  }
  return { strokes, dots };
})();

export default function ParticleScribble({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 156" className={className} aria-hidden="true">
      {strokes.map((d, i) => (
        <path key={i} d={d} stroke="#D6246E" strokeWidth="0.55" fill="none" />
      ))}
      {dots.map((c, i) => (
        <circle key={i} cx={c.x.toFixed(1)} cy={c.y.toFixed(1)} r={c.r.toFixed(2)} fill="#FF5B9E" />
      ))}
    </svg>
  );
}
