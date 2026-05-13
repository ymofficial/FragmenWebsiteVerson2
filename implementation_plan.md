# Fragmen E-Commerce Website Architecture

This document outlines the architecture and implementation plan for the "Fragmen" premium e-commerce website. The project will be built using the Next.js App Router, Tailwind CSS for elegant styling, MongoDB (via Mongoose) for the database, and Uploadthing for seamless image uploads.

## User Review Required

> [!IMPORTANT]
> Please review the proposed folder structure, database schema, and the provided component code below. If you approve, I can automatically initialize the Next.js project and create all these files in your workspace.

## Proposed Architecture & Folder Structure

We will use the **Next.js App Router** (`src/app`) for modern routing and Server Components. 

```text
d:\FRGAMEN WEBSITE VERSION 2\
├── src/
│   ├── app/
│   │   ├── (admin)/                 # Route group for admin panel
│   │   │   ├── admin/dashboard/     # Admin dashboard
│   │   │   └── admin/upload/        # Product upload page
│   │   ├── (shop)/                  # Route group for storefront
│   │   │   ├── products/            # Product listing
│   │   │   ├── products/[id]/       # Product detail page
│   │   │   └── page.tsx             # Landing page (Product Grid)
│   │   ├── api/                     # API Routes
│   │   │   ├── products/            # API to fetch/create products
│   │   │   └── uploadthing/         # Uploadthing endpoints
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles (Tailwind)
│   ├── components/
│   │   ├── admin/                   # Admin components (Upload form)
│   │   ├── shop/                    # Shop components (Product grid, card)
│   │   └── ui/                      # Reusable UI components (Buttons, inputs)
│   ├── lib/
│   │   ├── db.ts                    # MongoDB connection utility
│   │   └── uploadthing.ts           # Uploadthing configuration
│   └── models/
│       └── Product.ts               # Mongoose schema
├── public/                          # Static assets
├── tailwind.config.ts               # Tailwind CSS configuration
└── package.json
```

## Database Schema (MongoDB / Mongoose)

For a perfume product, we need details like name, brand (default to Fragmen), description, price, volume (e.g., 50ml, 100ml), notes (top, heart, base), stock status, and image URL.

```typescript
// src/models/Product.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  volume: string; // e.g., '50ml', '100ml'
  fragranceNotes: string[]; // e.g., ['Oud', 'Rose', 'Vanilla']
  imageUrl: string;
  inStock: boolean;
  stockCount: number;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  volume: { type: String, required: true },
  fragranceNotes: { type: [String], default: [] },
  imageUrl: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
```

## Component: Admin Product Upload Form

This component uses `react-hook-form` and Uploadthing for seamless image uploading and form submission.

```tsx
// src/components/admin/ProductUploadForm.tsx
"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing"; // Assumes Uploadthing is configured
import { useRouter } from "next/navigation";

export default function ProductUploadForm() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    volume: "100ml",
    stockCount: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert("Please upload an image first.");

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        price: parseFloat(formData.price),
        stockCount: parseInt(formData.stockCount),
        imageUrl,
      }),
    });

    if (res.ok) {
      alert("Product uploaded successfully!");
      router.push("/products"); // Redirect or clear form
    } else {
      alert("Error uploading product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-8 bg-zinc-900 text-white rounded-xl shadow-2xl">
      <h2 className="text-2xl font-light mb-6 tracking-widest text-center">ADD NEW FRAGRANCE</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input 
            type="text" 
            required 
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500 transition-colors"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea 
            required 
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500 transition-colors h-32"
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price ($)</label>
            <input 
              type="number" 
              required 
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500 transition-colors"
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock Count</label>
            <input 
              type="number" 
              required 
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-500 transition-colors"
              onChange={(e) => setFormData({...formData, stockCount: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Product Image</label>
          {imageUrl ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-zinc-700">
              <img src={imageUrl} alt="Uploaded" className="object-cover w-full h-full" />
            </div>
          ) : (
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  setImageUrl(res[0].url);
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
              className="ut-button:bg-white ut-button:text-black ut-label:text-zinc-400 ut-allowed-content:text-zinc-500 border-zinc-700 bg-zinc-800"
            />
          )}
        </div>

        <button 
          type="submit" 
          className="w-full py-4 mt-6 bg-white text-black font-semibold tracking-wider rounded-lg hover:bg-zinc-200 transition-all active:scale-[0.98]"
        >
          PUBLISH PRODUCT
        </button>
      </div>
    </form>
  );
}
```

## Component: Product Grid

This component fetches products from the database and displays them in a minimalist, high-end grid suitable for the homepage or product listing page.

```tsx
// src/components/shop/ProductGrid.tsx
import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

// This is a Server Component, fetching directly from DB
async function getProducts() {
  await dbConnect();
  const products = await Product.find({ inStock: true }).sort({ createdAt: -1 });
  return products;
}

export default async function ProductGrid() {
  const products = await getProducts();

  if (products.length === 0) {
    return <div className="text-center py-20 text-zinc-500">No fragrances available at the moment.</div>;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {products.map((product) => (
          <Link key={product._id.toString()} href={`/products/${product._id}`} className="group cursor-pointer">
            <div className="relative w-full aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden mb-6">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Optional overlay for high-end feel */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-light tracking-widest text-zinc-900 dark:text-white mb-2 uppercase">
                {product.name}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">{product.volume}</p>
              <p className="text-md font-medium text-zinc-900 dark:text-white">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

## Next Steps
Once you approve this plan, I will:
1. Initialize a new Next.js project with Tailwind CSS in your workspace (`d:\FRGAMEN WEBSITE VERSION 2`).
2. Install necessary dependencies (`mongoose`, `uploadthing`, `@uploadthing/react`, `lucide-react` for icons).
3. Generate the required configurations and the code files listed above.
