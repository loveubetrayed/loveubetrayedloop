import crypto from "crypto";

const SECRET = process.env.ADMIN_SESSION_SECRET || process.env.EMAIL_TOKEN_SECRET || "dev-only-insecure-secret-change-me";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function signAdminToken() {
  const expiresAt = Date.now() + TTL_MS;
  const sig = crypto.createHmac("sha256", SECRET).update(`admin:${expiresAt}`).digest("hex");
  return Buffer.from(`admin:${expiresAt}:${sig}`).toString("base64url");
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [role, expiresAtStr, sig] = decoded.split(":");
    if (role !== "admin") return false;
    const expiresAt = Number(expiresAtStr);
    const expected = crypto.createHmac("sha256", SECRET).update(`admin:${expiresAtStr}`).digest("hex");
    const valid = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    return valid && Date.now() < expiresAt;
  } catch {
    return false;
  }
}
