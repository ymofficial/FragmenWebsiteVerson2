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
      className="mt-4 w-full border border-black py-2 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all duration-300"
    >
      Add to Cart
    </button>
  );
}
