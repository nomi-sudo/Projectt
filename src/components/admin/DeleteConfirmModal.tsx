"use client";

import { motion } from "framer-motion";
import { AlertTriangle, X, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/supabase";

interface DeleteConfirmModalProps {
  product: Product;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  product,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">Delete Product?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This action cannot be undone. The product will be permanently removed from
                your catalog.
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              {product.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {product.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Rs. {product.price.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 border border-border rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={deleting}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
