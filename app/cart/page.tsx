"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, remove, setQty, subtotal, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: items.map((i) => ({ slug: i.slug, qty: i.qty })) })
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Couldn't start checkout");
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-display text-3xl text-ink">Your cart is empty</h1>
        <p className="mt-3 text-sm text-mute">Browse the catalog and pick a few kits for your track.</p>
        <Link
          href="/loops"
          className="mt-8 inline-block rounded-full bg-pink px-6 py-3 text-sm font-medium text-white"
        >
          Browse kits →
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl text-ink">Cart</h1>

      <div className="mt-8 divide-y divide-line border-y border-line">
        {items.map(({ product, qty }) => (
          <div key={product.slug} className="flex items-center gap-4 py-5">
            {product.image ? (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm">
                <Image src={product.image} alt={product.title} fill className="object-cover" />
              </div>
            ) : (
              <div
                className="h-16 w-16 shrink-0 rounded-sm"
                style={{
                  background: `linear-gradient(140deg, ${product.cover.from}, ${product.cover.to})`
                }}
              />
            )}
            <div className="flex-1">
              <Link href={`/product/${product.slug}`} className="font-display text-lg text-ink hover:text-pink">
                {product.title}
              </Link>
              <p className="text-xs text-mute">
                {product.bpm} BPM / {product.key}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty(product.slug, qty - 1)}
                className="h-7 w-7 rounded-full border border-line text-mute hover:text-ink"
                aria-label="Decrease quantity"
              >
                –
              </button>
              <span className="w-5 text-center text-sm text-ink">{qty}</span>
              <button
                onClick={() => setQty(product.slug, qty + 1)}
                className="h-7 w-7 rounded-full border border-line text-mute hover:text-ink"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <span className="w-16 text-right text-sm text-ink">${(product.price * qty).toFixed(2)}</span>

            <button
              onClick={() => remove(product.slug)}
              className="ml-2 text-xs text-mute hover:text-pink"
              aria-label={`Remove ${product.title}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={clear} className="text-sm text-mute hover:text-pink">
          Clear cart
        </button>
        <div className="text-right">
          <p className="text-sm text-mute">Subtotal</p>
          <p className="font-display text-2xl text-ink">${subtotal.toFixed(2)}</p>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-pink">{error}</p>}

      <button
        onClick={checkout}
        disabled={loading}
        className="mt-8 w-full rounded-full bg-pink py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Redirecting to checkout…" : "Checkout →"}
      </button>
    </section>
  );
}
