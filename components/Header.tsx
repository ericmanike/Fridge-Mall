"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Phone, Mail, Truck, MapPin } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import ProfileDropdown from "./ProfileDropdown";

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      {/* Top Contact Bar */}
      <div className="bg-[#252260] text-slate-200 text-sm font-medium py-2.5 px-4 sm:px-6 md:px-10 border-b border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2.5 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="tel:+233247574980"
              className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>+233 24 757 4980</span>
            </a>
            <a
              href="mailto:support@fridgemall.com.gh"
              className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">support@fridgemall.com.gh</span>
            </a>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="hidden md:flex items-center gap-2 text-slate-200">
              <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Accra, Ghana</span>
            </span>
            <Link
              href="/about#faqs"
              className="flex items-center gap-1.5 text-amber-300 font-semibold hover:text-amber-200 transition-colors"
            >
              <Truck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Pay on Delivery</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex h-16 w-full items-center justify-between md:px-10 sm:px-6 px-4">
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
