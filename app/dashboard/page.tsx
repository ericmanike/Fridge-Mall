"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  ShoppingBag,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  walletBalance: number;
  phone?: string;
  createdAt: string;
}

export default function DashboardIndexPage() {
  const router = useRouter();
  const { update } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Error refreshing profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchOrders();
  }, []);

  const handleToggleRole = async () => {
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggleRole" }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
        await update(); // Refresh NextAuth session
        router.refresh();
        await fetchUserProfile();
      }
    } catch (err) {
      toast.error("Failed to toggle role");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 text-slate-500">
        Failed to load account profile. Please try logging in again.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <ToastContainer />
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Welcome Card & Summary */}
        <div className="rounded-2xl border border-slate-200 bg-[#0066FF] p-6 text-white shadow-xs relative overflow-hidden">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-4 -translate-y-4 rounded-full bg-white/10" />
          <h2 className="text-2xl font-black">Welcome back, {user.name}!</h2>
          <p className="mt-2 text-sm text-blue-100">
            Manage your orders and refer friends all from one place.
          </p>
          <Link
            href="/dashboard/profile"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-100 px-4 py-2.5 text-xs font-bold text-[#0066FF] transition cursor-pointer"
          >
            View Profile details
          </Link>
        </div>

        {/* Quick Shortcuts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/products"
              className="group flex items-center justify-between rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 p-4 transition-all duration-200"
            >
              <div>
                <p className="font-bold text-slate-800">Browse Fridges</p>
                <p className="text-xs text-slate-500">Shop top brands in Ghana</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition" />
            </Link>
            <Link
              href="/dashboard/referral"
              className="group flex items-center justify-between rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/20 p-4 transition-all duration-200"
            >
              <div>
                <p className="font-bold text-slate-800">Refer &amp; Earn</p>
                <p className="text-xs text-slate-500">Get GHS 50 per recommendation</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-amber-500 transition" />
            </Link>
          </div>
        </div>

        {/* Recent Orders Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-800">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-base">Recent Orders</h3>
            </div>
            {orders.length > 0 && (
              <Link href="/dashboard/orders" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                View all orders
              </Link>
            )}
          </div>

          {loadingOrders ? (
            <div className="space-y-3">
              <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
              <ShoppingBag className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">You haven&apos;t placed any orders yet.</p>
              <Link
                href="/products"
                className="mt-3.5 inline-flex rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition shadow-sm"
              >
                Shop Fridges
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((o) => (
                <div key={o.orderId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm">
                  <div>
                    <p className="font-bold text-slate-800 font-mono">{o.orderId}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(o.createdAt).toLocaleDateString("en-GH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="font-extrabold text-slate-900">
                      GHS {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(o.total)}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      o.status === "delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : o.status === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Developer Tools */}
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <div className="flex items-center gap-2 text-slate-800 mb-2">
            <ShieldAlert className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-base">Development Playground</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Use these tools to toggle your account between <strong>user</strong> and <strong>admin</strong> access.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleToggleRole}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white transition cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Toggle Admin / User Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return <RefreshCw className={`${className} animate-spin`} />;
}


