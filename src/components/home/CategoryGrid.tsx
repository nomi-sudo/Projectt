"use client";

import Link from "next/link";
import { CATEGORIES } from "@/constants/categories";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const categoryMeta: Record<string, { emoji: string; color: string; bg: string; glow: string }> = {
  "Grocery":     { emoji: "🥦", color: "from-emerald-500 to-teal-600",   bg: "bg-emerald-50",  glow: "rgba(16,185,129,0.4)" },
  "Non-Grocery": { emoji: "🧴", color: "from-blue-500 to-indigo-600",    bg: "bg-blue-50",     glow: "rgba(99,102,241,0.4)" },
  "Perfume":     { emoji: "🌸", color: "from-orange-400 to-rose-500",    bg: "bg-orange-50",   glow: "rgba(249,115,22,0.4)" },
  "Skin Care":   { emoji: "✨", color: "from-pink-400 to-fuchsia-500",   bg: "bg-pink-50",     glow: "rgba(236,72,153,0.4)" },
  "Baby":        { emoji: "🍼", color: "from-sky-400 to-cyan-500",       bg: "bg-sky-50",      glow: "rgba(14,165,233,0.4)" },
};

function CategoryCard({ category, index }: { category: typeof CATEGORIES[0]; index: number }) {
  const meta = categoryMeta[category.name] ?? { emoji: "🛒", color: "from-gray-400 to-gray-600", bg: "bg-gray-50", glow: "rgba(100,100,100,0.3)" };
  const cardRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 180, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={cardRef}
      href={`/category/${category.name.toLowerCase().replace(/ /g, '-')}`}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 140, damping: 18 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="perspective-800 group relative h-72 rounded-3xl overflow-hidden cursor-pointer block"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${meta.color} opacity-90`} />

      {/* Animated mesh circles */}
      <motion.div
        className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/15"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/10"
        animate={{ scale: [1.1, 1, 1.1], rotate: [0, -60, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid lines for depth */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />

      {/* Content */}
      <div className="absolute inset-0 p-7 flex flex-col justify-between" style={{ transformStyle: "preserve-3d" }}>
        {/* Top: emoji + subcategory count */}
        <div className="flex items-start justify-between">
          <motion.div
            style={{ translateZ: 30 }}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/30"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {meta.emoji}
          </motion.div>
          <span className="text-white/70 text-xs font-bold bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full">
            {category.subcategories.length} sub-cats
          </span>
        </div>

        {/* Bottom: name + arrow */}
        <div style={{ transform: "translateZ(20px)" }}>
          <h3 className="text-2xl font-extrabold text-white mb-1 drop-shadow-md">{category.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-xs">Explore collection</span>
            <motion.div
              className="w-7 h-7 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `0 0 60px 10px ${meta.glow}` }}
      />
    </motion.a>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function CategoryGrid() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Section BG */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 120 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-primary bg-primary/10 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Browse Departments
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3">
              Shop by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-muted-foreground max-w-md">Handpicked selections across your favourite product lines.</p>
          </div>
          <Link href="/categories"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 perspective-1000"
        >
          {CATEGORIES.map((category, i) => (
            <CategoryCard key={category.name} category={category} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
