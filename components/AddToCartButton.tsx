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

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleClick}
      disabled={!product.inStock}
      className={` text-black  border-1 mt-3 rounded-[15px] px-6 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
        added
          ? " hover:bg-blue-600  hover:text-white"
          : "hover:bg-blue-600 hover:text-white"
      } ${className}`}
    >
      {added ? (
        <span className="inline-flex items-center gap-2">
          Added<Check className="h-4 w-4" />
        </span>
      ) : product.inStock ? (
        "Add to cart"
      ) : (
        "Out of stock"
      )}
    </button>
  );
}
