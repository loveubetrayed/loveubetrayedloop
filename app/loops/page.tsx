import { getProducts } from "@/lib/store";
import { getDownloadCounts } from "@/lib/leads";
import LoopsClient from "@/components/LoopsClient";

export const dynamic = "force-dynamic";

export default async function LoopsPage() {
  const [products, counts] = await Promise.all([getProducts(), getDownloadCounts()]);
  return <LoopsClient products={products} counts={counts} />;
}
