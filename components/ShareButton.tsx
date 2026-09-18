"use client";

import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable — fail silently, it's a nice-to-have
    }
  }

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 font-mono text-xs text-mute transition hover:text-pink"
    >
      {copied ? (
        "Copied ✓"
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 6l-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 2v14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}
