import { kv, kvConfigured } from "./kv";
import { seedProducts, seedFreeProduct, type Product } from "./seed-data";
import { seedDownloadSources } from "./seed-downloads";

const PRODUCTS_KEY = "products";
const FREE_PRODUCT_KEY = "free-product";
const DOWNLOADS_KEY = "download-sources";

export type { Product };

export async function getProducts(): Promise<Product[]> {
  const stored = await kv.get<Product[]>(PRODUCTS_KEY);
  return stored && stored.length > 0 ? stored : seedProducts;
}

export async function getFreeProduct(): Promise<Product> {
  const stored = await kv.get<Product>(FREE_PRODUCT_KEY);
  return stored || seedFreeProduct;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const free = await getFreeProduct();
  if (slug === free.slug) return free;
  const all = await getProducts();
  return all.find((p) => p.slug === slug);
}

export async function saveProducts(products: Product[]): Promise<boolean> {
  return kv.set(PRODUCTS_KEY, products);
}

export async function saveFreeProduct(product: Product): Promise<boolean> {
  return kv.set(FREE_PRODUCT_KEY, product);
}

export async function getDownloadSources(): Promise<Record<string, string>> {
  const stored = await kv.get<Record<string, string>>(DOWNLOADS_KEY);
  return { ...seedDownloadSources, ...(stored || {}) };
}

export async function getDownloadUrl(slug: string): Promise<string | undefined> {
  const all = await getDownloadSources();
  return all[slug];
}

export async function saveDownloadUrl(slug: string, url: string): Promise<boolean> {
  const all = await getDownloadSources();
  all[slug] = url;
  return kv.set(DOWNLOADS_KEY, all);
}

export { kvConfigured };
