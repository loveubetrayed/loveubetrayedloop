import { notFound } from "next/navigation";
import Image from "next/image";
import { getProduct, getProducts } from "@/lib/store";
import { getDownloadCounts } from "@/lib/leads";
import AddToCartPanel from "@/components/AddToCartPanel";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import Squiggle from "@/components/Squiggle";
import AudioPlayer from "@/components/AudioPlayer";
import EmailGateForm from "@/components/EmailGateForm";
import ShareButton from "@/components/ShareButton";
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
      <Reveal>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="relative">
            {/* Soft ambient glow in the kit's own accent color — ties the
                per-kit color identity back in without a flat literal stripe. */}
            <div
              className="absolute -inset-6 -z-10 rounded-[40px] opacity-50 blur-2xl"
              style={{ background: product.cover.accent }}
            />
            {product.image ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line">
                <Image src={product.image} alt={product.title} fill sizes="50vw" className="object-cover" />
              </div>
            ) : (
              <div
                className="aspect-[4/5] rounded-[28px] border border-line"
                style={{
                  background: `radial-gradient(120% 140% at 20% 10%, ${product.cover.accent}44, transparent 55%), linear-gradient(155deg, ${product.cover.from}, ${product.cover.to})`
                }}
              />
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-wide text-mute">{product.kind}</span>
              <ShareButton />
            </div>
            <h1 className="mt-2 font-display text-4xl text-ink">{product.title}</h1>
            <p className="mt-2 text-sm text-mute">{product.contains.join(" / ")}</p>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-mute">{product.description}</p>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {product.tags.map((t) => (
                <span key={t} className="tag-chip">
                  {t}
                </span>
              ))}
              <span className="tag-chip">♪ {product.key}</span>
            </div>

            {counts[product.slug] >= 3 && (
              <p className="mt-4 font-mono text-xs text-mute">
                🎧 {counts[product.slug].toLocaleString()} producers got this kit
              </p>
            )}

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
      </Reveal>

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
            {related.map((p, i) => (
              <Reveal key={p.slug} index={i}>
                <ProductCard product={p} downloadCount={counts[p.slug] || 0} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
