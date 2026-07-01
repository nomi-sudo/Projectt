"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useCategories } from "@/hooks/useProducts";

export default function Navbar() {
  const { categories, loading } = useCategories();

  return (
    <nav className="bg-primary text-white">
      <div className="container mx-auto px-4">
        <ul className="flex items-center gap-8 h-12">
          <li className="group relative h-full flex items-center">
            <button className="flex items-center gap-2 font-semibold hover:text-accent transition-colors uppercase tracking-wider text-sm">
              Shop by Department
              <ChevronDown className="w-4 h-4" />
            </button>

            <div className="absolute top-12 left-0 w-[800px] bg-white text-foreground shadow-xl rounded-b-lg border border-border hidden group-hover:grid grid-cols-5 p-6 z-50">
              {loading ? (
                <div className="col-span-5 h-32 bg-muted rounded animate-pulse" />
              ) : (
                categories.map((category) => (
                  <div key={category.name} className="flex flex-col gap-2">
                    <h3 className="font-bold text-primary border-b border-muted pb-2 mb-2">
                      {category.name}
                    </h3>
                    <ul className="space-y-1">
                      {category.subcategories.map((sub) => (
                        <li key={sub}>
                          <Link
                            href={`/category/${category.slug}/${sub.toLowerCase().replace(/ /g, '-')}`}
                            className="text-xs text-muted-foreground hover:text-primary hover:underline transition-all"
                          >
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </li>

          {categories.map((category) => (
            <li key={category.name} className="h-full flex items-center">
              <Link
                href={`/category/${category.slug}`}
                className="text-sm font-medium hover:text-accent transition-colors uppercase"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
