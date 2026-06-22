"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import ProfileDropdown from "./ProfileDropdown";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white backdrop-blur-md">
      <div className="  flex h-16 w-full items-center justify-between md:px-10 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo1.png"
              alt="Fridge Mall Logo"
              width={100}
              height={40}
              priority
              className="object-contain block h-10 w-auto transition hover:opacity-85"
            />
          </Link>
      
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full bg-[#0066FF] px-2 py-2 text-sm font-semibold text-white transition hover:bg-[#0066ffe7]"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount >= 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-900 animate-bounce">
                {itemCount}
              </span>
            )}
          </Link>

          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
