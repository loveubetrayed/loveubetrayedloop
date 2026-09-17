"use client";

import { useEffect, useRef } from "react";

export default function FlowingWave({
  playing,
  className = "",
  width = 300,
  height = 40,
  strokeWidth = 2
}: {
  playing: boolean;
  className?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef(Math.random() * 10);
  const points = 48;

  function draw(amplitude: number) {
    const path = pathRef.current;
    if (!path) return;
    const pts: string[] = [];
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const edgeFade = Math.sin((i / points) * Math.PI);
      const y =
        height / 2 +
        Math.sin((i / points) * Math.PI * 5 + phaseRef.current) * amplitude * edgeFade +
        Math.sin((i / points) * Math.PI * 2.3 + phaseRef.current * 1.6) * amplitude * 0.35 * edgeFade;
      pts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    path.setAttribute("d", pts.join(" "));
  }

  useEffect(() => {
    function tick() {
      phaseRef.current += playing ? 0.05 : 0.008;
      draw(playing ? height * 0.24 : height * 0.05);
      rafRef.current = requestAnimationFrame(tick);
    }
    tick();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      <path ref={pathRef} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}
