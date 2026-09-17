import type { Metadata } from "next";
import { Jost, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Jost (thin/extralight weights) is the closest free match to the reference
// look — a very thin, wide, geometric sans. If you later license Atyp Kido
// or another commercial font, see the swap instructions in globals.css.
const display = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-display"
});

// Instrument Sans for body/UI text — Plus Jakarta Sans/Inter/Manrope are the
// fonts nearly every AI website-builder defaults to, so they read as
// generic. This has more character while staying clean and legible.
const body = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body"
});

// A monospace for small technical labels (trust row, tags, eyebrow text) —
// gives those bits a crafted, "designed" feel instead of reading as more
// generic body copy.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "iloveubetrayed — loop kits & sample packs",
  description: "Royalty-free loop kits, melodies, drums and one-shots. Instant download."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body bg-cream text-ink antialiased">
        <div className="grain" aria-hidden="true" />
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
