"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

const promos = [
  {
    tag: "New Arrivals",
    title: "Premium Grocery\nCollection 2026",
    cta: "Explore Now",
    href: "/category/grocery",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    gradient: "from-teal-900 via-emerald-800 to-teal-700",
    accent: "text-emerald-300",
  },
  {
    tag: "Exclusive Deal",
    title: "Designer Perfumes\nUp to 30% Off",
    cta: "Shop Sale",
    href: "/category/perfume",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800",
    gradient: "from-orange-900 via-amber-800 to-orange-700",
    accent: "text-amber-300",
  },
];

export default function PromoSection() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          {promos.map((promo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i === 0 ? -40 : 40, rotateY: i === 0 ? -5 : 5 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.02, rotateY: i === 0 ? -2 : 2 }}
              style={{ transformStyle: "preserve-3d" }}
              className="perspective-1000 relative h-72 rounded-3xl overflow-hidden group cursor-pointer"
            >
              {/* BG image */}
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${promo.image})` }}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5 }}
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${promo.gradient} opacity-80`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
              />

              {/* Animated orb */}
              <motion.div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10"
                animate={{ scale: [1, 1.3, 1], rotate: [0, 60, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              />

              <div className="absolute inset-0 p-10 flex flex-col justify-between" style={{ transform: "translateZ(20px)" }}>
                <div>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 + 0.2 }}
                    className={`inline-flex items-center gap-1.5 ${promo.accent} font-bold uppercase tracking-widest text-xs mb-3`}
                  >
                    <Zap className="w-3 h-3" /> {promo.tag}
                  </motion.span>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight whitespace-pre-line">
                    {promo.title}
                  </h3>
                </div>

                <motion.a
                  href={promo.href}
                  whileHover={{ gap: "1rem", paddingRight: "1.5rem" }}
                  className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white font-bold px-6 py-3 rounded-2xl border border-white/25 w-fit transition-all text-sm group/btn"
                >
                  {promo.cta}
                  <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
