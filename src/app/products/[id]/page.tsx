"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useCart } from "@/context/CartContext";

async function getProduct(id: string) {
  const res = await fetch(`${window.location.origin}/api/products/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        const rawSizes = data.sizes?.length > 0 ? data.sizes : [
          { label: "6ml", price: data.price * 0.4, title: "Sample" },
          { label: "15ml", price: data.price, title: "Standard" }
        ];
        // Ensure 6ml is on the left (numerical sort)
        const sortedSizes = [...rawSizes].sort((a: any, b: any) => parseInt(a.label) - parseInt(b.label));
        setProduct(data);
        setSelectedSize(sortedSizes.find((s:any) => s.label === "15ml") || sortedSizes[0]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center uppercase tracking-widest opacity-20">Loading...</div>;
  if (!product) notFound();

  const handleAddToCart = () => {
    const itemPrice = selectedSize?.price || product.price;
    const itemToAdd = {
      ...product,
      _id: `${product._id}-${selectedSize?.label || '15ml'}`,
      name: `${product.name} (${selectedSize?.label || '15ml'})`,
      price: itemPrice,
    };
    addToCart(itemToAdd);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="min-h-screen bg-white text-black flex flex-col">
      <div className="flex-1 max-w-[1100px] w-full mx-auto px-6 pt-6 pb-12 lg:pt-8 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        {/* Image Section */}
        <div className="space-y-4 sticky top-24 lg:col-span-5">
          <div className="relative w-full aspect-[4/5] bg-black/5 overflow-hidden">
            <Image
              src={product.imageUrls?.[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80"}
              alt={product.name}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.imageUrls.map((url: string, idx: number) => (
                <div key={idx} className="relative aspect-square bg-black/5 overflow-hidden border border-black/5 hover:border-black/20 transition-colors cursor-pointer">
                  <Image src={url} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="flex flex-col h-full pt-4 lg:col-span-7 lg:pl-12">
          <div className="mb-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-black/30">{product.brand}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] mb-4 uppercase">{product.name}</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-8">{product.category}</p>
          
          <p className="text-2xl font-light mb-12">{Math.round(selectedSize?.price || product.price)} Tk</p>
          
          <div className="mb-12">
            <h3 className="text-xs uppercase tracking-[0.2em] mb-6 border-b border-black/5 pb-2">Description</h3>
            <p className="text-sm md:text-base font-light leading-relaxed opacity-80 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Structured Fragrance Notes */}
          <div className="mb-12 space-y-8">
            <h3 className="text-xs uppercase tracking-[0.2em] border-b border-black/5 pb-2">Fragrance Notes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {product.fragranceNotes?.top?.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">Top Notes</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.fragranceNotes.top.map((note: string, idx: number) => (
                      <span key={idx} className="text-[11px] font-medium">{note}{idx < product.fragranceNotes.top.length - 1 ? "," : ""}</span>
                    ))}
                  </div>
                </div>
              )}
              {product.fragranceNotes?.heart?.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">Heart Notes</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.fragranceNotes.heart.map((note: string, idx: number) => (
                      <span key={idx} className="text-[11px] font-medium">{note}{idx < product.fragranceNotes.heart.length - 1 ? "," : ""}</span>
                    ))}
                  </div>
                </div>
              )}
              {product.fragranceNotes?.base?.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">Base Notes</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.fragranceNotes.base.map((note: string, idx: number) => (
                      <span key={idx} className="text-[11px] font-medium">{note}{idx < product.fragranceNotes.base.length - 1 ? "," : ""}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 opacity-50">Select Size</h3>
            <div className="flex gap-4">
                {(() => {
                   const rawSizes = product.sizes?.length > 0 ? product.sizes : [
                     { label: "6ml", price: product.price * 0.4, title: "Sample" },
                     { label: "15ml", price: product.price, title: "Standard" }
                   ];
                   // Ensure 6ml is on the left
                   const sizesToRender = [...rawSizes].sort((a: any, b: any) => parseInt(a.label) - parseInt(b.label));
                   return sizesToRender.map((sizeObj: any) => (
                  <button
                    key={sizeObj.label}
                    onClick={() => setSelectedSize(sizeObj)}
                    className={`flex flex-col items-center justify-center border px-6 py-3 transition-colors ${
                      selectedSize?.label === sizeObj.label 
                        ? 'border-black bg-black text-white' 
                        : 'border-black/20 hover:border-black/50 text-black'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">{sizeObj.label}</span>
                    <span className={`text-[8px] uppercase tracking-widest mt-1 ${selectedSize?.label === sizeObj.label ? 'opacity-80' : 'opacity-40'}`}>
                      {sizeObj.title}
                    </span>
                  </button>
                 ));
              })()}
            </div>
          </div>

          <div className="mt-auto pt-8">
            {product.inStock ? (
              <button 
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-5 uppercase tracking-[0.3em] text-xs font-semibold hover:bg-black/85 transition-all active:scale-[0.98]"
              >
                {added ? "Added to Cart" : `Add to Cart — ${Math.round(selectedSize?.price || product.price)} Tk`}
              </button>
            ) : (
              <button disabled className="w-full bg-black/10 text-black/40 py-5 uppercase tracking-[0.3em] text-xs font-semibold cursor-not-allowed">
                Currently Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

