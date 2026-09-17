export type Product = {
  slug: string;
  title: string;
  kind: "LOOP KIT" | "DRUM KIT" | "MIDI PACK";
  contains: string[];
  tags: string[];
  bpm: number;
  key: string;
  price: number; // USD — 0 means it's a free/lead-magnet pack
  originalPrice?: number; // set this to show a strikethrough "was $X" price + SALE badge
  cover: { from: string; to: string; accent: string }; // gradient fallback while you don't have a photo yet
  image?: string; // e.g. "/covers/halo-bloom.jpg" — put the file in public/covers/
  previewUrl?: string; // e.g. "/previews/halo-bloom.mp3" — put the file in public/previews/
  description: string;
  isNew?: boolean;
};

export const products: Product[] = [
  {
    slug: "halo-bloom",
    title: "Halo Bloom",
    kind: "LOOP KIT",
    contains: ["Melodic Loops", "Drums", "One Shots", "FX"],
    tags: ["Melodic", "Ambient", "Piano", "Vocal"],
    bpm: 142,
    key: "C# Min",
    price: 25,
    isNew: true,
    cover: { from: "#FFE1EE", to: "#FFF7F0", accent: "#FF6FA5" },
    description:
      "Airy piano phrases and glassy vocal chops built for slow, spacious sections — the kind of pack you reach for when a track needs room to breathe."
  },
  {
    slug: "glass-reverie",
    title: "Glass Reverie",
    kind: "LOOP KIT",
    contains: ["Loops", "Melodies", "Drums", "One Shots"],
    tags: ["Loop", "Guitar", "Atmosphere", "Vocal"],
    bpm: 98,
    key: "D Min",
    price: 24,
    isNew: true,
    cover: { from: "#F3E6FF", to: "#FFF1F6", accent: "#C88FFF" },
    description:
      "Wet, detuned guitar figures over soft pads and half-time drums. Leans lo-fi and intimate — good for R&B and alt-pop sketches."
  },
  {
    slug: "quiet-solstice",
    title: "Quiet Solstice",
    kind: "LOOP KIT",
    contains: ["Loops", "Melodies", "Drums", "One Shots"],
    tags: ["Loop", "Guitar", "Piano", "Ambient"],
    bpm: 120,
    key: "F# Min",
    price: 26,
    cover: { from: "#E4ECFF", to: "#FBEFFF", accent: "#8FA8FF" },
    description:
      "A darker, cinematic set — layered guitar and piano motifs with wide low-end drums built for tension and slow build-ups."
  },
  {
    slug: "orchid-drift",
    title: "Orchid Drift",
    kind: "LOOP KIT",
    contains: ["Melodic Loops", "Drums", "One Shots", "FX"],
    tags: ["Melodic", "Vocal", "Piano", "Ambient"],
    bpm: 105,
    key: "A Min",
    price: 22,
    cover: { from: "#FFE8F1", to: "#FFF7EC", accent: "#FF9BC5" },
    description:
      "Delicate, floral textures — soft piano runs and airy vocal ad-libs meant to sit high in a mix without crowding it."
  },
  {
    slug: "nowhere-roads",
    title: "Nowhere Roads",
    kind: "LOOP KIT",
    contains: ["Loops", "Melodies", "Drums", "One Shots"],
    tags: ["Loop", "Bass", "Synth", "Ambient"],
    bpm: 140,
    key: "G Min",
    price: 24,
    originalPrice: 32,
    isNew: true,
    cover: { from: "#EFE4FF", to: "#F3F8FF", accent: "#B79BFF" },
    description:
      "Driving synth bass and analog-style leads for late-night, motion-forward records. Built with headroom for hard mixing."
  },
  {
    slug: "frost-bloom",
    title: "Frost Bloom",
    kind: "LOOP KIT",
    contains: ["Loops", "Melodies", "Drums", "One Shots"],
    tags: ["Melodic", "Vocal", "Guitar", "Atmosphere"],
    bpm: 110,
    key: "D# Min",
    price: 23,
    cover: { from: "#EAF2FF", to: "#FFF0F6", accent: "#9FC4FF" },
    description:
      "Crystalline guitar harmonics and breathy vocal textures over brushed drums — a cold, wintry counterpart to Halo Bloom."
  }
];

// The free lead-magnet pack, offered on /free in exchange for an email address.
// Kept out of the main catalog array above on purpose — it's featured separately.
export const freeProduct: Product = {
  slug: "free-starter-kit",
  title: "Starter Kit",
  kind: "LOOP KIT",
  contains: ["Loops", "Drums", "One Shots"],
  tags: ["Melodic", "Ambient", "Free"],
  bpm: 128,
  key: "A Min",
  price: 0,
  cover: { from: "#FFE1EE", to: "#EAF2FF", accent: "#FF6FA5" },
  description:
    "A small taste of what's inside every pack — a handful of loops and one-shots, free, no strings attached besides an email."
};

export function getProduct(slug: string) {
  if (slug === freeProduct.slug) return freeProduct;
  return products.find((p) => p.slug === slug);
}
