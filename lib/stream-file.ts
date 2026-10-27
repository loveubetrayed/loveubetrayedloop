import { NextResponse } from "next/server";

// Proxies the actual bytes through our own domain instead of redirecting to
// wherever the file is really hosted (R2/S3/etc). The visitor's browser only
// ever talks to our domain — the storage URL is never visible to them.
//
// This works well for typical sample-pack sizes. Two Vercel limits to keep in
// mind for very large files: Hobby-plan functions default to a 10s max
// duration (raisable to 60s in Project Settings → Functions), and slow
// connections downloading a huge file could hit that. If you outgrow this,
// point a custom subdomain (e.g. files.yourdomain.com) at your storage
// provider instead — same "feels first-party" effect, no proxy needed.
export async function streamFile(fileUrl: string, filename: string) {
  const upstream = await fetch(fileUrl);

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Couldn't reach the file — check the Download URL in /admin" }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") || "";

  // The #1 real-world cause of "download doesn't work": a Dropbox/Drive share
  // link that returns an HTML preview page instead of the file itself. Catch
  // it here with a message that actually says what's wrong, instead of
  // silently handing someone a broken .zip full of HTML.
  if (contentType.includes("text/html")) {
    return NextResponse.json(
      {
        error:
          "That Download URL points to a webpage, not the file itself. For Dropbox links, change the ending from ?dl=0 to ?dl=1. For Google Drive, use a direct-download link, not a share link. Update the URL in /admin → Products."
      },
      { status: 502 }
    );
  }

  const headers = new Headers();
  headers.set("Content-Type", contentType || "application/zip");
  const length = upstream.headers.get("content-length");
  if (length) headers.set("Content-Length", length);
  headers.set("Content-Disposition", `attachment; filename="${filename}"`);

  return new NextResponse(upstream.body, { headers });
}
