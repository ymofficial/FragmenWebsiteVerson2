"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, User as UserIcon, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import SearchBar from "./SearchBar";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  
  useEffect(() => {
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => setSession(data))
      .catch(() => setSession({ isLoggedIn: false }));
  }, [pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession({ isLoggedIn: false });
    router.push("/");
    router.refresh();
  };

  if (pathname.startsWith("/admin")) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/#collection" },
    { name: "Support", href: "/support" },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 flex justify-between items-center h-20 sm:h-24">
        
        {/* Left: Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 -ml-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>

        {/* Left/Center: Brand Name */}
        <Link href="/" className="text-lg sm:text-2xl font-light tracking-[0.4em] sm:tracking-[0.5em] uppercase lg:flex-1">
          Fragmen
        </Link>

        {/* Middle: Desktop Navigation */}
        <nav className="hidden lg:flex gap-10 xl:gap-24 text-[11px] xl:text-[13px] uppercase tracking-[0.3em] font-semibold flex-1 justify-center whitespace-nowrap px-4">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-black/50 transition-colors text-black">
              {link.name}
            </Link>
          ))}
        </nav>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-6 lg:gap-8 flex-1 justify-end">
          <div className="hidden sm:block">
            <SearchBar />
          </div>
          
          <Link href="/cart" className="relative group p-2 shrink-0">
            <ShoppingBag size={20} strokeWidth={1.5} className="group-hover:opacity-50 transition-opacity" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-0 text-[8px] font-bold bg-black text-white w-4 h-4 flex items-center justify-center rounded-full scale-75 group-hover:scale-90 transition-transform">
                {cartCount}
              </span>
            )}
          </Link>
          
          <div className="relative">
            {session?.isLoggedIn ? (
              <div className="flex items-center">
                {session.isAdmin ? (
                  <Link href="/admin/dashboard" className="flex items-center gap-2 group">
                    <UserIcon size={18} strokeWidth={1.5} className="group-hover:opacity-50 transition-opacity" />
                    <span className="hidden sm:block text-[11px] sm:text-[12px] uppercase tracking-[0.3em] font-bold hover:text-black/50 transition-colors text-black">
                      {session.user?.name || "Admin"}
                    </span>
                  </Link>
                ) : (
                  <div className="relative">
                    <button 
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 group"
                    >
                      <UserIcon size={18} strokeWidth={1.5} className="group-hover:opacity-50 transition-opacity" />
                      <span className="hidden sm:block text-[11px] sm:text-[12px] uppercase tracking-[0.3em] font-bold hover:text-black/50 transition-colors text-black">
                        {session.user?.name || "Profile"}
                      </span>
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-4 w-48 bg-white border border-black/5 shadow-xl py-2 z-[100] animate-in fade-in slide-in-from-top-2">
                        <Link 
                          href="/orders" 
                          className="block px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-black/5 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          My Orders
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-black/5 text-red-500 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-[11px] sm:text-[12px] uppercase tracking-[0.3em] font-bold hover:text-black/50 transition-colors text-black">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-white z-[100] animate-in slide-in-from-left duration-300">
          <nav className="flex flex-col p-8 space-y-8">
            <div className="pb-4">
              <SearchBar />
            </div>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-lg font-light uppercase tracking-[0.3em] border-b border-black/5 pb-4"
              >
                {link.name}
              </Link>
            ))}
            {session?.isLoggedIn && (
              <Link href="/orders" className="text-lg font-light uppercase tracking-[0.3em] border-b border-black/5 pb-4">
                My Orders
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
