"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, ShoppingBag, Clock, Star } from "lucide-react";

const features = [
  { icon: Truck,       title: "Fast Delivery",       desc: "Across Pakistan",    color: "text-cyan-400" },
  { icon: ShieldCheck, title: "Secure Payment",      desc: "100% Protected",     color: "text-green-400" },
  { icon: ShoppingBag, title: "5,000+ Products",     desc: "Genuine Quality",    color: "text-yellow-400" },
  { icon: Star,        title: "Top Rated",            desc: "50k+ Happy Customers", color: "text-orange-400" },
  { icon: Clock,       title: "24/7 Support",         desc: "Always here",        color: "text-pink-400" },
];

export default function StatsBar() {
  return (
    <section className="relative py-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary to-teal-600" />

      {/* Moving background stripes */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.4) 40px, rgba(255,255,255,0.4) 80px)" }}
        animate={{ backgroundPosition: ["0px 0px", "80px 80px"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 150 }}
              whileHover={{ y: -4, scale: 1.04 }}
              className="flex items-center gap-3 group"
            >
              <motion.div
                className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex-shrink-0"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </motion.div>
              <div>
                <h4 className="font-bold text-white text-sm leading-tight">{item.title}</h4>
                <p className="text-white/55 text-xs">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
