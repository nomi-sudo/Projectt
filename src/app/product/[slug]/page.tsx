import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/api";
import ProductDetail from "@/components/products/ProductDetail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product ? `${product.name} | AL-FATAH MART` : "Product | AL-FATAH MART",
    description: product ? `Buy ${product.name} at AL-FATAH MART for Rs. ${product.price.toLocaleString()}` : "Shop premium products at AL-FATAH MART",
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
          <p className="text-muted-foreground">The product you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
