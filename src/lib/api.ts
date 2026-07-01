import { supabase } from "./supabase";
import { supabaseServer } from "./supabase-server";
import type { Category, Product } from "./supabase";

/* ── Categories ── */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((c) => ({
    ...c,
    subcategories: Array.isArray(c.subcategories) ? c.subcategories : [],
  })) as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    subcategories: Array.isArray(data.subcategories) ? data.subcategories : [],
  } as Category;
}

/* ── Products ── */
export async function getProducts(options?: {
  categorySlug?: string;
  subcategory?: string;
  featured?: boolean;
  limit?: number;
}): Promise<Product[]> {
  let query = supabase.from("products").select("*, categories(name, slug)");

  if (options?.categorySlug) {
    query = query.eq("categories.slug", options.categorySlug);
  }
  if (options?.subcategory) {
    query = query.eq("subcategory", options.subcategory);
  }
  if (options?.featured) {
    query = query.eq("featured", true);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabaseServer
    .from("products")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as Product | null;
}

export async function getFeaturedProducts(limit = 10): Promise<Product[]> {
  return getProducts({ featured: true, limit });
}

/* ── Cart (server-side for SSR) ── */
export async function getCartItems(userId: string) {
  const { data, error } = await supabase
    .from("cart_items")
    .select("*, products(*)")
    .eq("user_id", userId);
  if (error) throw error;
  return data ?? [];
}

export async function addCartItem(userId: string, productId: string, quantity = 1) {
  const { data, error } = await supabase
    .from("cart_items")
    .upsert({ user_id: userId, product_id: productId, quantity }, { onConflict: "user_id,product_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeCartItem(userId: string, productId: string) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
  if (error) throw error;
}

export async function clearCart(userId: string) {
  const { error } = await supabase.from("cart_items").delete().eq("user_id", userId);
  if (error) throw error;
}
