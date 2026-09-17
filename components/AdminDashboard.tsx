"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AnyProduct = Record<string, any>;

const EMPTY_PRODUCT: AnyProduct = {
  slug: "",
  title: "",
  kind: "LOOP KIT",
  contains: "",
  tags: "",
  bpm: 120,
  key: "",
  price: 0,
  originalPrice: "",
  image: "",
  previewUrl: "",
  downloadUrl: "",
  description: "",
  isNew: false
};

function toFormValues(p: AnyProduct): AnyProduct {
  return {
    ...p,
    tags: Array.isArray(p.tags) ? p.tags.join(", ") : p.tags || "",
    contains: Array.isArray(p.contains) ? p.contains.join(", ") : p.contains || ""
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"products" | "free" | "leads">("products");
  const [kvConfigured, setKvConfigured] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => setKvConfigured(d.kvConfigured !== false));
  }, []);

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      {!kvConfigured && (
        <div className="mb-6 rounded-2xl border border-pink bg-[#FFF0F6] p-4 text-sm text-ink">
          <strong>Redis isn't connected.</strong> Anything you save here will look fine right now
          but disappear on the next reload — it's not actually being stored. See "Подключить
          хранилище" in the README, it's a couple of clicks in the Vercel dashboard.
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Admin</h1>
        <button
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            router.push("/admin/login");
          }}
          className="text-sm text-mute hover:text-pink"
        >
          Log out
        </button>
      </div>

      <div className="mt-6 flex gap-2">
        {(["products", "free", "leads"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} data-active={tab === t} className="filter-pill capitalize">
            {t === "free" ? "Free kit" : t}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "products" && <ProductsTab />}
        {tab === "free" && <FreeKitTab />}
        {tab === "leads" && <LeadsTab />}
      </div>
    </section>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<AnyProduct[] | null>(null);
  const [editing, setEditing] = useState<string | null>(null); // slug being edited, or "new"
  const [draft, setDraft] = useState<AnyProduct>(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []));
  }

  useEffect(load, []);

  function startEdit(p: AnyProduct) {
    setEditing(p.slug);
    setDraft(toFormValues(p));
    setError(null);
  }

  function startNew() {
    setEditing("new");
    setDraft(EMPTY_PRODUCT);
    setError(null);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const method = editing === "new" ? "POST" : "PUT";
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      if (data.warning) setError(data.warning);
      else setEditing(null);
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(slug: string) {
    if (!confirm(`Delete "${slug}"? This can't be undone.`)) return;
    await fetch(`/api/admin/products?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    load();
  }

  if (!products) return <p className="text-sm text-mute">Loading…</p>;

  return (
    <div>
      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <div key={p.slug} className="rounded-2xl border border-line bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-lg text-ink">{p.title}</p>
                <p className="text-xs text-mute">
                  {p.slug} · ${p.price}
                  {p.originalPrice ? ` (was $${p.originalPrice})` : ""}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => startEdit(p)} className="text-mute hover:text-ink">
                  Edit
                </button>
                <button onClick={() => remove(p.slug)} className="text-mute hover:text-pink">
                  Delete
                </button>
              </div>
            </div>

            {editing === p.slug && (
              <ProductForm draft={draft} setDraft={setDraft} isNew={false} />
            )}
          </div>
        ))}
      </div>

      {editing === "new" ? (
        <div className="mt-4 rounded-2xl border border-line bg-white p-4">
          <p className="font-display text-lg text-ink">New product</p>
          <ProductForm draft={draft} setDraft={setDraft} isNew />
        </div>
      ) : (
        <button
          onClick={startNew}
          className="mt-4 w-full rounded-full border border-dashed border-line py-3 text-sm text-mute hover:border-pink hover:text-pink"
        >
          + Add product
        </button>
      )}

      {editing && (
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-pink px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button onClick={() => setEditing(null)} className="text-sm text-mute hover:text-ink">
            Cancel
          </button>
          {error && <p className="text-sm text-pink">{error}</p>}
        </div>
      )}
    </div>
  );
}

function ProductForm({
  draft,
  setDraft,
  isNew
}: {
  draft: AnyProduct;
  setDraft: (d: AnyProduct) => void;
  isNew: boolean;
}) {
  function set(key: string, value: any) {
    setDraft({ ...draft, [key]: value });
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Field label="Slug (URL-safe, unique, no spaces)">
        <input
          value={draft.slug}
          disabled={!isNew}
          onChange={(e) => set("slug", e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
          className="admin-input disabled:opacity-60"
        />
      </Field>
      <Field label="Title">
        <input value={draft.title} onChange={(e) => set("title", e.target.value)} className="admin-input" />
      </Field>
      <Field label="Price ($)">
        <input
          type="number"
          value={draft.price}
          onChange={(e) => set("price", e.target.value)}
          className="admin-input"
        />
      </Field>
      <Field label="Original price (optional — shows a sale badge)">
        <input
          type="number"
          value={draft.originalPrice}
          onChange={(e) => set("originalPrice", e.target.value)}
          className="admin-input"
        />
      </Field>
      <Field label="BPM">
        <input type="number" value={draft.bpm} onChange={(e) => set("bpm", e.target.value)} className="admin-input" />
      </Field>
      <Field label="Key (e.g. C# Min)">
        <input value={draft.key} onChange={(e) => set("key", e.target.value)} className="admin-input" />
      </Field>
      <Field label="Kind">
        <select value={draft.kind} onChange={(e) => set("kind", e.target.value)} className="admin-input">
          <option>LOOP KIT</option>
          <option>DRUM KIT</option>
          <option>MIDI PACK</option>
        </select>
      </Field>
      <Field label="Tags (comma-separated)">
        <input value={draft.tags} onChange={(e) => set("tags", e.target.value)} className="admin-input" />
      </Field>
      <Field label="Contains (comma-separated)">
        <input value={draft.contains} onChange={(e) => set("contains", e.target.value)} className="admin-input" />
      </Field>
      <Field label="Cover image path (public/covers/…)">
        <input value={draft.image} onChange={(e) => set("image", e.target.value)} className="admin-input" placeholder="/covers/my-kit.jpg" />
      </Field>
      <Field label="Preview mp3 path (public/previews/…)">
        <input
          value={draft.previewUrl}
          onChange={(e) => set("previewUrl", e.target.value)}
          className="admin-input"
          placeholder="/previews/my-kit.mp3"
        />
      </Field>
      <Field label="Download URL (private link to the real ZIP)">
        <input value={draft.downloadUrl} onChange={(e) => set("downloadUrl", e.target.value)} className="admin-input" />
      </Field>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={!!draft.isNew} onChange={(e) => set("isNew", e.target.checked)} />
        Mark as "NEW"
      </label>
      <div className="sm:col-span-2">
        <Field label="Description">
          <textarea
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className="admin-input"
          />
        </Field>
      </div>
    </div>
  );
}

function FreeKitTab() {
  const [data, setData] = useState<AnyProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/free")
      .then((r) => r.json())
      .then((d) => setData(toFormValues({ ...d.freeProduct, downloadUrl: d.downloadUrl })));
  }, []);

  async function save() {
    if (!data) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/free", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Save failed");
      if (result.warning) setError(result.warning);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <p className="text-sm text-mute">Loading…</p>;

  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <ProductForm draft={data} setDraft={setData} isNew={false} />
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-pink px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {error && <p className="text-sm text-pink">{error}</p>}
      </div>
    </div>
  );
}

function LeadsTab() {
  const [leads, setLeads] = useState<{ email: string; source: string; date: string }[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads || []));
  }, []);

  function downloadCsv() {
    if (!leads) return;
    const rows = [["email", "source", "date"], ...leads.map((l) => [l.email, l.source, l.date])];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!leads) return <p className="text-sm text-mute">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-mute">{leads.length} collected</p>
        <button onClick={downloadCsv} className="text-sm text-pink hover:opacity-80">
          Download CSV
        </button>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
        {leads.length === 0 && <p className="p-4 text-sm text-mute">No leads yet.</p>}
        {leads.map((l, i) => (
          <div
            key={i}
            className={`grid grid-cols-3 gap-3 px-4 py-3 text-sm ${i !== 0 ? "border-t border-line" : ""}`}
          >
            <span className="text-ink">{l.email}</span>
            <span className="text-mute">{l.source}</span>
            <span className="text-mute">{new Date(l.date).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-mute">
      {label}
      {children}
    </label>
  );
}
