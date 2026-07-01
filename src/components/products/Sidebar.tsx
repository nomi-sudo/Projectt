"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCategories } from "@/hooks/useProducts";

export default function Sidebar() {
  const params = useParams();
  const currentCategorySlug = params.slug as string;
  const currentSubSlug = params.subslug as string;
  const { categories, loading } = useCategories();

  const currentCategory = categories.find(
    (c) => c.slug === currentCategorySlug
  );

  if (loading) {
    return (
      <aside className="w-64 flex-shrink-0 hidden md:block">
        <div className="sticky top-24 space-y-6">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-full bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-24 space-y-8">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 uppercase tracking-wider">Subcategories</h3>
          <ul className="space-y-2">
            {currentCategory?.subcategories.map((sub) => {
              const subSlug = sub.toLowerCase().replace(/ /g, '-');
              const isActive = currentSubSlug === subSlug;

              return (
                <li key={sub}>
                  <Link
                    href={`/category/${currentCategorySlug}/${subSlug}`}
                    className={cn(
                      "text-sm block py-1 transition-all",
                      isActive
                        ? "text-primary font-bold border-l-2 border-primary pl-3"
                        : "text-muted-foreground hover:text-primary hover:pl-2"
                    )}
                  >
                    {sub}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 uppercase tracking-wider">Price Range</h3>
          <div className="space-y-4">
            <input type="range" className="w-full accent-primary" min="0" max="50000" />
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Rs. 0</span>
              <span>Rs. 50,000+</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 uppercase tracking-wider">Availability</h3>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
            In Stock
          </label>
        </div>
      </div>
    </aside>
  );
}
