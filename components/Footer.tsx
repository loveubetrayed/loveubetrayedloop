"use client";

import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subscribeOnly: true })
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer id="contact" className="border-t border-line/70 bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div>
            <div className="font-medium lowercase text-lg text-ink">iloveubetrayed © 2026</div>
            <p className="mt-1 max-w-sm text-sm text-mute">
              Instant download after checkout. ZIP · WAV / MIDI. 100% royalty-free, use in any project.
            </p>
            <div className="mt-4 flex flex-col gap-1 text-sm text-mute">
              <a href="mailto:hello@iloveubetrayed.example" className="underline-grow w-fit hover:text-ink">
                hello@iloveubetrayed.example
              </a>
              <span>License & terms</span>
            </div>
          </div>

          <div className="sm:justify-self-end sm:text-right">
            <p className="text-sm text-ink">Stay in the loop</p>
            <p className="mt-1 text-xs text-mute">New drops and free kits, occasionally. No spam.</p>

            {status === "done" ? (
              <p className="mt-3 text-sm text-pink">You're subscribed 🤍</p>
            ) : (
              <form onSubmit={subscribe} className="mt-3 flex gap-2 sm:justify-end">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full max-w-[220px] rounded-full border border-line bg-white px-4 py-2 text-sm text-ink outline-none focus:border-pink"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="whitespace-nowrap rounded-full bg-pink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {status === "loading" ? "…" : "Join"}
                </button>
              </form>
            )}
            {status === "error" && <p className="mt-2 text-xs text-pink">Something went wrong — try again.</p>}
          </div>
        </div>
      </div>
    </footer>
  );
}
