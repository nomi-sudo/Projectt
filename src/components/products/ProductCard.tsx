"use client";

import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring, Variants } from "framer-motion";
import { useState, useRef } from "react";
import { useCart } from "@/store/useCart";
import Image from "next/image";

interface ProductCardProps {
  product: any;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 130, damping: 20 } }
  };

  const addItem = useCart((state) => state.addItem);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  /* 3-D tilt */
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const stars = Math.round(product.rating);

  return (
    <motion.div
      variants={itemVariants}
      className="perspective-1000 cursor-pointer break-inside-avoid mb-6 inline-block w-full"
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ z: 20 }}
        className="group relative bg-white rounded-2xl border border-border overflow-visible shadow-md hover:shadow-[0_24px_60px_-12px_rgba(0,122,122,0.28)] transition-shadow duration-300"
      >
        {/* Glare overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.18) 0%, transparent 65%)`,
          }}
        />

        {/* Image container */}
        <div className="relative aspect-[4/3] bg-muted rounded-t-2xl overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full relative p-3"
            style={{ transformStyle: "preserve-3d", translateZ: 10 }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-3"
            />
          </motion.div>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.07 + 0.3, type: "spring" }}
            className="absolute top-3 left-3 bg-primary text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg"
            style={{ translateZ: 20 }}
          >
            In Stock
          </motion.div>

          {/* Action row — top right */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.15, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLiked((l) => !l)}
              className={`p-2 rounded-full shadow-md backdrop-blur-sm transition-colors ${liked ? "bg-red-500 text-white" : "bg-white/90 text-foreground"}`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? "fill-white" : ""}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/90 backdrop-blur-sm text-foreground rounded-full shadow-md"
            >
              <Eye className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Add to cart — slides up on hover */}
          <motion.div
            className="absolute inset-x-0 bottom-0 p-3"
            initial={{ y: "110%" }}
            whileHover={{ y: 0 }}
            style={{ translateZ: 15 }}
          >
            <div className="absolute inset-x-3 bottom-3 [&>*]:w-full">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleAddToCart}
                className={`btn-shine w-full font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-xl transition-colors ${
                  added ? "bg-green-500 text-white" : "bg-primary hover:bg-primary-dark text-white"
                }`}
              >
                <motion.div
                  animate={added ? { rotate: [0, 360] } : { rotate: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <ShoppingCart className="w-4 h-4" />
                </motion.div>
                {added ? "Added!" : "Add to Cart"}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-4" style={{ transform: "translateZ(5px)" }}>
          {/* Stars */}
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < stars ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">({product.rating})</span>
          </div>

          {/* Name */}
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug mb-1 group-hover:text-primary transition-colors duration-200 capitalize" style={{ height: "2.6rem" }}>
            {product.name.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </h3>

          <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-wider font-semibold">
            {product.subcategory}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-extrabold text-primary">Rs. {product.price.toLocaleString()}</span>
            </div>
            <div className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">FREE DELIVERY</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
