"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Product, Category } from "@/lib/supabase";

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("products")
      .select("*, categories(name, slug)")
      .order("created_at", { ascending: false });
    if (err) {
      setError(err.message);
    } else {
      setProducts((data ?? []) as Product[]);
    }
    setLoading(false);
  }, []);

  const fetchCategories = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!err && data) {
      setCategories(
        data.map((c) => ({
          ...c,
          subcategories: Array.isArray(c.subcategories) ? c.subcategories : [],
        })) as Category[]
      );
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const createProduct = useCallback(
    async (input: {
      name: string;
      slug: string;
      price: number;
      category_id: string;
      subcategory: string;
      image: string | null;
      rating: number;
      in_stock: boolean;
      featured: boolean;
    }) => {
      const { data, error: err } = await supabase
        .from("products")
        .insert(input)
        .select("*, categories(name, slug)")
        .single();
      if (err) throw err;
      setProducts((prev) => [data as Product, ...prev]);
      return data;
    },
    []
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      const { data, error: err } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select("*, categories(name, slug)")
        .single();
      if (err) throw err;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? (data as Product) : p))
      );
      return data;
    },
    []
  );

  const deleteProduct = useCallback(async (id: string) => {
    const { error: err } = await supabase.from("products").delete().eq("id", id);
    if (err) throw err;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleStock = useCallback(
    async (id: string, inStock: boolean) => {
      return updateProduct(id, { in_stock: inStock });
    },
    [updateProduct]
  );

  const toggleFeatured = useCallback(
    async (id: string, featured: boolean) => {
      return updateProduct(id, { featured });
    },
    [updateProduct]
  );

  return {
    products,
    categories,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    toggleFeatured,
  };
}
