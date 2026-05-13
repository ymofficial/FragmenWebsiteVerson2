"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center justify-between mb-16 text-sm uppercase tracking-[0.2em] border-y border-black/5 dark:border-white/5 py-6">
      <div className="flex items-center gap-6 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
        <span className="opacity-40 text-[10px] whitespace-nowrap">Filter By:</span>
        <select
          className="bg-transparent border-b border-black/20 dark:border-white/20 pb-1 focus:outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer text-xs"
          defaultValue={searchParams.get("volume") || ""}
          onChange={(e) => router.push(`/?${createQueryString("volume", e.target.value)}`, { scroll: false })}
        >
          <option value="" className="text-black">All Volumes</option>
          <option value="50ml" className="text-black">50ml</option>
          <option value="100ml" className="text-black">100ml</option>
        </select>

        <label className="flex items-center gap-2 cursor-pointer text-xs group whitespace-nowrap">
          <input
            type="checkbox"
            className="accent-black dark:accent-white w-3 h-3"
            defaultChecked={searchParams.get("inStock") === "true"}
            onChange={(e) => {
              if (e.target.checked) {
                router.push(`/?${createQueryString("inStock", "true")}`, { scroll: false });
              } else {
                router.push(`/?${createQueryString("inStock", "")}`, { scroll: false });
              }
            }}
          />
          <span className="opacity-60 group-hover:opacity-100 transition-opacity">In Stock Only</span>
        </label>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
        <span className="opacity-40 text-[10px]">Sort By:</span>
        <select
          className="bg-transparent border-b border-black/20 dark:border-white/20 pb-1 focus:outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer text-xs"
          defaultValue={searchParams.get("sort") || "newest"}
          onChange={(e) => router.push(`/?${createQueryString("sort", e.target.value)}`, { scroll: false })}
        >
          <option value="newest" className="text-black">Newest</option>
          <option value="price_asc" className="text-black">Price: Low to High</option>
          <option value="price_desc" className="text-black">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
