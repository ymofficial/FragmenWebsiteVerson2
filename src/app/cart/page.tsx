"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-light tracking-[0.3em] uppercase mb-6 opacity-30">Your Cart is Empty</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-12">Discovery awaits in our collection.</p>
        <Link href="/" className="px-12 py-4 bg-black text-white text-[11px] font-semibold tracking-[0.3em] uppercase hover:bg-black/85 transition-colors">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-24">
      <h1 className="text-3xl font-light tracking-[0.4em] uppercase mb-16 text-center">Your Selection</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-12">
          {cart.map((item) => (
            <div key={item._id} className="flex gap-6 md:gap-10 pb-12 border-b border-black/5 items-center">
              <div className="relative w-24 md:w-32 aspect-[3/4] bg-black/5 overflow-hidden shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-black/30 mb-1">{item.brand}</p>
                    <h3 className="text-sm font-semibold tracking-[0.2em] uppercase">{item.name}</h3>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="opacity-30 hover:opacity-100 transition-opacity">
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                </div>
                
                <p className="text-xs font-light mb-6">{Math.round(item.price)} Tk</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-black/10">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-2 hover:bg-black/5 transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-2 hover:bg-black/5 transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="text-xs font-medium ml-auto">{Math.round(item.price * item.quantity)} Tk</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-black/5 p-8 sticky top-32">
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-8 border-b border-black/10 pb-4">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-xs opacity-60">
                <span className="uppercase tracking-widest">Subtotal</span>
                <span>{Math.round(cartTotal)} Tk</span>
              </div>
              <div className="flex justify-between text-xs opacity-60">
                <span className="uppercase tracking-widest">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-black/10 pt-4 mb-8">
              <span className="uppercase tracking-[0.2em]">Total</span>
              <span>{Math.round(cartTotal)} Tk</span>
            </div>
            
            <Link 
              href="/checkout"
              className="w-full bg-black text-white py-5 uppercase tracking-[0.3em] text-xs font-semibold hover:bg-black/85 transition-all flex items-center justify-center gap-3 group"
            >
              Proceed to Checkout
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <p className="mt-6 text-[9px] uppercase tracking-[0.15em] opacity-40 text-center leading-relaxed">
              Taxes and duties included in final price.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
