"use client";

import { useCart } from "@/store/useCart";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartButton() {
  const totalItems = useCart((state) => state.totalItems());
  const [mounted, setMounted] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || totalItems === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(t);
  }, [totalItems, mounted]);

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      animate={bump ? { scale: [1, 1.25, 1] } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="relative p-2.5 hover:bg-muted rounded-xl transition-colors"
    >
      <ShoppingCart className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
      <AnimatePresence>
        {mounted && totalItems > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[9px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-extrabold px-1"
          >
            {totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
