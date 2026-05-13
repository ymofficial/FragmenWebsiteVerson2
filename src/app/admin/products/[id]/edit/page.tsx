"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";

const CATEGORIES = ["Perfume", "Attar"];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "",
    brand: "Fragmen",
    description: "",
    price: "",
    stockQuantity: "",
    category: "Perfume",
    fragranceNotes: { top: "", heart: "", base: "" },
    sizes: [
      { label: "15ml", title: "Standard", price: "" },
      { label: "6ml", title: "Sample", price: "" }
    ],
    inStock: true,
  });

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          brand: data.brand || "Fragmen",
          description: data.description || "",
          price: data.price ? data.price.toString() : "",
          stockQuantity: data.stockQuantity ? data.stockQuantity.toString() : "0",
          category: data.category || "Perfume",
          fragranceNotes: {
            top: data.fragranceNotes?.top?.join(", ") || "",
            heart: data.fragranceNotes?.heart?.join(", ") || "",
            base: data.fragranceNotes?.base?.join(", ") || "",
          },
          sizes: data.sizes?.length > 0 ? data.sizes.map((s: any) => ({ ...s, price: s.price.toString() })) : [
            { label: "15ml", title: "Standard", price: "" },
            { label: "6ml", title: "Sample", price: "" }
          ],
          inStock: data.inStock ?? true,
        });
        setImageUrls(data.imageUrls || []);
        setInitialLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setInitialLoading(false);
      });
  }, [id]);

  const set = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));
  const setSizePrice = (index: number, priceValue: string) => {
    const newSizes = [...form.sizes];
    newSizes[index] = { ...newSizes[index], price: priceValue };
    set("sizes", newSizes);
  };
  const setNote = (key: "top" | "heart" | "base", value: string) =>
    setForm((prev) => ({ ...prev, fragranceNotes: { ...prev.fragranceNotes, [key]: value } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrls.length === 0) return alert("Please upload at least one image.");
    setLoading(true);

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stockQuantity: parseInt(form.stockQuantity),
      sizes: form.sizes.map(s => ({ ...s, price: parseFloat(s.price) || 0 })),
      fragranceNotes: {
        top:   form.fragranceNotes.top.split(",").map((s) => s.trim()).filter(Boolean),
        heart: form.fragranceNotes.heart.split(",").map((s) => s.trim()).filter(Boolean),
        base:  form.fragranceNotes.base.split(",").map((s) => s.trim()).filter(Boolean),
      },
      imageUrls,
    };

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Product updated successfully!");
        router.push("/admin/products");
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="p-10 opacity-50 uppercase tracking-widest text-xs">Loading product data...</div>;
  }

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-2xl font-light tracking-[0.2em] uppercase">Edit Product</h2>
        <p className="text-sm text-black/40 mt-1">Update the details of the fragrance.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-black/5 p-6 space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-4">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Product Name *</label>
                <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                  className="w-full px-3 py-2.5 border border-black/10 focus:border-black focus:outline-none text-sm" placeholder="Midnight Oud" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Category *</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)}
                  className="w-full px-3 py-2.5 border border-black/10 focus:border-black focus:outline-none text-sm bg-white">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Description *</label>
              <textarea required value={form.description} onChange={(e) => set("description", e.target.value)}
                rows={4} className="w-full px-3 py-2.5 border border-black/10 focus:border-black focus:outline-none text-sm resize-none"
                placeholder="Describe the fragrance story, inspiration, and feel..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Base Price (Tk) *</label>
                <input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => set("price", e.target.value)}
                  className="w-full px-3 py-2.5 border border-black/10 focus:border-black focus:outline-none text-sm" placeholder="99.00" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Stock Qty *</label>
                <input required type="number" min="0" value={form.stockQuantity} onChange={(e) => set("stockQuantity", e.target.value)}
                  className="w-full px-3 py-2.5 border border-black/10 focus:border-black focus:outline-none text-sm" placeholder="50" />
              </div>
            </div>
          </div>

          {/* Size Pricing */}
          <div className="bg-white border border-black/5 p-6 space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-4">Size Pricing (Tk)</h3>
            <div className="grid grid-cols-2 gap-4">
              {form.sizes.map((sizeObj, idx) => (
                <div key={idx}>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">{sizeObj.label} ({sizeObj.title}) Price *</label>
                  <input required type="number" min="0" value={sizeObj.price} onChange={(e) => setSizePrice(idx, e.target.value)}
                    className="w-full px-3 py-2.5 border border-black/10 focus:border-black focus:outline-none text-sm" placeholder="Price for this size" />
                </div>
              ))}
            </div>
          </div>

          {/* Fragrance Notes */}
          <div className="bg-white border border-black/5 p-6 space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-4">Fragrance Notes <span className="text-black/20">(comma separated)</span></h3>
            {(["top", "heart", "base"] as const).map((note) => (
              <div key={note}>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">{note} Notes</label>
                <input value={form.fragranceNotes[note]} onChange={(e) => setNote(note, e.target.value)}
                  className="w-full px-3 py-2.5 border border-black/10 focus:border-black focus:outline-none text-sm"
                  placeholder={note === "top" ? "Bergamot, Lemon, Neroli" : note === "heart" ? "Rose, Jasmine, Iris" : "Sandalwood, Musk, Vanilla"} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Images */}
          <div className="bg-white border border-black/5 p-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-4 mb-4">Product Images *</h3>

            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImageUrls((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-black text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res) setImageUrls((prev) => [...prev, ...res.map((r) => r.url)]);
              }}
              onUploadError={(err) => alert(`Upload error: ${err.message}`)}
              appearance={{
                container: "border-dashed border-black/20 bg-transparent py-6 cursor-pointer",
                button: "bg-black text-white text-[10px] uppercase tracking-widest px-6 py-3 mt-4",
                label: "text-black/40 text-xs",
                allowedContent: "text-black/30 text-[10px]",
              }}
            />
          </div>

          {/* Status */}
          <div className="bg-white border border-black/5 p-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-4 mb-4">Status</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.inStock} onChange={(e) => set("inStock", e.target.checked)} className="w-4 h-4 accent-black" />
              <span className="text-sm">In Stock</span>
            </label>
          </div>

          <button type="submit" disabled={loading || imageUrls.length === 0}
            className="w-full py-4 bg-black text-white text-[11px] font-semibold tracking-[0.3em] uppercase hover:bg-black/85 transition-colors disabled:opacity-40">
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
