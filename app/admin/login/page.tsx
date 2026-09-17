"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-sm px-6 py-24">
      <h1 className="font-display text-3xl text-ink">Admin</h1>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
        <input
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="rounded-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-pink"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-pink py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Checking…" : "Log in"}
        </button>
        {error && <p className="text-sm text-pink">{error}</p>}
      </form>
    </section>
  );
}
