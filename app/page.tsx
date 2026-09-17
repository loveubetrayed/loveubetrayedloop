import Link from "next/link";
import { getProducts } from "@/lib/store";
import { getDownloadCounts } from "@/lib/leads";
import ProductCard from "@/components/ProductCard";
import HeroSection from "@/components/HeroSection";
import Squiggle from "@/components/Squiggle";
import { FREE_MODE } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, counts] = await Promise.all([getProducts(), getDownloadCounts()]);

  // A logical, not arbitrary, order: newest first, then most-downloaded —
  // rather than an eye-catching but meaningless "first card is bigger" layout.
  const featured = [...products]
    .sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew) || (counts[b.slug] || 0) - (counts[a.slug] || 0))
    .slice(0, 6);

  return (
    <>
      <HeroSection />

      <section id="about" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl text-ink">New kits</h2>
            <Squiggle className="h-4 w-12 text-pink" />
          </div>
          <Link href="/loops" className="underline-grow text-sm text-mute hover:text-ink">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} downloadCount={counts[p.slug] || 0} />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-mute">
          {FREE_MODE ? (
            <>Every kit is <span className="text-pink">free</span> right now — just pop in your email.</>
          ) : (
            <>
              Grab <span className="text-ink">3 or more kits</span> and a{" "}
              <span className="text-pink">10% bundle discount</span> applies automatically at checkout.
            </>
          )}
        </p>
      </section>
    </>
  );
}
