"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import Squiggle from "@/components/Squiggle";
import type { Product } from "@/lib/seed-data";
import { FREE_MODE } from "@/lib/site-config";

const FILTERS = ["All", "Melodic", "Vocal", "Guitar", "Piano", "Bass", "Atmosphere", "Loop", "Synth", "Ambient", "Drums"];

export default function LoopsClient({ products, counts }: { products: Product[]; counts: Record<string, number> }) {
  return (
    <Suspense fallback={null}>
      <LoopsContent products={products} counts={counts} />
    </Suspense>
  );
}

function LoopsContent({ products, counts }: { products: Product[]; counts: Record<string, number> }) {
  const params = useSearchParams();
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState(FREE_MODE ? "latest" : "latest");
  const [query, setQuery] = useState("");
  const [bpmMin, setBpmMin] = useState("");
  const [bpmMax, setBpmMax] = useState("");
  const [key, setKey] = useState("All");

  const keys = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.key))).sort()], [products]);

  const SORTS = FREE_MODE
    ? ([
        { id: "latest", label: "Latest" },
        { id: "popular", label: "Most downloaded" }
      ] as const)
    : ([
        { id: "latest", label: "Latest" },
        { id: "price-asc", label: "Price: low to high" },
        { id: "price-desc", label: "Price: high to low" }
      ] as const);

  useEffect(() => {
    const q = params.get("q");
    if (q) setQuery(q);
  }, [params]);

  const visible = useMemo(() => {
    let list = filter === "All" ? products : products.filter((p) => p.tags.includes(filter));

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (bpmMin) list = list.filter((p) => p.bpm >= Number(bpmMin));
    if (bpmMax) list = list.filter((p) => p.bpm <= Number(bpmMax));
    if (key !== "All") list = list.filter((p) => p.key === key);

    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "popular") list.sort((a, b) => (counts[b.slug] || 0) - (counts[a.slug] || 0));
    if (sort === "latest") list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return list;
  }, [filter, sort, query, bpmMin, bpmMax, key, products, counts]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-sm text-mute">Catalog</p>
      <div className="mt-2 flex items-center gap-3">
        <h1 className="font-display text-4xl text-ink">All loop kits</h1>
        <Squiggle className="h-4 w-14 text-pink" />
      </div>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-mute">
        {products.length} kits available. Every pack is WAV + MIDI, royalty-free
        {FREE_MODE ? ", delivered straight to your inbox." : ", delivered instantly after checkout."}
      </p>

      <div className="mt-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or tag…"
          className="w-full max-w-sm rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-pink"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} data-active={filter === f} className="filter-pill">
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs text-mute">BPM</span>
        <input
          type="number"
          value={bpmMin}
          onChange={(e) => setBpmMin(e.target.value)}
          placeholder="min"
          className="w-20 rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-pink"
        />
        <span className="text-mute">–</span>
        <input
          type="number"
          value={bpmMax}
          onChange={(e) => setBpmMax(e.target.value)}
          placeholder="max"
          className="w-20 rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-pink"
        />

        <span className="ml-2 font-mono text-xs text-mute">Key</span>
        <select
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink"
        >
          {keys.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="ml-auto rounded-full border border-line bg-white px-4 py-2 text-sm text-ink"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="mt-16 text-center text-sm text-mute">No kits match those filters yet.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <Reveal key={p.slug} index={i}>
              <ProductCard product={p} downloadCount={counts[p.slug] || 0} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
