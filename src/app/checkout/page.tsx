"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, CreditCard, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    if (cart.length === 0 && !success) {
      router.push("/cart");
    }
  }, [cart, router, success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({
            product: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          totalAmount: cartTotal,
          shippingAddress: formData
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setOrderId(data.orderId);
        clearCart();
      } else if (res.status === 401) {
        router.push("/login?redirect=/checkout");
      } else {
        alert(data.error || "Failed to place order");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-10">
          <CheckCircle2 size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-light tracking-[0.4em] uppercase mb-6">Order Confirmed</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-4">Your order ID is: <span className="font-bold text-black">{orderId}</span></p>
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-12">Thank you for choosing Fragmen. We are preparing your selection.</p>
        <Link href="/" className="px-12 py-4 bg-black text-white text-[11px] font-semibold tracking-[0.3em] uppercase hover:bg-black/85 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
      <Link href="/cart" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity mb-16">
        <ArrowLeft size={12} /> Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Checkout Form */}
        <div>
          <h2 className="text-2xl font-light tracking-[0.3em] uppercase mb-12">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] opacity-40">Recipient Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-0 py-3 border-b border-black/10 focus:border-black focus:outline-none transition-colors bg-transparent text-sm"
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] opacity-40">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-0 py-3 border-b border-black/10 focus:border-black focus:outline-none transition-colors bg-transparent text-sm"
                  placeholder="+880 1XXX XXXXXX"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] opacity-40">Shipping Address</label>
              <input
                required
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-0 py-3 border-b border-black/10 focus:border-black focus:outline-none transition-colors bg-transparent text-sm"
                placeholder="Street Address, House/Flat No."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] opacity-40">City</label>
                <input
                  required
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-0 py-3 border-b border-black/10 focus:border-black focus:outline-none transition-colors bg-transparent text-sm"
                  placeholder="Dhaka"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] opacity-40">Postal Code</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-0 py-3 border-b border-black/10 focus:border-black focus:outline-none transition-colors bg-transparent text-sm"
                  placeholder="1200"
                />
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-6">Payment Method</h3>
              <div className="flex items-center gap-4 p-5 border border-black text-xs uppercase tracking-widest font-semibold">
                <CreditCard size={16} />
                Cash on Delivery
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-black text-white text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-black/85 transition-colors disabled:opacity-50"
            >
              {loading ? "Processing..." : `Complete Order — ${Math.round(cartTotal)} Tk`}
            </button>
          </form>
        </div>

        {/* Order Summary Side */}
        <div className="bg-black/5 p-12">
          <h2 className="text-xs uppercase tracking-[0.4em] font-bold mb-12 border-b border-black/10 pb-6">Your Selection</h2>
          <div className="space-y-8 mb-12">
            {cart.map((item) => (
              <div key={item._id} className="flex gap-6 items-center">
                <div className="relative w-16 aspect-[3/4] bg-black/5 shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1">{item.name}</h4>
                  <p className="text-[9px] uppercase tracking-[0.1em] opacity-40">Qty: {item.quantity}</p>
                </div>
                <p className="text-[10px] font-bold">{Math.round(item.price * item.quantity)} Tk</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t border-black/10 pt-8">
            <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-60">
              <span>Subtotal</span>
              <span>{Math.round(cartTotal)} Tk</span>
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-60">
              <span>Shipping</span>
              <span>0 Tk</span>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-[0.2em] pt-4">
              <span>Total</span>
              <span>{Math.round(cartTotal)} Tk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
