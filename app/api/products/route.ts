import { NextResponse } from "next/server";
import { getProducts, getFreeProduct } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const [products, freeProduct] = await Promise.all([getProducts(), getFreeProduct()]);
  return NextResponse.json({ products: [...products, freeProduct] });
}
