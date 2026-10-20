import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductDetailsClient } from "./ProductDetailsClient";
import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";

export const revalidate = 60; // Cache route with ISR for sub-50ms SSR responses



const memoryProductCache = new Map<string, { data: any; expiry: number }>();

const getProduct = cache(async (slug: string) => {
  const now = Date.now();
  const cached = memoryProductCache.get(slug);
  if (cached && now < cached.expiry) {
    return cached.data;
  }

  try {
    const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000/api/v1';
    const res = await fetch(`${apiUrl}/products/${slug}`, {
      next: { revalidate: 60, tags: ['products', `product-${slug}`] },
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return cached?.data || null;
    const json = await res.json();
    const data = json?.data || null;
    if (data) {
      memoryProductCache.set(slug, { data, expiry: now + 60 * 1000 });
    }
    return data;
  } catch (error) {
    return cached?.data || null;
  }
});

export const metadata = {
  title: "Product Details | Velora - Haute Lifestyle",
  description: "Curated luxury lifestyle product on Velora.",
};

export async function generateStaticParams() {
  try {
    const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000/api/v1';
    const res = await fetch(`${apiUrl}/products?limit=20`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).map((p: any) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t0 = performance.now();
  const { slug } = await params;
  const product = await getProduct(slug);
  const renderTime = performance.now() - t0;
  console.log(`[PERF ProductPage /product/${slug}] Rendered in ${renderTime.toFixed(2)}ms`);



  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Navbar variant="solid" />
      <ProductDetailsClient initialProduct={product} slug={slug} />
      <Footer />
    </div>
  );
}
