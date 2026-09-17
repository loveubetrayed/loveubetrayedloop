import { Redis } from "@upstash/redis";

// Vercel KV was discontinued — this now talks to Upstash Redis, which you
// connect via Vercel's Marketplace (Storage tab → add a Redis integration →
// Connect to project). That auto-adds UPSTASH_REDIS_REST_URL and
// UPSTASH_REDIS_REST_TOKEN to your project's env vars — nothing else to wire up.

export const kvConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

const client = kvConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!
    })
  : null;

// A tiny wrapper so every call site doesn't need its own try/catch — if Redis
// isn't configured yet (or a request fails), callers just get `null`/`false`
// back and the app falls back to seed data / logs instead of crashing.
export const kv = {
  async get<T>(key: string): Promise<T | null> {
    if (!client) return null;
    try {
      return await client.get<T>(key);
    } catch (err) {
      console.error(`Redis get(${key}) failed:`, err);
      return null;
    }
  },
  async set(key: string, value: unknown): Promise<boolean> {
    if (!client) return false;
    try {
      await client.set(key, value);
      return true;
    } catch (err) {
      console.error(`Redis set(${key}) failed:`, err);
      return false;
    }
  },
  async lpush(key: string, value: unknown): Promise<boolean> {
    if (!client) return false;
    try {
      await client.lpush(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Redis lpush(${key}) failed:`, err);
      return false;
    }
  },
  async lrange<T>(key: string, start: number, stop: number): Promise<T[]> {
    if (!client) return [];
    try {
      const raw = await client.lrange<string>(key, start, stop);
      return raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r)) as T[];
    } catch (err) {
      console.error(`Redis lrange(${key}) failed:`, err);
      return [];
    }
  }
};
