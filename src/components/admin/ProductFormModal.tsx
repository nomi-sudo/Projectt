"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save, Loader as Loader2, CircleAlert as AlertCircle } from "lucide-react";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import type { Product, Category } from "@/lib/supabase";

interface ProductFormModalProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductFormModal({
  product,
  categories,
  onClose,
}: ProductFormModalProps) {
  const { createProduct, updateProduct } = useAdminProducts();
  const isEdit = !!product;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState("0");
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSlug(product.slug);
      setSlugTouched(true);
      setPrice(String(product.price));
      setCategoryId(product.category_id);
      setSubcategory(product.subcategory);
      setImage(product.image ?? "");
      setRating(String(product.rating));
      setInStock(product.in_stock);
      setFeatured(product.featured);
    } else if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [product, categories]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugTouched && name) {
      setSlug(slugify(name));
    }
  }, [name, slugTouched]);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const validate = (): string | null => {
    if (!name.trim()) return "Product name is required.";
    if (!slug.trim()) return "Slug is required.";
    if (!price || Number(price) < 0) return "Price must be a non-negative number.";
    if (!categoryId) return "Category is required.";
    if (!subcategory.trim()) return "Subcategory is required.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        price: Number(price),
        category_id: categoryId,
        subcategory: subcategory.trim(),
        image: image.trim() || null,
        rating: Number(rating),
        in_stock: inStock,
        featured,
      };

      if (isEdit && product) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-foreground">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AL SHIFA HONEY NATURAL 250GM"
              className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary/30 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
              URL Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              placeholder="auto-generated-from-name"
              className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary/30 focus:bg-white outline-none transition-all font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used in the product URL: /product/{slug || "slug"}
            </p>
          </div>

          {/* Price + Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                Price (Rs.) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary/30 focus:bg-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                Rating (0-5)
              </label>
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="0"
                min="0"
                max="5"
                step="0.1"
                className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary/30 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          {/* Category + Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubcategory("");
                }}
                className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary/30 focus:bg-white outline-none transition-all cursor-pointer"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                Subcategory *
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                disabled={!selectedCategory}
                className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary/30 focus:bg-white outline-none transition-all cursor-pointer disabled:opacity-50"
              >
                <option value="">Select subcategory</option>
                {selectedCategory?.subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
              Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/product-image.jpg"
              className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary/30 focus:bg-white outline-none transition-all"
            />
            {image && (
              <div className="mt-2 flex items-center gap-3">
                <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">Image preview</span>
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setInStock(!inStock)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  inStock ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    inStock ? "translate-x-5" : ""
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-foreground">In Stock</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  featured ? "bg-amber-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    featured ? "translate-x-5" : ""
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-foreground">Featured</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-border rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? "Update Product" : "Create Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
