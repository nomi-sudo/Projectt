"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/supabase";
import { Plus, Pencil, Trash2, X, Save, Loader as Loader2, FolderTree } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subcategories, setSubcategories] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!err && data) {
      setCategories(
        data.map((c) => ({
          ...c,
          subcategories: Array.isArray(c.subcategories) ? c.subcategories : [],
        })) as Category[]
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openAdd = () => {
    setEditing(null);
    setName("");
    setSlug("");
    setSubcategories("");
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setSubcategories(cat.subcategories.join("\n"));
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.");
      return;
    }

    setSaving(true);
    setError(null);

    const subs = subcategories
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      subcategories: subs,
      sort_order: editing?.sort_order ?? categories.length + 1,
    };

    try {
      if (editing) {
        const { error: err } = await supabase
          .from("categories")
          .update(payload)
          .eq("id", editing.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("categories").insert(payload);
        if (err) throw err;
      }
      setModalOpen(false);
      await fetchCategories();
    } catch (err: any) {
      setError(err.message ?? "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? All products in it will also be deleted.")) return;
    const { error: err } = await supabase.from("categories").delete().eq("id", id);
    if (err) {
      alert("Failed to delete: " + err.message);
      return;
    }
    await fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {categories.length} categories in catalog
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm shadow-lg shadow-primary/30"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-2xl border border-border animate-pulse" />
            ))
          : categories.map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <FolderTree className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-foreground">{cat.name}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">/{cat.slug}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {cat.subcategories.length} subcategories
                </p>
              </motion.div>
            ))}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg"
            >
              <div className="border-b border-border px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">
                  {editing ? "Edit Category" : "Add Category"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">{error}</p>
                )}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editing) setSlug(e.target.value.toLowerCase().replace(/ /g, "-"));
                    }}
                    placeholder="e.g. Grocery"
                    className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="grocery"
                    className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:bg-white outline-none transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
                    Subcategories (one per line)
                  </label>
                  <textarea
                    value={subcategories}
                    onChange={(e) => setSubcategories(e.target.value)}
                    placeholder={"Breakfast\nDairy\nSnacks"}
                    rows={6}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:bg-white outline-none transition-all resize-y"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
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
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editing ? "Update" : "Create"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
