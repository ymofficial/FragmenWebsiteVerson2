"use client";

import { useState, useEffect } from "react";
import { Mail, Clock, CheckCircle, Trash2 } from "lucide-react";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const res = await fetch("/api/support");
    const data = await res.json();
    setMessages(data);
    setLoading(false);
  };

  if (loading) return <div className="p-10 uppercase text-xs tracking-widest opacity-40">Loading messages...</div>;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-light tracking-[0.2em] uppercase">Customer Inquiries</h2>
        <p className="text-sm text-black/40 mt-1">Messages received from the support page.</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white border border-black/5 p-12 text-center">
            <Mail className="mx-auto text-black/10 mb-4" size={48} strokeWidth={1} />
            <p className="text-[10px] uppercase tracking-widest opacity-30">No messages found</p>
          </div>
        ) : (
          messages.map((msg: any) => (
            <div key={msg._id} className="bg-white border border-black/5 p-8 flex flex-col md:flex-row gap-8 hover:border-black/20 transition-all group">
              <div className="md:w-64 shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${msg.status === 'unread' ? 'bg-black' : 'bg-green-500'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{msg.name}</span>
                </div>
                <p className="text-[10px] tracking-wider opacity-40 mb-4">{msg.email}</p>
                <div className="flex items-center gap-2 text-black/30 text-[9px] uppercase tracking-widest">
                  <Clock size={12} />
                  {new Date(msg.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex-1">
                <p className="text-sm font-light leading-relaxed opacity-80 whitespace-pre-line">
                  {msg.message}
                </p>
              </div>

              <div className="flex md:flex-col gap-4 justify-center">
                <button className="p-3 bg-black/[0.03] hover:bg-black hover:text-white transition-all rounded-full" title="Mark as Read">
                  <CheckCircle size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
