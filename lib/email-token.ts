import crypto from "crypto";

const SECRET = process.env.EMAIL_TOKEN_SECRET || "dev-only-insecure-secret-change-me";

if (!process.env.EMAIL_TOKEN_SECRET && process.env.NODE_ENV !== "development") {
  console.warn("EMAIL_TOKEN_SECRET is not set — confirmation links are using an insecure default.");
}

const TTL_MS = 24 * 60 * 60 * 1000; // confirmation links expire after 24h

export function signEmailToken(email: string, slug: string) {
  const payload = `${email}:${slug}:${Date.now() + TTL_MS}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifyEmailToken(token: string): { email: string; slug: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [email, slug, expiresAtStr, sig] = decoded.split(":");
    const expiresAt = Number(expiresAtStr);
    if (!email || !slug || !expiresAt || !sig) return null;

    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(`${email}:${slug}:${expiresAtStr}`)
      .digest("hex");

    const valid = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    if (!valid) return null;
    if (Date.now() > expiresAt) return null;

    return { email, slug };
  } catch {
    return null;
  }
}
