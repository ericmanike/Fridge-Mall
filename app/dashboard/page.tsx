"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Wallet,
  PlusCircle,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
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

  useEffect(() => {
    fetchUserProfile();
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

  const handleAddFunds = async () => {
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addFunds" }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success("Mock GHS 1,000.00 added to your wallet!");
        await fetchUserProfile();
      }
    } catch (err) {
      toast.error("Failed to add funds");
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
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Card & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Account Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <UserIcon className="h-5 w-5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Full Name</p>
                  <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Mail className="h-5 w-5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Email Address</p>
                  <p className="text-sm font-semibold text-slate-700">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Phone className="h-5 w-5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Phone Number</p>
                  <p className="text-sm font-semibold text-slate-700">{user.phone || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Member Since</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {new Date(user.createdAt).toLocaleDateString("en-GH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
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

          {/* Developer Tools */}
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <div className="flex items-center gap-2 text-slate-800 mb-2">
              <ShieldAlert className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-base">Development Playground</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Use these tools to toggle your account between <strong>user</strong> and <strong>admin</strong> access and add mock funds to your wallet.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleToggleRole}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white transition cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Toggle Admin / User Role
              </button>
              <button
                onClick={handleAddFunds}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
                Add GHS 1,000 Mock Funds
              </button>
            </div>
          </div>
        </div>

        {/* Right Stats Sidebar */}
        <div className="space-y-6">
          {/* Wallet Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-emerald-500/5" />
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Wallet Balance</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-sm font-bold text-slate-500">GHS</span>
              <span className="text-3xl font-black text-slate-900">
                {formatCurrency(user.walletBalance).replace("GHS", "").trim()}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Use this balance to purchase fridges or withdraw money.</p>
            <button
              onClick={handleAddFunds}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-slate-100 py-3 text-sm font-bold text-slate-700 transition border border-slate-200 cursor-pointer"
            >
              <Wallet className="h-4 w-4 text-emerald-600" />
              Add Mock Funds
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
