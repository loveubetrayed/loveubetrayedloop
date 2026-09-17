"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";

type Item = { slug: string; title: string };

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const { clear } = useCart();

  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Order not found");
      return;
    }
    fetch(`/api/session?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setItems(data.items);
        clear();
      })
      .catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <section className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="font-display text-3xl text-ink">Thank you 🤍</h1>

      {error && (
        <>
          <p className="mt-4 text-sm text-pink">{error}</p>
          <Link href="/loops" className="mt-8 inline-block underline-grow text-sm text-mute hover:text-ink">
            Back to catalog
          </Link>
        </>
      )}

      {!error && !items && <p className="mt-4 text-sm text-mute">Confirming your payment…</p>}

      {items && items.length > 0 && (
        <div className="mt-8 space-y-3 text-left">
          <p className="text-center text-sm text-mute">Your files are ready:</p>
          {items.map((item) => (
            <a
              key={item.slug}
              href={`/api/download?session_id=${sessionId}&slug=${item.slug}`}
              className="flex items-center justify-between rounded-sm border border-line px-5 py-4 text-sm text-ink transition hover:border-pink"
            >
              <span>{item.title}</span>
              <span className="text-mute">Download ↓</span>
            </a>
          ))}
          <p className="pt-3 text-center text-xs text-mute">
            We'll also email these links if you entered an address at checkout.
          </p>
        </div>
      )}
    </section>
  );
}
