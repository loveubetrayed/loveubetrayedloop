// Hand-painted looking pink strokes: thick paths with a rough displacement
// filter so the edges look like real brush marks instead of clean vectors.
export default function BrushStroke({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 420" className={className} fill="none" aria-hidden="true">
      <defs>
        <filter id="brush-rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="16" />
        </filter>
      </defs>
      <g filter="url(#brush-rough)" strokeLinecap="round">
        <path d="M60 340C120 80 260 40 300 190S440 380 590 80" stroke="#FFB3D1" strokeWidth="44" />
        <path d="M120 380C200 300 260 360 330 300" stroke="#FF8FBE" strokeWidth="26" />
        <path d="M420 60C470 140 540 120 600 200" stroke="#FFD9E8" strokeWidth="30" />
      </g>
    </svg>
  );
}
