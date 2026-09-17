"use client";

import { useEffect, useState } from "react";

const KEY = "iloveubetrayed_favorites_v1";

function readAll(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useFavorite(slug: string) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readAll().includes(slug));
  }, [slug]);

  function toggle() {
    const all = readAll();
    const next = all.includes(slug) ? all.filter((s) => s !== slug) : [...all, slug];
    window.localStorage.setItem(KEY, JSON.stringify(next));
    setActive(next.includes(slug));
  }

  return { active, toggle };
}
