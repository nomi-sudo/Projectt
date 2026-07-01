"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Share2, Truck, ShieldCheck, RotateCcw, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCartDB } from "@/hooks/useCartDB";
import type { Product } from "@/lib/supabase";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { user } = useAuth();
  const { addItem } = useCartDB();
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    await addItem(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const stars = Math.round(product.rating);
  const productImage = product.image ?? "https://via.placeholder.com/600x600?text=No+Image";

  return (
    <div className="min-h-screen py-12 bg-muted/10">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/category/${product.categories?.slug ?? ""}`} className="hover:text-primary">
            {product.categories?.name ?? "Category"}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 border border-border shadow-sm flex items-center justify-center relative"
          >
            <div className="relative w-full aspect-square">
              <Image
                src={productImage}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLiked(!liked)}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-md backdrop-blur-sm transition-colors ${
                liked ? "bg-red-500 text-white" : "bg-white/90 text-foreground"
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-white" : ""}`} />
            </motion.button>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="inline-flex items-center gap-1.5 text-primary bg-primary/10 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit mb-4">
              {product.subcategory}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < stars ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.rating})</span>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-semibold">
                {product.in_stock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="text-4xl font-extrabold text-primary mb-6">
              Rs. {product.price.toLocaleString()}
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Premium quality product from AL-FATAH MART. Genuine item sourced directly from the brand. 
              Free delivery on orders above Rs. 2,000. Easy returns within 7 days.
            </p>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center bg-white border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <span className="text-lg font-bold">-</span>
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <span className="text-lg font-bold">+</span>
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors ${
                  added
                    ? "bg-green-500 text-white"
                    : product.in_stock
                    ? "bg-primary hover:bg-primary-dark text-white shadow-primary/30"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? "Added to Cart!" : product.in_stock ? "Add to Cart" : "Out of Stock"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-white border border-border rounded-2xl hover:bg-muted transition-colors"
              >
                <Share2 className="w-5 h-5 text-foreground" />
              </motion.button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Free Delivery" },
                { icon: ShieldCheck, label: "Genuine Product" },
                { icon: RotateCcw, label: "7-Day Returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 bg-white border border-border rounded-2xl p-4">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground text-center">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
