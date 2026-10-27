// The whole site is pink-only. Whatever cover colors a product was saved with
// (older products may carry lavender/blue defaults), we derive a pink palette
// from its slug so every kit still gets its own shade — but always pink.
const PALETTE = [
  { from: "#FFD6E7", to: "#FFF1F6", accent: "#FF4F9A" },
  { from: "#FFC4DC", to: "#FFE8F1", accent: "#E8317F" },
  { from: "#FFE1EC", to: "#FFBFD8", accent: "#FF7AB0" },
  { from: "#FFCDE2", to: "#FFF4F8", accent: "#FF2E88" },
  { from: "#FFDDEA", to: "#FFB8D3", accent: "#D6246E" },
  { from: "#FFE9F1", to: "#FFCADF", accent: "#FF6FA8" }
];

export function pinkCover(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}
