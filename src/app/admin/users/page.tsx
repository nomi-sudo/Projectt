"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Loader as Loader2 } from "lucide-react";

export default function AdminUsersPage() {
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("orders")
      .select("user_id", { count: "exact", head: true })
      .then(({ data }) => {
        const uniqueUsers = new Set((data ?? []).map((d: any) => d.user_id));
        setUserCount(uniqueUsers.size);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">Registered customer accounts</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">{userCount}</p>
          <p className="text-sm text-muted-foreground mt-1">Customers with orders</p>
          <p className="text-xs text-muted-foreground/60 mt-4 max-w-sm mx-auto">
            User management is handled through Supabase Auth. Full user listing requires
            service-role access which is not exposed to the client.
          </p>
        </div>
      )}
    </div>
  );
}
