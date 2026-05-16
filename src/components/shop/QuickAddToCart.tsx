"use client";

import { useCart } from "@/context/CartContext";

interface QuickAddToCartProps {
  product: any;
}

export default function QuickAddToCart({ product }: QuickAddToCartProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="mt-4 w-full bg-black text-white py-2 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black/80 transition-all duration-300"
    >
      Add to Cart
    </button>
  );
}
