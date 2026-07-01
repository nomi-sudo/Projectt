"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Product, Category } from "@/lib/supabase";

export function useProducts(categorySlug?: string, subcategory?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from("products").select("*, categories(name, slug)");
      if (categorySlug) query = query.eq("categories.slug", categorySlug);
      if (subcategory) query = query.eq("subcategory", subcategory);
      const { data, error: err } = await query.order("created_at", { ascending: false });
      if (err) throw err;
      setProducts((data ?? []) as Product[]);
    } catch (e: any) {
      setError(e.message ?? "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [categorySlug, subcategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          setCategories(
            data.map((c) => ({
              ...c,
              subcategories: Array.isArray(c.subcategories) ? c.subcategories : [],
            })) as Category[]
          );
        }
        setLoading(false);
      });
  }, []);

  return { categories, loading };
}

export function useFeaturedProducts(limit = 10) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*, categories(name, slug)")
      .eq("featured", true)
      .limit(limit)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setProducts(data as Product[]);
        setLoading(false);
      });
  }, [limit]);

  return { products, loading };
}
