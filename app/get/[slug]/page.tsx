import Image from "next/image";
import Link from "next/link";
import { verifyEmailToken } from "@/lib/email-token";
import { getProduct } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function GetPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: { token?: string };
}) {
  const token = searchParams.token;
  const result = token ? verifyEmailToken(token) : null;
  const product = await getProduct(params.slug);

  const valid = result && result.slug === params.slug && product;

  return (
    <section className="mx-auto max-w-md px-6 py-20 text-center">
      <Link href="/" className="flex items-center justify-center gap-1.5">
        <span className="text-pink">✦</span>
        <span className="text-lg font-semibold lowercase tracking-tight text-ink">iloveubetrayed</span>
      </Link>

      {!valid ? (
        <>
          <p className="mt-10 text-sm text-pink">
            This link is invalid or has expired.
          </p>
          <Link href="/free" className="mt-6 inline-block underline-grow text-sm text-mute hover:text-ink">
            Get a new link
          </Link>
        </>
      ) : (
        <>
          <div className="relative mx-auto mt-10 h-40 w-40 overflow-hidden rounded-3xl border border-line">
            {product.image ? (
              <Image src={product.image} alt={product.title} fill className="object-cover" />
            ) : (
              <div
                className="h-full w-full"
                style={{
                  background: `linear-gradient(155deg, ${product.cover.from}, ${product.cover.to})`
                }}
              />
            )}
          </div>

          <h1 className="mt-6 font-display text-2xl text-ink">{product.title}</h1>
          <p className="mt-1 text-sm text-mute">{product.contains.join(" / ")}</p>

          <a
            href={`/api/get-file?token=${token}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-pink px-8 py-3.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Download Now ↓
          </a>

          <p className="mt-4 font-mono text-xs text-mute">Instant download · WAV / MIDI · royalty-free</p>
        </>
      )}
    </section>
  );
}
