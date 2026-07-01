"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartDB } from "@/hooks/useCartDB";
import { useAuth } from "@/hooks/useAuth";

export default function CartScreen() {
  const { user } = useAuth();
  const { items, loading, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCartDB();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="w-16 h-16 text-primary/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Please Sign In</h2>
          <p className="text-muted-foreground mb-6">Sign in to view and manage your cart.</p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-2xl hover:bg-primary-dark transition-colors"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
            <div className="h-80 bg-muted rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Package className="w-16 h-16 text-primary/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added anything yet.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-2xl hover:bg-primary-dark transition-colors"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-foreground">Shopping Cart ({totalItems})</h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 font-semibold flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-border"
                >
                  <div className="relative w-24 h-24 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                    {item.products.image ? (
                      <Image
                        src={item.products.image}
                        alt={item.products.name}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2">{item.products.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.products.subcategory}</p>
                    <div className="text-primary font-extrabold mt-1">
                      Rs. {item.products.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-muted rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border sticky top-24">
              <h3 className="text-lg font-bold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-extrabold text-primary text-lg">Rs. {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-shine w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-bold text-sm shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </motion.button>

              <Link
                href="/"
                className="block text-center text-sm text-muted-foreground hover:text-primary mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
