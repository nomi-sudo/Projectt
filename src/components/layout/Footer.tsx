"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CATEGORIES } from "@/constants/categories";
import { Phone, Mail, MapPin, Globe, Share2, Rss, AtSign } from "lucide-react";

const socials = [
  { icon: Globe,  href: "#", label: "Facebook"  },
  { icon: AtSign, href: "#", label: "Instagram" },
  { icon: Share2, href: "#", label: "Twitter"   },
  { icon: Rss,    href: "#", label: "YouTube"   },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gray-950 text-white">
      {/* Decorative gradient top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      {/* Floating orbs */}
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-extrabold tracking-tighter mb-1">
              AL-FATAH <span className="text-accent">MART</span>
            </h2>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-5">Pakistan&apos;s Finest Store</p>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Bringing premium quality grocery, lifestyle, and wellness products to your doorstep since 1957.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a key={label} href={href} aria-label={label}
                  whileHover={{ scale: 1.15, y: -3 }} whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 bg-white/8 hover:bg-primary rounded-xl flex items-center justify-center transition-colors border border-white/10 hover:border-primary"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/50 mb-5">Departments</h3>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.name}>
                  <Link href={`/category/${cat.name.toLowerCase().replace(/ /g, '-')}`}
                    className="text-white/60 hover:text-accent text-sm flex items-center gap-2 transition-colors group"
                  >
                    <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/50 mb-5">Information</h3>
            <ul className="space-y-2.5">
              {["About Us", "Privacy Policy", "Terms & Conditions", "Return Policy", "Careers", "Store Locator"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-white/60 hover:text-accent text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/50 mb-5">Contact Us</h3>
            <ul className="space-y-4">
              {[
                { icon: Phone,   label: "042-111-532-821"           },
                { icon: Mail,    label: "info@alfatah.pk"           },
                { icon: MapPin,  label: "Lahore, Punjab, Pakistan"  },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-3 text-sm text-white/60">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-primary-light" />
                  </div>
                  {label}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>&copy; 2026 Al-Fatah Mart. All rights reserved.</span>
          <div className="flex items-center gap-4">
            {["Privacy", "Terms", "Sitemap"].map((item) => (
              <Link key={item} href="#" className="hover:text-white transition-colors">{item}</Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {["💳", "🏦", "📱", "💰"].map((icon, i) => (
              <span key={i} className="w-9 h-6 bg-white/10 rounded flex items-center justify-center text-sm">{icon}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
