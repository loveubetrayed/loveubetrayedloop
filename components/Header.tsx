"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { FREE_MODE } from "@/lib/site-config";

const NAV = [
  { href: "/loops", label: "Loops" },
  ...(FREE_MODE ? [] : [{ href: "/free", label: "Free Kit" }]),
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" }
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/loops?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6">
      <div className="mx-auto grid max-w-5xl grid-cols-[auto_1fr_auto] items-center gap-4 rounded-full border border-line bg-white/90 px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-md">
        <Link href="/" className="flex shrink-0 items-center gap-1.5 justify-self-start">
          <span className="text-pink">✦</span>
          <span className="text-lg font-semibold lowercase tracking-tight text-ink">iloveubetrayed</span>
        </Link>

        <nav className="hidden items-center justify-center gap-7 justify-self-center text-sm text-mute md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href.split("?")[0];
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1.5 transition hover:text-ink ${active ? "text-ink" : ""}`}
              >
                {active && <span className="h-1.5 w-1.5 rounded-full bg-pink" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 justify-self-end">
          {searchOpen ? (
            <form onSubmit={submitSearch} className="flex items-center">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => !query && setSearchOpen(false)}
                placeholder="Search kits…"
                className="w-32 rounded-full border border-line bg-cream px-3 py-1.5 text-sm text-ink outline-none focus:border-pink sm:w-44"
              />
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex h-8 w-8 items-center justify-center rounded-full text-mute transition hover:bg-cream hover:text-ink"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
              </svg>
            </button>
          )}

          {!FREE_MODE && (
            <Link
              href="/cart"
              className="relative flex items-center gap-2 rounded-full bg-cream px-3 py-1.5 text-sm text-ink"
            >
              <span aria-hidden="true">Cart</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-xs text-white">
                {count}
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
