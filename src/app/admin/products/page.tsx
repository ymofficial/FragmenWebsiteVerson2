"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stockQuantity: number;
  inStock: boolean;
  imageUrls: string[];
}

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false); });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-light tracking-[0.2em] uppercase">All Products</h2>
          <p className="text-sm text-black/40 mt-1">{products.length} products in collection</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 px-5 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-black/80 transition-colors">
          <PlusCircle size={14} /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-black/30 text-sm uppercase tracking-widest">Loading...</div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-black/5 p-12 text-center">
          <p className="text-black/30 text-sm uppercase tracking-widest">No products yet</p>
          <Link href="/admin/products/new" className="inline-block mt-4 text-xs uppercase tracking-widest underline text-black/50 hover:text-black">Add your first product</Link>
        </div>
      ) : (
        <div className="bg-white border border-black/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-black/5">
              <tr className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                <th className="text-left px-6 py-4">Product</th>
                <th className="text-left px-6 py-4 hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-4">Price</th>
                <th className="text-left px-6 py-4 hidden sm:table-cell">Stock</th>
                <th className="text-left px-6 py-4 hidden sm:table-cell">Status</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p._id} className={`border-b border-black/5 hover:bg-black/[0.02] transition-colors ${i === products.length - 1 ? 'border-none' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {p.imageUrls?.[0] && (
                        <img src={p.imageUrls[0]} alt={p.name} className="w-10 h-12 object-cover bg-gray-100" />
                      )}
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-black/40">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-black/60 text-xs">{p.category}</td>
                  <td className="px-6 py-4">{Math.round(p.price)} Tk</td>
                  <td className="px-6 py-4 hidden sm:table-cell text-black/60">{p.stockQuantity}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-1 ${p.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {p.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-3 justify-end">
                      <Link href={`/admin/products/${p._id}/edit`} className="text-black/30 hover:text-black transition-colors"><Pencil size={14} /></Link>
                      <button onClick={() => handleDelete(p._id)} className="text-black/30 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
