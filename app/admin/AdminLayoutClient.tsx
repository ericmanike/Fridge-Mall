"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  Users,
  Banknote,
  ArrowLeft,
  Menu,
  X,
  Store,
  Shield,
} from "lucide-react";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Manage Products",
      href: "/admin/products",
      icon: ShoppingBag,
    },
    {
      label: "Manage Orders",
      href: "/admin/orders",
      icon: TrendingUp,
    },
    {
      label: "Manage Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Withdrawal Requests",
      href: "/admin/withdrawals",
      icon: Banknote,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-50 font-sans antialiased text-slate-800">
      {/* Mobile Top Navbar (Visible on smaller screens, placed at top with menu toggle at left) */}
      <header className="flex h-16 w-full items-center justify-between bg-[#1874ff] px-4 text-white md:hidden border-b border-white/10 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open admin sidebar menu"
            className="rounded-lg p-2 text-white hover:bg-white/10 transition-colors focus:outline-hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-base font-black tracking-wider uppercase flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-300" />
            Admin Panel
          </span>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Exit
        </Link>
      </header>

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel (Desktop & Mobile Slide-out from Left) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1874ff] text-white flex flex-col h-screen transition-transform duration-300 ease-in-out md:translate-x-0 md:z-30 border-r border-white/10 shadow-xl md:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Header Block */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
              <span className="text-lg font-black text-white tracking-wider uppercase flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-300" />
                Admin Panel
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close admin sidebar menu"
                className="md:hidden rounded-lg p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="space-y-1.5 p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition duration-200 ${
                      isActive
                        ? "bg-white text-[#1874ff] font-bold shadow-xs"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer controls inside sidebar */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link
              href="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 py-2.5 text-xs font-semibold text-white transition duration-200 uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" />
              User Dashboard
            </Link>
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 py-2.5 text-xs font-semibold text-white/90 hover:text-white transition duration-200 uppercase tracking-wider"
            >
              <Store className="h-4 w-4" />
              Storefront
            </Link>
          </div>
        </div>
      </aside>

      {/* Main page content area */}
      <main className="flex-1 min-w-0 overflow-y-auto px-4 py-8 sm:px-6 md:px-8 md:pl-72">
        {children}
      </main>
    </div>
  );
}
