"use client";

import Link from "next/link";
import { Search, User, Heart, Menu, X, ChevronDown, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { useCartDB } from "@/hooks/useCartDB";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const { categories, loading } = useCategories();
  const { user } = useAuth();
  const { totalItems } = useCartDB();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-border" : "bg-white border-b border-border"
      }`}>
        <div className="bg-primary text-white text-xs py-1.5 text-center font-medium tracking-wide hidden md:block">
          Free delivery on orders above Rs. 2,000 &nbsp;&middot;&nbsp; Call us: 042-111-532-821
        </div>

        <div className="container mx-auto px-4 h-18 py-3 flex items-center gap-6">
          <Link href="/" className="flex-shrink-0 group">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
              <h1 className="text-primary text-2xl md:text-3xl font-extrabold tracking-tighter font-heading leading-none">
                AL-FATAH
                <span className="text-accent"> MART</span>
              </h1>
              <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest">Pakistan&apos;s Finest Store</p>
            </motion.div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-2xl relative group">
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              className="w-full h-11 pl-12 pr-36 bg-muted/70 border border-transparent rounded-2xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary/30 focus:bg-white outline-none transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-colors">
              Search
            </button>
          </div>

          <div className="flex items-center gap-1 md:gap-2 ml-auto">
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
              className="hidden sm:flex p-2.5 hover:bg-muted rounded-xl transition-colors relative"
            >
              <Heart className="w-5 h-5 text-foreground" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">0</span>
            </motion.button>

            <Link href="/cart" className="relative">
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                className="p-2.5 hover:bg-muted rounded-xl transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[9px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-extrabold px-1"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            <div className="hidden md:flex items-center gap-2 ml-2 pl-3 border-l border-border">
              <Link href={user ? "/account" : "/auth"}>
                <motion.div
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground font-normal">Hello, {user ? (user.user_metadata?.name ?? "User") : "Sign in"}</div>
                    <div className="text-xs font-bold">{user ? "Account" : "Account"}</div>
                  </div>
                </motion.div>
              </Link>
            </div>

            <Link href={user ? "/account" : "/auth"} className="md:hidden">
              <motion.div
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                className="p-2.5 hover:bg-muted rounded-xl transition-colors flex items-center justify-center"
              >
                <User className="w-5 h-5 text-primary" />
              </motion.div>
            </Link>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 hover:bg-muted rounded-xl transition-colors">
              <AnimatePresence mode="wait">
                {mobileOpen
                  ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="w-5 h-5" /></motion.div>
                  : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Menu className="w-5 h-5" /></motion.div>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>

        <div className="hidden md:block border-t border-border">
          <div className="container mx-auto px-4">
            <nav className="flex items-center h-11 gap-0">
              <div className="relative h-full flex items-center" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
                <button className={`flex items-center gap-2 h-full px-5 font-bold text-sm uppercase tracking-wider transition-colors ${megaOpen ? "bg-primary text-white" : "text-primary hover:bg-primary/5"}`}>
                  <span className="grid grid-cols-2 gap-0.5 w-3.5">
                    {Array.from({ length: 4 }).map((_, i) => <span key={i} className="w-1.5 h-1.5 bg-current rounded-sm" />)}
                  </span>
                  All Departments
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      style={{ transformOrigin: "top" }}
                      className="absolute top-full left-0 w-[860px] bg-white shadow-2xl shadow-black/10 border border-border rounded-b-2xl z-50"
                    >
                      {loading ? (
                        <div className="p-6 grid grid-cols-5 gap-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-5 gap-0 p-6">
                          {categories.map((cat, ci) => (
                            <div key={cat.name} className={`${ci < categories.length - 1 ? "border-r border-border pr-4 mr-4" : ""}`}>
                              <Link href={`/category/${cat.slug}`}
                                className="block font-extrabold text-primary mb-3 hover:text-accent transition-colors text-sm uppercase tracking-wider"
                              >
                                {cat.name}
                              </Link>
                              <ul className="space-y-1.5">
                                {cat.subcategories.slice(0, 8).map((sub) => (
                                  <li key={sub}>
                                    <Link
                                      href={`/category/${cat.slug}/${sub.toLowerCase().replace(/ /g, '-')}`}
                                      className="text-[11px] text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block leading-tight"
                                    >
                                      {sub}
                                    </Link>
                                  </li>
                                ))}
                                {cat.subcategories.length > 8 && (
                                  <li className="text-[11px] text-primary font-bold">+{cat.subcategories.length - 8} more</li>
                                )}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center h-full ml-2">
                {categories.map((cat) => (
                  <Link key={cat.name}
                    href={`/category/${cat.slug}`}
                    className="px-4 h-full flex items-center text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-all border-b-2 border-transparent hover:border-primary"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-40 overflow-y-auto pt-20 pb-8 px-6"
          >
            <Link href={user ? "/account" : "/auth"} onClick={() => setMobileOpen(false)}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 mb-5 bg-gradient-to-r from-primary to-primary-light text-white rounded-2xl px-4 py-3.5 shadow-md shadow-primary/20"
              >
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/70 font-normal">Hello, {user ? (user.user_metadata?.name ?? "User") : "Guest"}</p>
                  <p className="text-sm font-bold">{user ? "My Account" : "Sign In / Sign Up"}</p>
                </div>
                <span className="ml-auto text-white/60 text-lg">&rsaquo;</span>
              </motion.div>
            </Link>

            <div className="mb-6">
              <input type="text" placeholder="Search..." className="w-full h-10 px-4 bg-muted rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              categories.map((cat, i) => (
                <motion.div key={cat.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/category/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-3 border-b border-border text-sm font-bold text-foreground hover:text-primary transition-colors"
                  >
                    {cat.name}
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {mobileOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setMobileOpen(false)} />}
    </>
  );
}
