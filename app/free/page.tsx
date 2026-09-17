import { getFreeProduct } from "@/lib/store";
import FreeKitClient from "@/components/FreeKitClient";

export const dynamic = "force-dynamic";

export default async function FreeKitPage() {
  const freeProduct = await getFreeProduct();
  return <FreeKitClient freeProduct={freeProduct} />;
}
