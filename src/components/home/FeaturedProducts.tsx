"use client";

import { PRODUCTS } from "@/constants/products";
import ProductCard from "@/components/products/ProductCard";
import { motion } from "framer-motion";
import { Flame, Sparkles } from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "@/constants/categories";

const tabs = ["All", ...CATEGORIES.map((c) => c.name)];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeTab);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 120 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 text-accent bg-accent/10 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            <Flame className="w-3.5 h-3.5" />
            Trending Now
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3">
            Featured <span className="gradient-text">Products</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Real items sourced directly from Al-Fatah Mart's live catalog.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-12">
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "text-white shadow-lg shadow-primary/30"
                  : "text-muted-foreground bg-muted hover:bg-muted/70"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </motion.button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6"
        >
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
