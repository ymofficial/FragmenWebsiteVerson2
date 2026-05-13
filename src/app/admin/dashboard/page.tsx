"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, PlusCircle, ShoppingBag, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setStats(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statItems = [
    { label: "Total Products", value: loading ? "..." : stats.totalProducts, icon: Package, href: "/admin/products" },
    { label: "Total Orders",   value: loading ? "..." : stats.totalOrders, icon: ShoppingBag, href: "/admin/orders" },
    { label: "Revenue",        value: loading ? "..." : `${Math.round(stats.totalRevenue)} Tk`, icon: TrendingUp, href: "/admin/orders" },
    { label: "Add New",        value: "+",  icon: PlusCircle, href: "/admin/products/new" },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10">
        <h2 className="text-2xl font-light tracking-[0.2em] uppercase">Dashboard</h2>
        <p className="text-sm text-black/40 mt-1">Welcome back, Admin.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statItems.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="bg-white border border-black/5 p-8 hover:border-black/20 transition-all group hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">{s.label}</span>
                <Icon size={16} className="text-black/30 group-hover:text-black transition-colors" />
              </div>
              <p className="text-3xl font-light tracking-tight">{s.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-white border border-black/5 p-10">
        <h3 className="text-sm font-medium tracking-[0.2em] uppercase mb-8 border-b border-black/5 pb-6">Quick Actions</h3>
        <div className="flex flex-wrap gap-6">
          <Link href="/admin/products/new" className="px-8 py-4 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black/85 transition-all">
            Add New Product
          </Link>
          <Link href="/admin/products" className="px-8 py-4 border border-black text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black hover:text-white transition-all">
            Manage Inventory
          </Link>
          <Link href="/admin/orders" className="px-8 py-4 border border-black/10 text-[10px] uppercase tracking-[0.3em] font-bold hover:border-black transition-all">
            Manage Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
