"use client";

import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Package, DollarSign, TrendingUp, TriangleAlert as AlertTriangle, Star, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const { products, loading } = useAdminProducts();
  const { user } = useAuth();
  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    supabase.from("orders").select("id", { count: "exact", head: true }).then(({ count }) => {
      setOrderCount(count ?? 0);
    });
  }, []);

  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const featuredCount = products.filter((p) => p.featured).length;
  const outOfStock = products.filter((p) => !p.in_stock).length;
  const avgRating =
    products.length > 0
      ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)
      : "0";

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Catalog Value",
      value: `Rs. ${(totalValue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Featured Items",
      value: featuredCount,
      icon: Star,
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Out of Stock",
      value: outOfStock,
      icon: AlertTriangle,
      color: "from-red-500 to-rose-600",
      bg: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Welcome back, {user?.user_metadata?.name ?? "Admin"}!
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here&apos;s what&apos;s happening in your store today.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm shadow-lg shadow-primary/30"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Avg. Rating</span>
          </div>
          <p className="text-3xl font-extrabold text-foreground">{avgRating}</p>
          <p className="text-xs text-muted-foreground mt-1">Across all products</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-foreground">Total Orders</span>
          </div>
          <p className="text-3xl font-extrabold text-foreground">{orderCount}</p>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-foreground">Featured Rate</span>
          </div>
          <p className="text-3xl font-extrabold text-foreground">
            {products.length > 0 ? Math.round((featuredCount / products.length) * 100) : 0}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">Of catalog featured</p>
        </div>
      </div>

      {/* Recent products */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground">Recent Products</h3>
          <Link
            href="/admin/products"
            className="text-sm text-primary font-semibold hover:underline"
          >
            View all
          </Link>
        </div>
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentProducts.map((product) => (
              <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                <div className="w-10 h-10 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                  {product.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.categories?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">Rs. {product.price.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.in_stock ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>
            ))}
            {recentProducts.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No products yet. Add your first product!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
