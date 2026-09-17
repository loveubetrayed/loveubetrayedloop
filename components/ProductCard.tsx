"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useFavorite } from "@/lib/use-favorite";
import type { Product } from "@/lib/seed-data";
import PulsePlayButton from "./PulsePlayButton";
import { FREE_MODE } from "@/lib/site-config";

const FADE_MS = 220;

export default function ProductCard({ product, downloadCount = 0 }: { product: Product; downloadCount?: number }) {
  const { add } = useCart();
  const { active: favorited, toggle } = useFavorite(product.slug);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => () => {
    audioRef.current?.pause();
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
  }, []);

  function fadeTo(target: number, onDone?: () => void) {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    const start = audio.volume;
    const startTime = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / FADE_MS);
      audio.volume = start + (target - start) * t;
      if (t < 1) {
        fadeRef.current = requestAnimationFrame(step);
      } else {
        onDone?.();
      }
    };
    fadeRef.current = requestAnimationFrame(step);
  }

  function startPreview() {
    if (!product.previewUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(product.previewUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0;
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }
    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .then(() => {
        setPlaying(true);
        fadeTo(1);
      })
      .catch(() => {});
  }

  function stopPreview() {
    if (!audioRef.current) return;
    setPlaying(false);
    fadeTo(0, () => {
      audioRef.current?.pause();
    });
  }

  function togglePreview(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    playing ? stopPreview() : startPreview();
  }

  function handleAdd() {
    add(product.slug);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="group relative overflow-hidden rounded-[28px] bg-panel shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
      <Link
        href={`/product/${product.slug}`}
        onMouseEnter={startPreview}
        onMouseLeave={stopPreview}
        className="relative block aspect-[4/5] overflow-hidden"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 transition duration-700 group-hover:scale-105"
            style={{
              background: `radial-gradient(120% 140% at 20% 15%, ${product.cover.accent}55, transparent 55%), linear-gradient(155deg, ${product.cover.from}, ${product.cover.to})`
            }}
          />
        )}

        {/* Scrim so white text stays legible over any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          {product.originalPrice && !FREE_MODE ? (
            <span className="rounded-full bg-white px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-ink">
              SALE
            </span>
          ) : FREE_MODE ? (
            <span className="rounded-full bg-pink px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-white">
              FREE
            </span>
          ) : product.isNew ? (
            <span className="rounded-full bg-pink px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-white">
              NEW
            </span>
          ) : (
            <span />
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle();
            }}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            data-active={favorited}
            className="heart-btn flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.8">
              <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1.2 4.5 2.7C12 6.2 13.5 5 15.5 5 19 5 21.5 8.5 21.5 12.5 19 16.65 12 21 12 21z" />
            </svg>
          </button>
        </div>

        {product.previewUrl && (
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
              playing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <PulsePlayButton playing={playing} onClick={togglePreview} size={50} />
          </div>
        )}

        {/* Title + meta live on the image itself, poster-style */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-display text-xl leading-tight text-white">{product.title}</h3>
          <p className="mt-1 text-xs text-white/70">{product.contains.join(" / ")}</p>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 font-mono text-[0.65rem] text-white backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
            <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 font-mono text-[0.65rem] text-white backdrop-blur-sm">
              ♪ {product.key}
            </span>
          </div>

          {downloadCount >= 3 && (
            <p className="mt-2 font-mono text-[0.65rem] text-white/60">
              🎧 {downloadCount.toLocaleString()} got this kit
            </p>
          )}
        </div>
      </Link>

      <div className="p-3">
        {FREE_MODE ? (
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center justify-center rounded-full bg-ink py-2.5 text-center text-sm text-white transition hover:opacity-85"
          >
            Get for free
          </Link>
        ) : (
          <button
            onClick={handleAdd}
            disabled={added}
            className={`flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm transition disabled:cursor-default ${
              added ? "bg-[#FFF0F6] text-pink" : "bg-ink text-white hover:opacity-85"
            }`}
          >
            <span>{added ? "Added ✓" : "Add to cart"}</span>
            {!added && (
              <span className="font-display">
                {product.originalPrice && (
                  <span className="mr-1 text-white/50 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
                ${product.price.toFixed(2)}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
