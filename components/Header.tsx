"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const navLinks = [
  { href: "/products", label: "Shop Fridges" },
  { href: "/referral", label: "Refer & Earn" },
];

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span>
            logo
          </span>
          <div className="leading-tight">
            <p className="text-base font-bold text-slate-900">Fridge  <span className="text-[#0066FF] font-extrabold">Mall</span></p>
            <p className="hidden text-xs text-slate-500 sm:block">
             Ghana's fridge marketplace
            </p>
          </div>
        </Link>

       
        <Link
          href="/cart"
          className="relative flex items-center gap-2 rounded-[10px] bg-[#0066FF] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0066ffe7]"
        >
          <ShoppingCart className="h-5 w-5" />
          Cart
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-900">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
