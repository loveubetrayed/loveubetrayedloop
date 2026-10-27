"use client";

import Link from "next/link";
import { useRef } from "react";
import { FREE_MODE } from "@/lib/site-config";
import Window from "./Window";
import Sticker from "./Sticker";
import BrushStroke from "./BrushStroke";
import ParticleScribble from "./ParticleScribble";

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
      className="relative mt-3 overflow-hidden rounded-b-[32px] border-b border-line sm:mt-4"
      style={{
        ["--glow-x" as any]: "70%",
        ["--glow-y" as any]: "20%",
        background: "linear-gradient(180deg, #FFE8F1 0%, #FAF1F2 100%)"
      }}
    >
      <BrushStroke className="pointer-events-none absolute -right-24 -top-6 hidden h-[430px] w-[650px] opacity-70 lg:block" />
      <BrushStroke className="pointer-events-none absolute -left-40 top-24 h-[260px] w-[400px] rotate-12 opacity-30" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(520px circle at var(--glow-x) var(--glow-y), rgba(255,91,158,0.16), transparent 60%)"
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-6 pt-10 sm:pt-12 lg:grid-cols-[1.05fr_1fr]">
        <div className="pb-4">
          <p className="font-mono text-sm text-mute">sample packs / loop kits</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl font-light leading-[1.05] text-pink sm:text-6xl">
            premium loops for your sound
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/70">
            Curated loops, melodies, drums and one-shots. Royalty-free, built for whatever you&apos;re making tonight.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/loops"
              className="rounded-full bg-pink px-6 py-3 text-sm font-medium text-white shadow-[0_10px_24px_-8px_rgba(255,91,158,0.7)] transition hover:opacity-90"
            >
              Browse kits →
            </Link>
            <Link
              href="/free"
              className="rounded-full border border-ink bg-white px-6 py-3 text-sm text-ink transition hover:bg-blush"
            >
              {FREE_MODE ? "Try the starter kit" : "Get a free kit"}
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-3">
            <Sticker rotate={-3}>instant download</Sticker>
            <Sticker rotate={2}>100% royalty-free</Sticker>
            <Sticker rotate={-1.5}>{FREE_MODE ? "just your email" : "secure checkout"}</Sticker>
          </div>
        </div>

        {/* Desktop collage: floating windows + cut-up photo tiles */}
        <div className="relative hidden h-[350px] lg:block" aria-hidden="true">
          {/* mosaic tiles sitting behind the windows */}
          <div className="absolute right-0 top-40 h-28 w-16 bg-pink" />
          <div
            className="absolute right-16 top-52 h-24 w-28 bg-blush bg-cover bg-center"
            style={{ backgroundImage: "url('/2hero.jpg')" }}
          />

          <div className="absolute left-2 top-12 w-[230px] -rotate-3">
            <span className="absolute -top-2 left-1/2 z-10 h-5 w-16 -translate-x-1/2 -rotate-3 bg-pink/50" />
            <Window title="hero.jpg" right="1/3">
              <div
                className="h-36 bg-blush bg-cover bg-center"
                style={{ backgroundImage: "url('/hero.jpg')" }}
              />
            </Window>
          </div>

          <div className="absolute right-6 top-2 w-[255px] rotate-2">
            <Window title="preview.app" right="1x">
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <span className="pulse-ring" />
                    <span className="pulse-ring" style={{ animationDelay: "0.6s" }} />
                    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-pink to-[#FF8FBE]" />
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="white" className="relative" style={{ marginLeft: 2 }}>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[0.7rem] text-ink">loop_001.wav</p>
                    <p className="font-mono text-[0.62rem] text-mute">hover any kit to listen</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="font-mono text-[0.6rem] text-mute">0:02</span>
                  <div className="relative h-1 flex-1 rounded-full bg-blush">
                    <div className="h-full w-[14%] rounded-full bg-pink" />
                    <span className="absolute left-[14%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-pink" />
                  </div>
                  <span className="font-mono text-[0.6rem] text-mute">1:27</span>
                </div>
              </div>
            </Window>
          </div>

          <div className="absolute bottom-0 left-28 w-[215px] -rotate-1">
            <Window title="new-drop.txt" right="v1.0">
              <div className="relative h-36 bg-white">
                <ParticleScribble className="absolute inset-0 h-full w-full" />
                <span className="absolute left-2 top-1.5 font-mono text-[0.62rem] text-ink">loop kits</span>
              </div>
            </Window>
          </div>

          <Sticker rotate={6} className="absolute bottom-2 right-4">
            free kits ✦
          </Sticker>
        </div>
      </div>

      {/* Pink tape band */}
      <div className="relative mt-8 bg-pink py-2.5 sm:mt-10">
        <div className="marquee-track flex items-center whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((word, i) => (
            <span key={i} className="text-sm font-medium lowercase tracking-wide text-white">
              {word}
              <span className="mx-6 text-blush">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
