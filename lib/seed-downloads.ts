// SERVER-ONLY. Only import this file from Route Handlers (app/api/**/route.ts),
// never from a page or client component — that would leak the URLs to the browser.
//
// Fill each value with a real, private link to the zipped pack: a signed/expiring
// URL from S3, Cloudflare R2, Backblaze B2, etc. Do NOT point these at public URLs
// or the /public folder — anyone could guess the path and download for free.
//
// If you'd rather host the actual bytes yourself, see the note at the bottom of
// app/api/download/route.ts for a filesystem-based alternative.

export const seedDownloadSources: Record<string, string> = {
  "halo-bloom": "https://your-storage.example.com/files/halo-bloom.zip",
  "glass-reverie": "https://your-storage.example.com/files/glass-reverie.zip",
  "quiet-solstice": "https://your-storage.example.com/files/quiet-solstice.zip",
  "orchid-drift": "https://your-storage.example.com/files/orchid-drift.zip",
  "nowhere-roads": "https://your-storage.example.com/files/nowhere-roads.zip",
  "frost-bloom": "https://your-storage.example.com/files/frost-bloom.zip",
  "free-starter-kit": "https://your-storage.example.com/files/free-starter-kit.zip"
};
