"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShoppingBag, Gift } from "lucide-react";

export default function DashboardNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Overview", Icon: User },
    { href: "/dashboard/orders", label: "My Orders", Icon: ShoppingBag },
    { href: "/dashboard/referral", label: "Refer & Earn", Icon: Gift },
  ];

  return (
    <div className="mt-8 flex border-b border-slate-200">
      {links.map((link) => {
        const Icon = link.Icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-bold transition duration-200 ${
              isActive
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
