import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  Users,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  await dbConnect();
  const dbUser = await User.findOne({ email: session.user.email });

  if (!dbUser || dbUser.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 font-sans text-center">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
          <ShieldAlert className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-2xl font-black text-slate-900">Access Denied</h2>
          <p className="mt-2 text-slate-500 text-sm">
            You do not have administrative permissions to view this panel.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 transition"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-50 font-sans antialiased text-slate-800">
      {/* Sidebar Panel */}
      <aside className="w-full shrink-0 border-b border-slate-200 bg-[#1874ff] text-white md:w-64 md:border-b-0 md:border-r">
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Logo area */}
            <div className="flex h-16 items-center px-6 border-b border-white/10">
              <span className="text-lg font-black text-white tracking-wider uppercase flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-ping" />
                Fridge Mall Admin
              </span>
            </div>

            {/* Nav links */}
            <nav className="space-y-1 p-4">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white transition duration-200"
              >
                <LayoutDashboard className="h-4.5 w-4.5" />
                Overview
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white transition duration-200"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                Manage Products
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white transition duration-200"
              >
                <TrendingUp className="h-4.5 w-4.5" />
                Manage Orders
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white transition duration-200"
              >
                <Users className="h-4.5 w-4.5" />
                Manage Users
              </Link>
            </nav>
          </div>

          {/* Footer controls inside sidebar */}
          <div className="p-4 border-t border-white/10">
            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 py-3 text-sm font-semibold text-white transition duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              User Dashboard
            </Link>
          </div>
        </div>
      </aside>

      {/* Main page content area */}
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 md:px-8">
        {children}
      </main>
    </div>
  );
}
