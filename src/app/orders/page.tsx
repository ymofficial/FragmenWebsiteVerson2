"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-[10px] uppercase tracking-[0.3em] opacity-40">Loading Orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Package size={48} strokeWidth={1} className="mb-8 opacity-20" />
        <h1 className="text-2xl font-light tracking-[0.3em] uppercase mb-6 opacity-30">No Orders Found</h1>
        <Link href="/" className="px-12 py-4 bg-black text-white text-[11px] font-semibold tracking-[0.3em] uppercase hover:bg-black/85 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-24">
      <h1 className="text-3xl font-light tracking-[0.4em] uppercase mb-16 text-center">Your Orders</h1>
      
      <div className="space-y-12">
        {orders.map((order) => (
          <div key={order._id} className="border border-black/5 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-black/[0.02] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-1">Order ID: {order._id}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 text-[8px] uppercase tracking-[0.3em] font-bold border ${
                  order.status === 'delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                  order.status === 'pending' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                  'bg-black/5 border-black/10'
                }`}>
                  {order.status}
                </span>
                <p className="text-sm font-bold ml-4">{Math.round(order.totalAmount)} Tk</p>
              </div>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex gap-6 items-center">
                  <div className="relative w-16 aspect-[3/4] bg-black/5 overflow-hidden">
                    <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1">{item.name}</h4>
                    <p className="text-[9px] uppercase tracking-[0.1em] opacity-40">Qty: {item.quantity} × {Math.round(item.price)} Tk</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 md:p-8 bg-black/[0.01] border-t border-black/5 flex flex-col md:flex-row justify-between gap-8">
              <div>
                <h5 className="text-[9px] uppercase tracking-[0.3em] font-bold mb-4 opacity-40">Shipping Address</h5>
                <div className="text-[10px] uppercase tracking-widest leading-relaxed">
                  <p className="font-bold mb-1">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city} {order.shippingAddress.postalCode}</p>
                  <p className="mt-2 opacity-60">{order.shippingAddress.phone}</p>
                </div>
              </div>
              
              <div className="flex items-end">
                <div className="flex gap-8">
                  <div className="flex flex-col items-center opacity-20">
                    <Clock size={20} className="mb-2" />
                    <span className="text-[7px] uppercase tracking-widest">Pending</span>
                  </div>
                  <div className="flex flex-col items-center opacity-20">
                    <Truck size={20} className="mb-2" />
                    <span className="text-[7px] uppercase tracking-widest">Shipped</span>
                  </div>
                  <div className="flex flex-col items-center opacity-20">
                    <CheckCircle2 size={20} className="mb-2" />
                    <span className="text-[7px] uppercase tracking-widest">Delivered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
