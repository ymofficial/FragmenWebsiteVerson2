"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing";
import { X, Plus } from "lucide-react";

export default function EditPageContent({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<any>({});

  const defaultSchema: any = {
    home: {
      heroTitle: "Fragmen",
      heroSubtitle: "Discover the essence of elegance. A curated collection of masterful fragrances for the modern connoisseur.",
      heroImage: "https://images.unsplash.com/photo-1615486171448-4fd1cf208462?auto=format&fit=crop&q=80",
      section1Title: "Signature Scents",
      section2Title: "Curated Collections",
      footerDesc: "A SANCTUARY FOR PURE OILS. DEDICATED TO THE ANCIENT ART OF ATTAR MAKING AND THE PRESERVATION OF ORIENTAL OLFACTORY HERITAGE.",
      reviews: [
        { name: "Elena Vassilieva", address: "Dhaka, Bangladesh", review: "Fragmen has achieved the impossible: a perfect balance of heritage and modern edge. A masterpiece.", rating: 5 },
        { name: "Marcus Thorne", address: "Chittagong, Bangladesh", review: "The scent discovery here is exceptional. Every fragrance feels bespoke, telling a story that lingers.", rating: 5 },
        { name: "Sophia Khan", address: "Sylhet, Bangladesh", review: "The texture of these scents is rich, velvety, and undeniably premium. Quality is visible in every note.", rating: 4 }
      ]
    },
    about: {
      title: "About Fragmen",
      description: "We believe in the power of scent."
    },
    contact: {
      email: "hello@fragmen.com",
      phone: "+880 1234 567890"
    },
    support: {
      title: "Customer Support",
      subtitle: "We are here to assist you with your olfactory journey. Feel free to reach out to our artisans.",
      email: "care@fragmen.com",
      phone: "+880 1711 000000",
      whatsapp: "+880 1711 000000",
      address: "House 12, Road 4, Dhanmondi, Dhaka, Bangladesh",
      faqs: [
        { q: "How long does the scent last?", a: "Our pure attars typically last 8-12 hours on skin and up to 48 hours on clothing." },
        { q: "Do you ship internationally?", a: "Yes, we ship our artisanal oils globally via express courier services." },
        { q: "Are these oils pure?", a: "Every drop is guaranteed pure, undiluted, and free from any synthetic extenders." }
      ]
    }
  };

  useEffect(() => {
    fetch(`/api/content/${pageId}`)
      .then(res => res.json())
      .then(data => {
        const defaults = defaultSchema[pageId] || {};
        setContent({ ...defaults, ...(data.content || {}) });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [pageId]);

  const set = (field: string, value: any) => {
    setContent((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleReviewChange = (index: number, field: string, value: any) => {
    const newReviews = [...(content.reviews || [])];
    newReviews[index] = { ...newReviews[index], [field]: value };
    set("reviews", newReviews);
  };

  const removeReview = (index: number) => {
    const newReviews = [...(content.reviews || [])];
    newReviews.splice(index, 1);
    set("reviews", newReviews);
  };

  const addReview = () => {
    const newReviews = [...(content.reviews || [])];
    newReviews.push({ name: "", address: "", review: "", rating: 5 });
    set("reviews", newReviews);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/content/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        alert("Content saved successfully!");
        router.push("/admin/pages");
      } else {
        alert("Failed to save content.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving content.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 uppercase text-xs tracking-widest opacity-40">Loading...</div>;

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-2xl font-light tracking-[0.2em] uppercase">Edit {pageId}</h2>
        <p className="text-sm text-black/40 mt-1">Update the text and images for this page.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        {pageId === "home" && (
          <>
            <div className="bg-white border border-black/5 p-6 space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-4">Hero Section</h3>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Hero Title</label>
                <input value={content.heroTitle || ""} onChange={(e) => set("heroTitle", e.target.value)}
                  className="w-full px-3 py-2.5 border border-black/10 focus:border-black focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Hero Subtitle</label>
                <textarea value={content.heroSubtitle || ""} onChange={(e) => set("heroSubtitle", e.target.value)} rows={3}
                  className="w-full px-3 py-2.5 border border-black/10 focus:border-black focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Hero Background Image</label>
                {content.heroImage && (
                  <div className="mb-4 aspect-video w-full max-w-sm overflow-hidden bg-black/5">
                    <img src={content.heroImage} alt="Hero" className="w-full h-full object-cover" />
                  </div>
                )}
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]) set("heroImage", res[0].url);
                  }}
                  onUploadError={(err) => alert(`Upload error: ${err.message}`)}
                  appearance={{
                    container: "border-dashed border-black/20 bg-transparent py-4 cursor-pointer",
                    button: "bg-black text-white text-[10px] uppercase tracking-widest px-4 py-2 mt-2",
                  }}
                />
              </div>
            </div>

            <div className="bg-white border border-black/5 p-6 space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-4">Customer Reviews</h3>
              <div className="space-y-6">
                {(content.reviews || []).map((rev: any, idx: number) => (
                  <div key={idx} className="relative p-4 border border-black/10 bg-black/[0.02]">
                    <button type="button" onClick={() => removeReview(idx)}
                      className="absolute top-4 right-4 text-black/40 hover:text-red-500 transition-colors">
                      <X size={16} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Reviewer Name</label>
                        <input required value={rev.name || ""} onChange={(e) => handleReviewChange(idx, "name", e.target.value)}
                          className="w-full px-3 py-2 border border-black/10 text-sm" placeholder="Elena Vassilieva" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Address</label>
                        <input required value={rev.address || ""} onChange={(e) => handleReviewChange(idx, "address", e.target.value)}
                          className="w-full px-3 py-2 border border-black/10 text-sm" placeholder="Dhaka, Bangladesh" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Rating (1-5)</label>
                        <input required type="number" min="1" max="5" value={rev.rating || 5} onChange={(e) => handleReviewChange(idx, "rating", parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-black/10 text-sm" placeholder="5" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Review Text</label>
                      <textarea required value={rev.review || ""} onChange={(e) => handleReviewChange(idx, "review", e.target.value)} rows={3}
                        className="w-full px-3 py-2 border border-black/10 text-sm resize-none" placeholder="The scent discovery here is exceptional..." />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addReview}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
                  <Plus size={14} /> Add Review
                </button>
              </div>
            </div>

            <div className="bg-white border border-black/5 p-6 space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-4">Sections & Footer</h3>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Signature Scents Title</label>
                <input value={content.section1Title || ""} onChange={(e) => set("section1Title", e.target.value)}
                  className="w-full px-3 py-2.5 border border-black/10 focus:border-black focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Curated Collections Title</label>
                <input value={content.section2Title || ""} onChange={(e) => set("section2Title", e.target.value)}
                  className="w-full px-3 py-2.5 border border-black/10 focus:border-black focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Footer Description</label>
                <textarea value={content.footerDesc || ""} onChange={(e) => set("footerDesc", e.target.value)} rows={3}
                  className="w-full px-3 py-2.5 border border-black/10 focus:border-black focus:outline-none text-sm" />
              </div>
            </div>
          </>
        )}

        {pageId === "support" && (
          <div className="space-y-8">
            <div className="bg-white border border-black/5 p-6 space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-4">Page Header</h3>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Title</label>
                <input value={content.title || ""} onChange={(e) => set("title", e.target.value)}
                  className="w-full px-3 py-2.5 border border-black/10 text-sm" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Subtitle</label>
                <textarea value={content.subtitle || ""} onChange={(e) => set("subtitle", e.target.value)} rows={3}
                  className="w-full px-3 py-2.5 border border-black/10 text-sm" />
              </div>
            </div>

            <div className="bg-white border border-black/5 p-6 space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Email Address</label>
                  <input value={content.email || ""} onChange={(e) => set("email", e.target.value)}
                    className="w-full px-3 py-2.5 border border-black/10 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Phone Number</label>
                  <input value={content.phone || ""} onChange={(e) => set("phone", e.target.value)}
                    className="w-full px-3 py-2.5 border border-black/10 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">WhatsApp</label>
                  <input value={content.whatsapp || ""} onChange={(e) => set("whatsapp", e.target.value)}
                    className="w-full px-3 py-2.5 border border-black/10 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Office Address</label>
                  <input value={content.address || ""} onChange={(e) => set("address", e.target.value)}
                    className="w-full px-3 py-2.5 border border-black/10 text-sm" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-black/5 p-6 space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/40 border-b border-black/5 pb-4">Frequently Asked Questions</h3>
              <div className="space-y-6">
                {(content.faqs || []).map((faq: any, idx: number) => (
                  <div key={idx} className="relative p-4 border border-black/10 bg-black/[0.02]">
                    <button type="button" onClick={() => {
                      const newFaqs = [...content.faqs];
                      newFaqs.splice(idx, 1);
                      set("faqs", newFaqs);
                    }} className="absolute top-4 right-4 text-black/40 hover:text-red-500 transition-colors">
                      <X size={16} />
                    </button>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Question</label>
                        <input value={faq.q || ""} onChange={(e) => {
                          const newFaqs = [...content.faqs];
                          newFaqs[idx] = { ...newFaqs[idx], q: e.target.value };
                          set("faqs", newFaqs);
                        }} className="w-full px-3 py-2 border border-black/10 text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2">Answer</label>
                        <textarea value={faq.a || ""} onChange={(e) => {
                          const newFaqs = [...content.faqs];
                          newFaqs[idx] = { ...newFaqs[idx], a: e.target.value };
                          set("faqs", newFaqs);
                        }} rows={2} className="w-full px-3 py-2 border border-black/10 text-sm resize-none" />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => {
                  const newFaqs = [...(content.faqs || [])];
                  newFaqs.push({ q: "", a: "" });
                  set("faqs", newFaqs);
                }} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
                  <Plus size={14} /> Add FAQ
                </button>
              </div>
            </div>
          </div>
        )}

        {pageId !== "home" && pageId !== "support" && (
          <div className="bg-white border border-black/5 p-6">
            <p className="text-sm opacity-50">Generic editor for {pageId} (Coming Soon)</p>
          </div>
        )}

        <button type="submit" disabled={saving}
          className="w-full py-4 bg-black text-white text-[11px] font-semibold tracking-[0.3em] uppercase hover:bg-black/85 transition-colors disabled:opacity-40">
          {saving ? "Saving..." : "Save Content"}
        </button>
      </form>
    </div>
  );
}
