"use client";

import Link from "next/link";
import { useRef } from "react";
import { FREE_MODE } from "@/lib/site-config";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current!.style.setProperty("--glow-x", `${x}%`);
    ref.current!.style.setProperty("--glow-y", `${y}%`);
  }

  const marqueeItems = Array(10).fill("iloveubetrayed");

  return (
    <section
      ref={ref}
      onMouseMove={handleMove}
      className="relative overflow-hidden border-b border-line"
      style={{ ["--glow-x" as any]: "70%", ["--glow-y" as any]: "10%" }}
    >
      {/* Drop a photo at public/hero.jpg (or .png/.webp — just update the path
          below to match) and it becomes the hero background. Until then this
          stays empty and you just see the plain cream background + glow. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.jpg')", filter: "blur(1px) saturate(0.9) brightness(1.03)" }}
      />
      {/* A soft haze rather than a hard fade — the photo stays visible well
          into the section before settling into the plain cream background. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(250,249,246,0.12) 0%, rgba(250,249,246,0.30) 40%, rgba(250,249,246,0.55) 65%, rgba(250,249,246,0.92) 88%, rgba(250,249,246,1) 100%)"
        }}
      />

      {/* Mouse-reactive glow — a quiet, premium touch instead of a static gradient */}
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-300 ease-out"
        style={{
          background:
            "radial-gradient(600px circle at var(--glow-x) var(--glow-y), rgba(255,91,158,0.20), transparent 60%)"
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-10 sm:pt-14">
        <p className="font-mono text-sm text-mute">sample packs / loop kits</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-light leading-[1.08] text-pink sm:text-5xl">
          premium loops for your sound
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-mute">
          Curated loops, melodies, drums and one-shots. Instant download, 100% royalty-free,
          built for whatever you're making tonight.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href="/loops"
            className="rounded-full bg-pink px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Browse kits →
          </Link>
          <Link
            href="/free"
            className="rounded-full border border-line bg-white px-6 py-3 text-sm text-ink transition hover:border-pink"
          >
            {FREE_MODE ? "Try the starter kit" : "Get a free kit"}
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-mute">
          <span>⚡ Instant download</span>
          <span>✓ 100% royalty-free</span>
          <span>{FREE_MODE ? "📧 Just your email — no card needed" : "🔒 Secure checkout via Stripe"}</span>
        </div>
      </div>

      <div className="relative mt-8 border-y border-line/70 py-3 sm:mt-10">
        <div className="marquee-track flex items-center whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((word, i) => (
            <span key={i} className="text-sm font-medium lowercase tracking-wide text-mute">
              {word}
              <span className="mx-6 text-pink">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
