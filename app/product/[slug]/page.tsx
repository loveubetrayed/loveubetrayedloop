import { notFound } from "next/navigation";
import Image from "next/image";
import { getProduct, getProducts } from "@/lib/store";
import { getDownloadCounts } from "@/lib/leads";
import AddToCartPanel from "@/components/AddToCartPanel";
import ProductCard from "@/components/ProductCard";
import Squiggle from "@/components/Squiggle";
import AudioPlayer from "@/components/AudioPlayer";
import EmailGateForm from "@/components/EmailGateForm";
import { FREE_MODE } from "@/lib/site-config";

// Products can be edited anytime via /admin (stored in KV), so these pages
// are rendered fresh on every request rather than frozen at build time.
export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) return notFound();

  const allProducts = await getProducts();
  const counts = await getDownloadCounts();
  const related = allProducts
    .filter((p) => p.slug !== product.slug && p.tags.some((t) => product.tags.includes(t)))
    .slice(0, 3);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {product.image ? (
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line">
            <Image src={product.image} alt={product.title} fill sizes="50vw" className="object-cover" />
          </div>
        ) : (
          <div
            className="aspect-[16/9] rounded-2xl border border-line"
            style={{
              background: `radial-gradient(120% 140% at 20% 10%, ${product.cover.accent}33, transparent 55%), linear-gradient(140deg, ${product.cover.from}, ${product.cover.to})`
            }}
          />
        )}

        <div className="flex flex-col">
          <span className="text-xs tracking-wide text-mute">{product.kind}</span>
          <h1 className="mt-2 font-display text-4xl text-ink">{product.title}</h1>
          <p className="mt-2 text-sm text-mute">{product.contains.join(" / ")}</p>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-mute">{product.description}</p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {product.tags.map((t) => (
              <span key={t} className="tag-chip">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-6 text-sm text-mute">
            <span>{product.bpm} BPM</span>
            <span className="h-1 w-1 rounded-full bg-line" />
            <span>{product.key}</span>
            {counts[product.slug] >= 3 && (
              <>
                <span className="h-1 w-1 rounded-full bg-line" />
                <span className="font-mono text-xs">🎧 {counts[product.slug].toLocaleString()} got this</span>
              </>
            )}
          </div>

          {FREE_MODE ? (
            <>
              <span className="mt-6 w-fit rounded-full bg-pink px-2.5 py-1 text-[0.65rem] font-medium tracking-wide text-white">
                FREE
              </span>
              <EmailGateForm slug={product.slug} title={product.title} />
            </>
          ) : (
            <AddToCartPanel product={product} />
          )}
        </div>
      </div>

      <div className="mt-10">
        <AudioPlayer previewUrl={product.previewUrl} title={product.title} />
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="flex items-center gap-3 font-display text-2xl text-ink">
            You might also like
            <Squiggle className="h-4 w-12 text-pink" />
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} downloadCount={counts[p.slug] || 0} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
