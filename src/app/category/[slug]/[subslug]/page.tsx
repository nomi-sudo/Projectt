"use client";

import { CATEGORIES } from "@/constants/categories";
import { PRODUCTS } from "@/constants/products";
import ProductCard from "@/components/products/ProductCard";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SubcategoryPage() {
  const { slug, subslug } = useParams();
  
  const category = CATEGORIES.find(
    (c) => c.name.toLowerCase().replace(/ /g, '-') === slug
  );

  const subcategory = category?.subcategories.find(
    (s) => s.toLowerCase().replace(/ /g, '-') === subslug
  );

  const filteredProducts = PRODUCTS.filter(
    (p) => 
      p.category.toLowerCase().replace(/ /g, '-') === slug &&
      p.subcategory.toLowerCase().replace(/ /g, '-') === subslug
  );

  if (!category || !subcategory) return <div>Category or Subcategory not found</div>;

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/category/${slug}`} className="hover:text-primary">{category.name}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-semibold">{subcategory}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">{subcategory}</h1>
          <p className="text-muted-foreground text-sm">Showing {filteredProducts.length} results in {category.name}</p>
        </div>
        
        <div className="flex items-center gap-4">
           <span className="text-xs font-bold text-muted-foreground uppercase">Sort by:</span>
           <select className="bg-white border border-border rounded-md px-3 py-1 text-sm focus:ring-1 focus:ring-primary outline-none cursor-pointer">
              <option>Newest Arrivals</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-border">
             <p className="text-muted-foreground">No products found in this subcategory yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
