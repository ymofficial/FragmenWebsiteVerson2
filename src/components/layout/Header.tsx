"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, User as UserIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import SearchBar from "./SearchBar";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { cartCount } = useCart();
  
  useEffect(() => {
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => setSession(data))
      .catch(() => setSession({ isLoggedIn: false }));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession({ isLoggedIn: false });
    router.push("/");
    router.refresh();
  };

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 flex justify-between items-center h-24">
        
        {/* Left: Brand Name */}
        <Link href="/" className="text-xl sm:text-2xl font-light tracking-[0.5em] uppercase flex-1">
          Fragmen
        </Link>

        {/* Middle: Navigation Links */}
        <div className="flex gap-10 sm:gap-14 lg:gap-24 text-[11px] sm:text-[13px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-semibold flex-1 justify-center whitespace-nowrap px-4">
          <Link href="/" className="hover:text-black/50 transition-colors text-black">Home</Link>
          <Link href="/#collection" className="hover:text-black/50 transition-colors text-black">Collections</Link>
          <Link href="/support" className="hover:text-black/50 transition-colors text-black">Support</Link>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 flex-1 justify-end">
          <SearchBar />
          
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
              <div className="flex items-center gap-6">
                {session.isAdmin ? (
                  <Link href="/admin/dashboard" className="flex items-center gap-2 group">
                    <UserIcon size={18} strokeWidth={1.5} className="group-hover:opacity-50 transition-opacity" />
                    <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.3em] font-bold hover:text-black/50 transition-colors text-black">
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
                      <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.3em] font-bold hover:text-black/50 transition-colors text-black">
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
    </header>
  );
}



