"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Gift,
  Store,
  Shield,
  User as UserIcon,
  X,
  Snowflake,
  LogOut
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: {
    name: string;
    email: string;
    role?: string;
  };
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, user }: SidebarProps) {
  const pathname = usePathname();

  const menuSections = [
    {
      title: "Main Menu",
      items: [
        { id: "dashboard", label: "Overview", href: "/dashboard", icon: Home, color: "bg-blue-50 text-blue-600" },
        { id: "profile", label: "My Profile", href: "/dashboard/profile", icon: UserIcon, color: "bg-cyan-50 text-cyan-600" },
        { id: "orders", label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag, color: "bg-purple-50 text-purple-600" },
        { id: "referral", label: "Refer & Earn", href: "/dashboard/referral", icon: Gift, color: "bg-amber-50 text-amber-600" },
      ]
    },
    {
      title: "Storefront",
      items: [
        { id: "products", label: "Browse Fridges", href: "/products", icon: Store, color: "bg-emerald-50 text-emerald-600" },
        { id: "cart", label: "View Cart", href: "/cart", icon: ShoppingCart, color: "bg-rose-50 text-rose-600" },
      ]
    }
  ];

  if (user.role === "admin") {
    menuSections.push({
      title: "Admin Panel",
      items: [
        { id: "admin-overview", label: "Admin Overview", href: "/admin", icon: Shield, color: "bg-red-50 text-red-600" },
        { id: "admin-products", label: "Manage Products", href: "/admin/products", icon: Store, color: "bg-indigo-50 text-indigo-600" },
        { id: "admin-orders", label: "Manage Orders", href: "/admin/orders", icon: ShoppingBag, color: "bg-pink-50 text-pink-600" },
        { id: "admin-users", label: "Manage Users", href: "/admin/users", icon: UserIcon, color: "bg-cyan-50 text-cyan-600" },
      ]
    });
  }

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[270px] bg-white border-r border-slate-200 flex flex-col h-screen xl:sticky xl:top-0 transition-transform duration-300 xl:translate-x-0 xl:shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header Block */}
        <div className="h-[76px] px-6 bg-[#0066FF] text-white flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-3">
          
            
            <span className="text-lg font-black tracking-tight select-none">
              <Link href="/" className="flex justify-center items-center gap-1">
                Fridge <span className="text-amber-300">Mall</span>
              </Link> 
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="xl:hidden p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Lists */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin">
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h4 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group text-left cursor-pointer ${
                        isActive
                          ? "bg-[#0066FF] text-white font-semibold shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                          isActive ? "bg-white/20 text-white" : item.color
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <span className="text-[13px] tracking-wide">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Log out */}
        <div className="p-4 border-t border-slate-100 shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-slate-600 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs xl:hidden transition-opacity"
        />
      )}
    </>
  );
}
