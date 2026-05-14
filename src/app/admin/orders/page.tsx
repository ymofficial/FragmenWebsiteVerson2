"use client";

import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle2, Clock, MapPin, Phone, User, ExternalLink } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs uppercase tracking-widest opacity-40">Loading Orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-black/5 p-24 text-center">
        <Package size={48} strokeWidth={1} className="mx-auto mb-6 opacity-20" />
        <p className="text-black/30 text-sm uppercase tracking-widest">No orders yet</p>
        <p className="text-black/20 text-xs mt-2">Orders will appear here once customers start purchasing.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10">
        <h2 className="text-2xl font-light tracking-[0.2em] uppercase">Customer Orders</h2>
        <p className="text-sm text-black/40 mt-1">Manage and track all transactions.</p>
      </div>

      <div className="space-y-8">
        {orders.map((order, i) => (
          <div key={order._id} className="bg-white border border-black/5 overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 bg-black/[0.01] border-b border-black/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-6">
                <div className="text-sm font-bold uppercase tracking-widest pt-1 border-r border-black/10 pr-6 min-w-[100px]">
                  Order {orders.length - i}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5">#{order._id.slice(-6)}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-40">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-6 mt-2">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                      <User size={12} className="opacity-40" />
                      {order.shippingAddress.name}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                      <Phone size={12} className="opacity-40" />
                      {order.shippingAddress.phone}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <select 
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="text-[10px] uppercase tracking-widest font-bold border border-black/10 px-4 py-2 bg-white outline-none focus:border-black transition-colors"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="text-sm font-bold ml-4">{Math.round(order.totalAmount)} Tk</div>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Items */}
              <div className="lg:col-span-2 space-y-6">
                <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 border-b border-black/5 pb-2">Purchased Items</h4>
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex gap-6 items-center">
                    <div className="relative w-12 aspect-[3/4] bg-black/5 overflow-hidden">
                      <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold">{item.name}</p>
                      <p className="text-[9px] uppercase tracking-[0.1em] opacity-40">Qty: {item.quantity} × {Math.round(item.price)} Tk</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping */}
              <div>
                <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 border-b border-black/5 pb-2 mb-6">Shipping Details</h4>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <MapPin size={16} className="shrink-0 opacity-20" />
                    <div className="text-[10px] uppercase tracking-widest leading-relaxed">
                      <p className="font-bold">{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city} {order.shippingAddress.postalCode}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Truck size={16} className="shrink-0 opacity-20" />
                    <div className="text-[10px] uppercase tracking-widest leading-relaxed">
                      <p className="opacity-40">Method</p>
                      <p className="font-bold">{order.paymentMethod}</p>
                    </div>
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
