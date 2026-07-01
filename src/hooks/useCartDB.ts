"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import type { Product } from "@/lib/supabase";

export type CartItem = {
  id: string;
  quantity: number;
  product_id: string;
  products: Product;
};

export function useCartDB() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("*, products(*)")
      .eq("user_id", user.id);
    if (!error) setItems((data ?? []) as CartItem[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      if (!user) return;
      await supabase.from("cart_items").upsert(
        { user_id: user.id, product_id: productId, quantity },
        { onConflict: "user_id,product_id" }
      );
      await fetchCart();
    },
    [user, fetchCart]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!user) return;
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
      await fetchCart();
    },
    [user, fetchCart]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!user || quantity < 1) return;
      await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("user_id", user.id)
        .eq("product_id", productId);
      await fetchCart();
    },
    [user, fetchCart]
  );

  const clearCart = useCallback(async () => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setItems([]);
  }, [user]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.products.price * i.quantity, 0);

  return { items, loading, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart };
}
