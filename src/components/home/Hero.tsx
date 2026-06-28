"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, Star } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    title: "Fresh Groceries",
    titleAccent: "Delivered Fast",
    subtitle: "Premium quality items straight from farm to your doorstep.",
    cta: "Shop Grocery",
    href: "/category/grocery",
    badge: "New Arrivals Daily",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=85&w=1600",
    gradient: "from-teal-950 via-teal-800 to-emerald-700",
    orb1: "#00c8c8",
    orb2: "#007a7a",
    tag: "GROCERY",
  },
  {
    title: "Signature Perfumes",
    titleAccent: "World-Class Scents",
    subtitle: "Discover your identity through rare and luxurious fragrances.",
    cta: "Explore Perfumes",
    href: "/category/perfume",
    badge: "Exclusive Collection",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=85&w=1600",
    gradient: "from-orange-950 via-orange-800 to-amber-700",
    orb1: "#ff9a33",
    orb2: "#ff5500",
    tag: "PERFUME",
  },
  {
    title: "Radiant Skin Care",
    titleAccent: "Your Glow Awaits",
    subtitle: "Scientifically curated skincare for every skin type and concern.",
    cta: "Shop Skin Care",
    href: "/category/skin-care",
    badge: "Dermatologist Picks",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=85&w=1600",
    gradient: "from-rose-950 via-pink-800 to-rose-600",
    orb1: "#f472b6",
    orb2: "#be185d",
    tag: "SKIN CARE",
  },
  {
    title: "Baby Essentials",
    titleAccent: "Care They Deserve",
    subtitle: "Trusted products handpicked for the safety of your little ones.",
    cta: "Shop Baby",
    href: "/category/baby",
    badge: "Pediatrician Approved",
    image: "https://images.unsplash.com/photo-1544200175-ca6e80a7b323?auto=format&fit=crop&q=85&w=1600",
    gradient: "from-sky-950 via-blue-800 to-cyan-700",
    orb1: "#67e8f9",
    orb2: "#0e7490",
    tag: "BABY",
  },
];

/* floating particle blob */
function Particle({ delay, x, y, size, color }: { delay: number; x: string; y: string; size: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, filter: "blur(1px)" }}
      animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slide = slides[current];

  const startAuto = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 5000);
  }, []);

  useEffect(() => {
    if (isPlaying) startAuto();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, startAuto]);

  const go = (dir: 1 | -1) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrent((p) => (p + dir + slides.length) % slides.length);
    if (isPlaying) startAuto();
  };

  const particles = [
    { delay: 0,   x: "10%",  y: "20%",  size: 8,  color: "rgba(255,255,255,0.4)" },
    { delay: 1,   x: "80%",  y: "15%",  size: 12, color: "rgba(255,255,255,0.3)" },
    { delay: 2,   x: "60%",  y: "75%",  size: 6,  color: "rgba(255,255,255,0.5)" },
    { delay: 0.5, x: "30%",  y: "80%",  size: 10, color: "rgba(255,255,255,0.35)" },
    { delay: 1.5, x: "90%",  y: "55%",  size: 7,  color: "rgba(255,255,255,0.4)" },
    { delay: 2.5, x: "5%",   y: "60%",  size: 9,  color: "rgba(255,255,255,0.3)" },
    { delay: 3,   x: "45%",  y: "10%",  size: 5,  color: "rgba(255,255,255,0.5)" },
  ];

  return (
    <section className="relative h-[580px] md:h-[680px] overflow-hidden">
      {/* Background Image with parallax */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.03, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={current === 0}
            className="object-cover object-center"
          />
          {/* Multi-layer gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-80`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Floating particles */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* Animated orb decorations */}
      <motion.div
        className="absolute -right-20 -top-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${slide.orb1}55 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.15, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        key={`orb1-${current}`}
      />
      <motion.div
        className="absolute -left-20 bottom-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${slide.orb2}44 0%, transparent 70%)` }}
        animate={{ scale: [1.1, 1, 1.1], rotate: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        key={`orb2-${current}`}
      />

      {/* Grid overlay for depth */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div key={`content-${current}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 glass text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
              >
                <Sparkles className="w-3 h-3 text-accent-light animate-pulse" />
                {slide.badge}
                <span className="bg-accent text-white text-[9px] px-2 py-0.5 rounded-full">{slide.tag}</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 20 }}
                className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] mb-3"
              >
                {slide.title}
                <br />
                <span className="text-accent-light relative">
                  {slide.titleAccent}
                  <motion.div
                    className="absolute -bottom-1 left-0 h-1 bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  />
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-white/75 text-lg md:text-xl mb-10 leading-relaxed max-w-lg"
              >
                {slide.subtitle}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex items-center gap-4"
              >
                <Link href={slide.href}>
                  <motion.button
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-shine bg-accent hover:bg-accent-light text-white font-bold py-4 px-10 rounded-2xl shadow-2xl shadow-orange-500/40 uppercase tracking-wider text-sm flex items-center gap-2"
                  >
                    {slide.cta}
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="glass text-white font-semibold py-4 px-8 rounded-2xl text-sm border border-white/30 hover:bg-white/20 transition-all"
                >
                  View All
                </motion.button>
              </motion.div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right side — floating stat cards */}
        <div className="hidden lg:flex flex-col gap-4 ml-auto">
          {[
            { label: "Products", value: "5,000+", icon: "🛒" },
            { label: "Brands",   value: "300+",   icon: "⭐" },
            { label: "Customers", value: "50k+",  icon: "❤️" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.12, type: "spring", stiffness: 150 }}
              className="glass rounded-2xl px-6 py-4 text-white flex items-center gap-4 min-w-[160px] animate-float"
              style={{ animationDelay: `${i * 1.5}s` }}
            >
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <div className="text-xl font-extrabold">{stat.value}</div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Slide controls */}
      <motion.button
        whileHover={{ scale: 1.1, x: -3 }} whileTap={{ scale: 0.95 }}
        onClick={() => go(-1)}
        className="absolute left-5 top-1/2 -translate-y-1/2 glass-dark text-white p-3.5 rounded-2xl z-20"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1, x: 3 }} whileTap={{ scale: 0.95 }}
        onClick={() => go(1)}
        className="absolute right-5 top-1/2 -translate-y-1/2 glass-dark text-white p-3.5 rounded-2xl z-20"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => { if (intervalRef.current) clearInterval(intervalRef.current); setCurrent(i); if (isPlaying) startAuto(); }}
            className="relative h-2 rounded-full transition-all overflow-hidden"
            style={{ width: current === i ? 40 : 8, background: current === i ? "transparent" : "rgba(255,255,255,0.4)" }}
          >
            {current === i && (
              <motion.div className="absolute inset-0 bg-accent rounded-full"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ originX: 0 }}
                transition={{ duration: 5, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-14 fill-background">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
