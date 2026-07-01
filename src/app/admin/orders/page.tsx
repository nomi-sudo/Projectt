"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, Loader as Loader2, Package, Truck, CircleCheck as CheckCircle, Circle as XCircle } from "lucide-react";
import { motion } from "framer-motion";

type Order = {
  id: string;
  status: string;
  total_amount: number;
  shipping_address: any;
  created_at: string;
  order_items: {
    id: string;
    quantity: number;
    price_at_time: number;
    product_id: string;
  }[];
};

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  pending: { color: "bg-amber-100 text-amber-700", icon: Package, label: "Pending" },
  confirmed: { color: "bg-blue-100 text-blue-700", icon: CheckCircle, label: "Confirmed" },
  shipped: { color: "bg-indigo-100 text-indigo-700", icon: Truck, label: "Shipped" },
  delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Delivered" },
  cancelled: { color: "bg-red-100 text-red-700", icon: XCircle, label: "Cancelled" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setOrders(data as Order[]);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (!error) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">{orders.length} total orders</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No orders yet</p>
          <p className="text-muted-foreground/60 text-sm mt-1">
            Orders will appear here once customers start checking out.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const cfg = statusConfig[order.status] ?? statusConfig.pending;
            const StatusIcon = cfg.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-border p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${cfg.color} rounded-xl flex items-center justify-center`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()} ·{" "}
                        {order.order_items?.length ?? 0} items
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-lg font-extrabold text-primary">
                      Rs. {order.total_amount.toLocaleString()}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`text-xs font-bold rounded-full px-3 py-1.5 border-0 cursor-pointer outline-none ${cfg.color}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
