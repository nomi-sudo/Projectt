import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

export type Category = {
  id: string;
  name: string;
  slug: string;
  subcategories: string[];
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category_id: string;
  subcategory: string;
  image: string | null;
  rating: number;
  in_stock: boolean;
  featured: boolean;
  categories?: { name: string; slug: string };
};
