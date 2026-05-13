import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

interface ProductGridProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const dummyProducts = [
  {
    _id: "dummy-1",
    name: "Midnight Oud",
    brand: "Fragmen",
    price: 125.00,
    category: "Eau de Parfum",
    imageUrls: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80"],
    inStock: true
  },
  {
    _id: "dummy-2",
    name: "Velvet Petals",
    brand: "Fragmen",
    price: 95.00,
    category: "Eau de Parfum",
    imageUrls: ["https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80"],
    inStock: true
  },
  {
    _id: "dummy-3",
    name: "Oceanic Mist",
    brand: "Fragmen",
    price: 85.00,
    category: "Cologne",
    imageUrls: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80"],
    inStock: false
  },
  {
    _id: "dummy-4",
    name: "Golden Sands",
    brand: "Fragmen",
    price: 110.00,
    category: "Eau de Parfum",
    imageUrls: ["https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80"],
    inStock: true
  }
];

async function getProducts(searchParams?: { [key: string]: string | string[] | undefined }) {
  if (!process.env.MONGODB_URI) {
    let filtered = [...dummyProducts];
    if (searchParams?.inStock === "true") {
      filtered = filtered.filter(p => p.inStock);
    }
    if (searchParams?.category && typeof searchParams.category === "string") {
      filtered = filtered.filter(p => p.category === searchParams.category);
    }
    if (searchParams?.sort === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (searchParams?.sort === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    }
    return filtered;
  }
  
  await dbConnect();
  
  const query: any = {};
  
  if (searchParams?.inStock === "true") {
    query.inStock = true;
  }
  
  if (searchParams?.category && typeof searchParams.category === "string") {
    query.category = searchParams.category;
  }
  
  let sortParams: any = { createdAt: -1 };
  if (searchParams?.sort === "price_asc") {
    sortParams = { price: 1 };
  } else if (searchParams?.sort === "price_desc") {
    sortParams = { price: -1 };
  }

  const products = await Product.find(query).sort(sortParams).lean();
  return products.map((product: any) => ({
    ...product,
    _id: product._id.toString(),
  }));
}

export default async function ProductGrid({ searchParams }: ProductGridProps) {
  const products = await getProducts(searchParams);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h2 className="text-xl font-light tracking-[0.3em] uppercase mb-6 opacity-40">The Collection</h2>
        <p className="opacity-40 text-sm max-w-md font-light leading-relaxed">Our master perfumers are currently refining our signature scents. Please check back later for availability.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
      {products.map((product: any) => (
        <Link key={product._id} href={`/products/${product._id}`} className="group cursor-pointer block">
          <div className="relative w-full aspect-[3/4] bg-black/5 overflow-hidden mb-6">
            <Image
              src={product.imageUrls?.[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80"}
              alt={product.name}
              fill
              className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-[1.5s] ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            {!product.inStock && (
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[8px] uppercase tracking-widest font-semibold text-black">
                Out of Stock
              </div>
            )}
          </div>
          
          <div className="text-center flex flex-col items-center">
            <p className="text-[8px] uppercase tracking-[0.3em] text-black/30 mb-2">{product.brand}</p>
            <h3 className="text-xs font-semibold tracking-[0.2em] mb-2 uppercase text-black">
              {product.name}
            </h3>
            <p className="text-[10px] opacity-40 mb-4 uppercase tracking-[0.2em]">{product.category}</p>
            <p className="text-xs font-medium tracking-wider text-black">
              {Math.round(product.price)} Tk
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
