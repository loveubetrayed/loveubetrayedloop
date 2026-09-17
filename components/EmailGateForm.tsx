"use client";

import { useState } from "react";

export default function EmailGateForm({ slug, title }: { slug: string; title: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        body: JSON.stringify({ email, productSlug: slug })
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

  if (mode === "confirm") {
    return (
      <div className="mt-8 rounded-2xl border border-line bg-white p-5">
        <p className="text-sm text-ink">Check your inbox 📬</p>
        <p className="mt-2 text-sm text-mute">
          We sent a link to <span className="text-ink">{email}</span> — click it to confirm and your
          download starts right away.
        </p>
        <p className="mt-3 text-xs text-mute">Don't see it? Check spam, or make sure you typed your email correctly.</p>
      </div>
    );
  }

  if (mode === "instant") {
    return (
      <div className="mt-8 rounded-2xl border border-line bg-white p-5">
        <p className="text-sm text-ink">You're in 🤍</p>
        {downloadUrl ? (
          <a
            href={downloadUrl}
            className="mt-3 flex items-center justify-between rounded-full bg-pink px-5 py-3 text-sm font-medium text-white"
          >
            <span>Download {title}</span>
            <span>↓</span>
          </a>
        ) : (
          <p className="mt-2 text-sm text-mute">The file isn't uploaded yet — check back soon.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8">
      <label htmlFor="gate-email" className="text-xs text-mute">
        Enter your email — we'll send you the download link
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="gate-email"
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
          {loading ? "Sending…" : "Get it free →"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-pink">{error}</p>}
      <p className="mt-3 text-xs text-mute">No spam — just your kit and the occasional new drop. Unsubscribe anytime.</p>
    </form>
  );
}
