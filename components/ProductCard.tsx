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
      .catch(() => {
        // Autoplay without a prior click/tap gesture — browsers may block the
        // very first attempt. It resolves itself after any click on the page.
      });
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
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
      <div className="h-[3px] w-full" style={{ background: product.cover.accent }} />
      <Link
        href={`/product/${product.slug}`}
        onMouseEnter={startPreview}
        onMouseLeave={stopPreview}
        className="relative block aspect-[16/9] overflow-hidden"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 transition duration-500 group-hover:scale-105"
            style={{
              background: `radial-gradient(120% 140% at 15% 10%, ${product.cover.accent}44, transparent 55%), linear-gradient(140deg, ${product.cover.from}, ${product.cover.to})`
            }}
          />
        )}

        {product.originalPrice && !FREE_MODE ? (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-white">
            SALE
          </span>
        ) : FREE_MODE ? (
          <span className="absolute left-3 top-3 rounded-full bg-pink px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-white">
            FREE
          </span>
        ) : product.isNew ? (
          <span className="absolute left-3 top-3 rounded-full bg-pink px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-white">
            NEW
          </span>
        ) : null}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle();
          }}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          data-active={favorited}
          className="heart-btn absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.8">
            <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1.2 4.5 2.7C12 6.2 13.5 5 15.5 5 19 5 21.5 8.5 21.5 12.5 19 16.65 12 21 12 21z" />
          </svg>
        </button>

        {product.previewUrl && (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 ${
              playing ? "bg-black/15" : "group-hover:bg-black/15"
            }`}
          >
            <div
              className={`transition duration-200 ${
                playing ? "scale-100 opacity-100" : "scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100"
              }`}
            >
              <PulsePlayButton playing={playing} onClick={togglePreview} size={48} />
            </div>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <Link href={`/product/${product.slug}`} className="font-display text-xl text-ink hover:text-pink">
            {product.title}
          </Link>
          <p className="mt-1 text-xs text-mute">{product.contains.join(" / ")}</p>
          {downloadCount >= 3 && (
            <p className="mt-1 font-mono text-[0.68rem] text-mute">🎧 {downloadCount.toLocaleString()} got this kit</p>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {product.tags.map((t) => (
            <span key={t} className="tag-chip">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <span className="flex items-center gap-1 rounded-full border border-line bg-cream px-2.5 py-1 font-mono text-[0.68rem] text-mute">
            ♪ {product.key}
          </span>
          {!FREE_MODE && (
            <span className="font-display text-lg text-ink">
              {product.originalPrice && (
                <span className="mr-1.5 text-sm text-mute line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {FREE_MODE ? (
          <Link
            href={`/product/${product.slug}`}
            className="mt-1 rounded-full border border-line py-2 text-center text-sm text-ink transition hover:border-pink hover:text-pink"
          >
            Get for free
          </Link>
        ) : (
          <button
            onClick={handleAdd}
            disabled={added}
            className={`mt-1 rounded-full border py-2 text-sm transition disabled:cursor-default ${
              added ? "border-pink bg-[#FFF0F6] text-pink" : "border-line text-ink hover:border-pink hover:text-pink"
            }`}
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
        )}
      </div>
    </div>
  );
}
