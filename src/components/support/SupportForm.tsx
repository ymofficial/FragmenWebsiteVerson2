"use client";

import { useState } from "react";

export default function SupportForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Error sending message.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
        <h3 className="text-xl font-light tracking-widest uppercase mb-4">Message Received</h3>
        <p className="text-[10px] uppercase tracking-widest opacity-40">Thank you for reaching out. We will get back to you shortly.</p>
        <button onClick={() => setSuccess(false)} className="mt-8 text-[9px] uppercase tracking-[0.3em] border-b border-black pb-1 hover:opacity-50 transition-opacity">Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2 border-b border-black/10 pb-2">
          <input 
            required
            type="text" 
            placeholder="NAME" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-transparent text-[11px] uppercase tracking-widest outline-none placeholder:opacity-20" 
          />
        </div>
        <div className="space-y-2 border-b border-black/10 pb-2">
          <input 
            required
            type="email" 
            placeholder="EMAIL" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-transparent text-[11px] uppercase tracking-widest outline-none placeholder:opacity-20" 
          />
        </div>
      </div>
      <div className="space-y-2 border-b border-black/10 pb-2">
        <textarea 
          required
          placeholder="MESSAGE" 
          rows={4} 
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-transparent text-[11px] uppercase tracking-widest outline-none placeholder:opacity-20 resize-none"
        ></textarea>
      </div>
      <button 
        disabled={loading}
        className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-black/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
