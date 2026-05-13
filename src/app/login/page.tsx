"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/admin/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user?.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/";
        }
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Back to Home */}
      <div className="p-8">
        <Link href="/" className="text-[10px] uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">
          &larr; Back to Fragmen
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 pb-24">
        <div className="w-full max-w-[400px]">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-light tracking-[0.4em] uppercase mb-4">Fragmen</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-[10px] uppercase tracking-widest px-4 py-3 text-center">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-black/10 focus:border-black focus:outline-none text-sm transition-colors"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Email Address</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-black/10 focus:border-black focus:outline-none text-sm transition-colors"
                placeholder="email@example.com"
              />
            </div>

            <div className="animate-in fade-in slide-in-from-top-6 duration-500">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Password</label>
              <input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-black/10 focus:border-black focus:outline-none text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white text-[11px] font-semibold tracking-[0.3em] uppercase hover:bg-black/85 transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-black/5">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors cursor-pointer"
            >
              {isLogin ? (
                <span>Don't have an account? <span className="text-black font-bold border-b border-black/20 pb-0.5 ml-1">Sign Up</span></span>
              ) : (
                <span>Already have an account? <span className="text-black font-bold border-b border-black/20 pb-0.5 ml-1">Login</span></span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
