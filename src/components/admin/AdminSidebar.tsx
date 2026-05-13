"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  LogOut,
  ExternalLink,
  Mail,
} from "lucide-react";

const navItems = [
  { label: "View Website",   href: "/",                icon: ExternalLink },
  { label: "Dashboard",      href: "/admin/dashboard",  icon: LayoutDashboard },
  { label: "All Products",   href: "/admin/products",   icon: Package },
  { label: "Add Product",  href: "/admin/products/new", icon: PlusCircle },
  { label: "Orders",       href: "/admin/orders",     icon: ShoppingBag },
  { label: "Messages",     href: "/admin/messages",   icon: Mail },
  { label: "Site Pages",   href: "/admin/pages",      icon: LayoutDashboard },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-64 min-h-screen bg-black text-white flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-8 py-8 border-b border-white/10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">Admin Portal</p>
        <h1 className="text-xl font-light tracking-[0.4em] uppercase">Fragmen</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded text-sm tracking-wide transition-colors ${
                active
                  ? "bg-white text-black font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-8 border-t border-white/10 pt-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
