"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/seed-data";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/yourhandle" },
  { label: "Spotify", href: "https://open.spotify.com/artist/yourid" },
  { label: "TikTok", href: "https://tiktok.com/@yourhandle" }
];

const ERRORS: Record<string, string> = {
  expired: "That link expired — enter your email again for a new one.",
  missing_token: "That link looks broken — try again below.",
  not_uploaded: "The file isn't uploaded yet — check back soon."
};

export default function FreeKitClient({ freeProduct }: { freeProduct: Product }) {
  return (
    <Suspense fallback={null}>
      <FreeKitContent freeProduct={freeProduct} />
    </Suspense>
  );
}

function FreeKitContent({ freeProduct }: { freeProduct: Product }) {
  const params = useSearchParams();
  const urlError = params.get("error");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(urlError ? ERRORS[urlError] || null : null);
  const [mode, setMode] = useState<"idle" | "instant" | "confirm">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productSlug: freeProduct.slug })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      if (data.mode === "confirm") {
        setMode("confirm");
      } else {
        setMode("instant");
        setDownloadUrl(data.downloadUrl);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:items-center">
        {freeProduct.image ? (
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line sm:aspect-[4/5]">
            <Image src={freeProduct.image} alt={freeProduct.title} fill sizes="50vw" className="object-cover" />
          </div>
        ) : (
          <div
            className="aspect-[4/5] rounded-[28px] border border-line sm:aspect-[4/5]"
            style={{
              background: `radial-gradient(120% 140% at 20% 10%, ${freeProduct.cover.accent}44, transparent 55%), linear-gradient(140deg, ${freeProduct.cover.from}, ${freeProduct.cover.to})`
            }}
          />
        )}

        <div>
          <span className="rounded-full bg-pink px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-white">
            FREE
          </span>
          <h1 className="mt-4 font-display text-4xl text-ink">{freeProduct.title}</h1>
          <p className="mt-2 text-sm text-mute">{freeProduct.contains.join(" / ")}</p>
          <p className="mt-5 text-sm leading-relaxed text-mute">{freeProduct.description}</p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {freeProduct.tags.map((t) => (
              <span key={t} className="tag-chip">
                {t}
              </span>
            ))}
          </div>

          {mode === "idle" && (
            <form onSubmit={submit} className="mt-8">
              <label htmlFor="email" className="text-xs text-mute">
                Enter your email — we'll send you the download link
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 rounded-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-pink"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="whitespace-nowrap rounded-full bg-pink px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Sending…" : "Send it →"}
                </button>
              </div>
              {error && <p className="mt-3 text-sm text-pink">{error}</p>}
              <p className="mt-3 text-xs text-mute">
                No spam — just your free kit and the occasional new drop. Unsubscribe anytime.
              </p>
            </form>
          )}

          {mode === "confirm" && (
            <div className="mt-8 rounded-2xl border border-line bg-white p-5">
              <p className="text-sm text-ink">Check your inbox 📬</p>
              <p className="mt-2 text-sm text-mute">
                We sent a link to <span className="text-ink">{email}</span> — click it to confirm and your
                download starts right away.
              </p>
              <p className="mt-3 text-xs text-mute">
                Don't see it? Check spam, or make sure you typed your email correctly.
              </p>
            </div>
          )}

          {mode === "instant" && (
            <div className="mt-8 rounded-2xl border border-line bg-white p-5">
              <p className="text-sm text-ink">You're in 🤍</p>
              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  className="mt-3 flex items-center justify-between rounded-full bg-pink px-5 py-3 text-sm font-medium text-white"
                >
                  <span>Download {freeProduct.title}</span>
                  <span>↓</span>
                </a>
              ) : (
                <p className="mt-2 text-sm text-mute">
                  The file isn't uploaded yet — see lib/store.ts / the admin panel.
                </p>
              )}
            </div>
          )}

          <div className="mt-8 border-t border-line pt-6">
            <p className="text-xs text-mute">Bonus — follow along for more free drops:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="filter-pill"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
