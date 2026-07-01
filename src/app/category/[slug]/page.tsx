"use client";

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CategoryPage() {
  const { slug } = useParams();
  const { categories, loading: catsLoading } = useCategories();
  const { products: filteredProducts, loading: prodLoading } = useProducts(slug as string);

  const category = categories.find((c) => c.slug === slug);

  if (catsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) return <div className="container mx-auto px-4 py-12">Category not found</div>;

  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-semibold">{category.name}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">{category.name}</h1>
          <p className="text-muted-foreground text-sm">
            {prodLoading ? "Loading..." : `Showing ${filteredProducts.length} results`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-muted-foreground uppercase">Sort by:</span>
          <select className="bg-white border border-border rounded-md px-3 py-1 text-sm focus:ring-1 focus:ring-primary outline-none cursor-pointer">
            <option>Newest Arrivals</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating: High to Low</option>
          </select>
        </div>
      </div>

      {prodLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">No products found in this category yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
