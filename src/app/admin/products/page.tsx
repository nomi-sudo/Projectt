"use client";

import { useState, useMemo } from "react";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import ProductFormModal from "@/components/admin/ProductFormModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { Plus, Search, Pencil, Trash2, Star, Package, ListFilter as Filter, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/supabase";

export default function AdminProductsPage() {
  const {
    products,
    categories,
    loading,
    deleteProduct,
    toggleStock,
    toggleFeatured,
  } = useAdminProducts();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "rating">("newest");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) => p.categories?.slug === categoryFilter);
    }

    if (stockFilter === "in") result = result.filter((p) => p.in_stock);
    if (stockFilter === "out") result = result.filter((p) => !p.in_stock);

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [products, search, categoryFilter, stockFilter, sortBy]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {products.length} products in catalog
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm shadow-lg shadow-primary/30"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-border p-4 flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, slug, or subcategory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary/30 focus:bg-white outline-none transition-all"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-muted/50 border border-transparent rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/40 outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-muted/50 border border-transparent rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/40 outline-none cursor-pointer"
          >
            <option value="all">All Stock</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-muted/50 border border-transparent rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/40 outline-none cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No products found</p>
            <p className="text-muted-foreground/60 text-sm mt-1">
              Try adjusting your filters or add a new product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Product
                  </th>
                  <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Price
                  </th>
                  <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                    Rating
                  </th>
                  <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Stock
                  </th>
                  <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                    Featured
                  </th>
                  <th className="text-right text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                          {product.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 max-w-[200px]">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {product.subcategory}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {product.categories?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-foreground">
                        Rs. {product.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium text-foreground">
                          {product.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStock(product.id, !product.in_stock)}
                        className={`relative inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          product.in_stock
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            product.in_stock ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {product.in_stock ? "In Stock" : "Out"}
                      </button>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <button
                        onClick={() => toggleFeatured(product.id, !product.featured)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          product.featured
                            ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                            : "bg-muted text-muted-foreground hover:bg-muted/70"
                        }`}
                        title={product.featured ? "Unfeature" : "Feature"}
                      >
                        <Star
                          className={`w-4 h-4 ${product.featured ? "fill-amber-400" : ""}`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {formOpen && (
          <ProductFormModal
            product={editingProduct}
            categories={categories}
            onClose={() => setFormOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            product={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
