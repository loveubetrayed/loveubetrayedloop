"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/seed-data";

export default function AddToCartPanel({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-8 flex items-center gap-4">
      <span className="font-display text-3xl text-ink">
        {product.originalPrice && (
          <span className="mr-2 text-lg text-mute line-through">${product.originalPrice.toFixed(2)}</span>
        )}
        ${product.price.toFixed(2)}
      </span>
      {added ? (
        <Link
          href="/cart"
          className="rounded-full bg-pink px-6 py-3 text-sm font-medium text-white"
        >
          In cart — go to cart →
        </Link>
      ) : (
        <button
          onClick={() => {
            add(product.slug);
            setAdded(true);
          }}
          className="rounded-full border border-line px-6 py-3 text-sm text-ink transition hover:border-pink hover:text-pink"
        >
          Add to cart
        </button>
      )}
    </div>
  );
}
