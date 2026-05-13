"use client";

import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        } catch (err) {
          console.error("Search failed", err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (id: string) => {
    router.push(`/products/${id}`);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-[120px] sm:max-w-[300px]">
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full bg-black/[0.03] border border-black/10 px-8 sm:px-10 py-2 sm:py-2.5 text-[10px] sm:text-[11px] uppercase tracking-widest focus:ring-0 focus:border-black focus:bg-white transition-all outline-none"
        />
        <SearchIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (results.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/5 shadow-2xl z-[100] max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-[10px] uppercase tracking-widest text-center opacity-30">Searching...</div>
          ) : (
            <div className="py-2">
              {results.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleSelect(product._id)}
                  className="w-full flex gap-4 p-3 hover:bg-black/[0.02] transition-colors text-left group"
                >
                  <div className="relative w-12 aspect-[3/4] bg-black/5 overflow-hidden">
                    <Image src={product.imageUrls?.[0] || ""} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-[8px] uppercase tracking-widest text-black/30 group-hover:text-black/50 transition-colors">{product.brand}</p>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1">{product.name}</h4>
                    <p className="text-[10px] font-medium opacity-60">{Math.round(product.price)} Tk</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
