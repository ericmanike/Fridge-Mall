"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export default function AddToCartButton({
  product,
  className = "",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleClick}
      disabled={!product.inStock}
      className={`rounded-[10px] px-6 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
        added
          ? "bg-emerald-600 text-white"
          : "bg-green-500 text-white hover:bg-green-600"
      } ${className}`}
    >
      {added ? (
        <span className="inline-flex items-center gap-2">
          Added to cart <Check className="h-4 w-4" />
        </span>
      ) : product.inStock ? (
        "Add to cart"
      ) : (
        "Out of stock"
      )}
    </button>
  );
}
