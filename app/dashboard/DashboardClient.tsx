"use client";

import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Wallet,
  Gift,
  ShoppingBag,
  LogOut,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Award,
  CircleDollarSign,
  PlusCircle,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";

interface DashboardClientProps {
  initialUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    walletBalance: number;
    phone: string;
    createdAt: string;
  };
}

export default function DashboardClient({ initialUser }: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "referral">("overview");
  const [user, setUser] = useState(initialUser);
  const [copied, setCopied] = useState(false);
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const { orders: localOrders } = useCart();

  // Load user profile details
  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Error refreshing profile:", err);
    }
  };

  // Fetch db orders and combine with local
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        // Merge & deduplicate local storage orders & database orders
        const mergedMap = new Map();
        
        // Load local ones first
        localOrders.forEach((o:any) => {
          const id = o.id || (o as any).orderId;
          mergedMap.set(id, {
            orderId: id,
            createdAt: o.createdAt,
            total: o.total,
            status: o.status,
            items: o.items,
            details: o.details,
          });
        });

        // Overwrite/supplement with DB ones
        data.orders.forEach((o: any) => {
          mergedMap.set(o.orderId, o);
        });

        const list = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setDbOrders(list);
      } else {
        setDbOrders(localOrders);
      }
    } catch (err) {
      setDbOrders(localOrders);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUserProfile();

    // Generate referral code based on email or localStorage
    if (typeof window !== "undefined") {
      const localCode = localStorage.getItem("fridgemall-referral-code");
      if (localCode) {
        setReferralCode(localCode);
      } else {
        // Fallback or generate
        const cleanEmail = initialUser.email.split("@")[0].toUpperCase().replace(/[^A-Z0-9]/g, "");
        const generated = `FM-${cleanEmail.slice(0, 4)}-${Math.floor(100 + Math.random() * 900)}`;
        localStorage.setItem("fridgemall-referral-code", generated);
        setReferralCode(generated);
      }
    }
  }, [localOrders]);

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
        // Refresh token in session/JWT
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

  const handleCopyCode = async () => {
    if (navigator.clipboard && referralCode) {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Referral Rewards Count & Earning (computed mock or database logic)
  const totalEarned = dbOrders.filter((o) => o.referralCodeUsed === referralCode).length * 50;
  const successfulReferrals = dbOrders.filter((o) => o.referralCodeUsed === referralCode);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <ToastContainer />

      {/* Header Profile Section */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute left-0 bottom-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white shadow-md text-2xl uppercase">
              {user.name.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider ${
                    user.role === "admin"
                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700 transition duration-200 shadow-lg shadow-red-600/20"
              >
                <ShieldAlert className="h-4 w-4" />
                Admin Panel
              </Link>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-3 text-sm font-bold text-slate-300 hover:text-white transition duration-200 border border-slate-700"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="mt-8 flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-bold transition duration-200 cursor-pointer ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <UserIcon className="h-4 w-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-bold transition duration-200 cursor-pointer ${
            activeTab === "orders"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          My Orders
          {dbOrders.length > 0 && (
            <span className="ml-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              {dbOrders.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("referral")}
          className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-bold transition duration-200 cursor-pointer ${
            activeTab === "referral"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Gift className="h-4 w-4" />
          Refer & Earn
        </button>
      </div>

      {/* Main Grid */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Profile Details Card */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Account Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50">
                    <UserIcon className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Full Name</p>
                      <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50">
                    <Mail className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Email Address</p>
                      <p className="text-sm font-semibold text-slate-700">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50">
                    <Phone className="h-5 w-5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Phone Number</p>
                      <p className="text-sm font-semibold text-slate-700">{user.phone || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50">
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

              {/* Quick Actions Hub */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
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
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </Link>
                  <button
                    onClick={() => setActiveTab("referral")}
                    className="group text-left flex items-center justify-between rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/20 p-4 transition-all duration-200 cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-slate-800">Refer &amp; Earn</p>
                      <p className="text-xs text-slate-500">Get GHS 50 per recommendation</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Developer / Tester Playground */}
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
                <div className="flex items-center gap-2 text-slate-800 mb-2">
                  <ShieldAlert className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-base">Development Playground</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Use these mock actions to toggle your role to <strong>admin</strong> (to see the Admin Panel subroutes)
                  or add mock credit to your wallet to test layouts.
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
          )}

          {activeTab === "orders" && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 mb-4">My Orders</h3>
              {loadingOrders ? (
                <div className="space-y-4 py-6">
                  <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
                  <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
                  <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
                </div>
              ) : dbOrders.length === 0 ? (
                <div className="py-12 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
                  <h4 className="mt-4 font-bold text-slate-800">No orders found</h4>
                  <p className="mt-1 text-sm text-slate-500">You haven&apos;t placed any orders yet.</p>
                  <Link
                    href="/products"
                    className="mt-6 inline-flex rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition"
                  >
                    Shop Fridges
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                        <th className="py-3 pr-4">Order ID</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 pl-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {dbOrders.map((o) => (
                        <tr key={o.orderId} className="group hover:bg-slate-50/50 transition duration-150">
                          <td className="py-4 pr-4 font-mono font-bold text-slate-800">{o.orderId}</td>
                          <td className="py-4 px-4 text-slate-500">
                            {new Date(o.createdAt).toLocaleDateString("en-GH")}
                          </td>
                          <td className="py-4 px-4 text-slate-600">
                            {o.items?.map((item: any) => `${item.name} (x${item.quantity})`).join(", ") || "Fridge Product"}
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-950">{formatCurrency(o.total)}</td>
                          <td className="py-4 pl-4 text-right">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                o.status === "delivered"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : o.status === "confirmed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "referral" && (
            <div className="space-y-6">
              {/* Refer and Earn Card */}
              <div className="rounded-2xl bg-linear-to-br from-amber-400 to-amber-500 p-8 text-slate-900 shadow-md">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-900/80">Referral reward</p>
                <h3 className="mt-2 text-2xl font-black">Earn GHS 50.00 Instantly</h3>
                <p className="mt-3 text-sm text-amber-950/80 leading-relaxed">
                  Give friends the gift of quality refrigerators! When they place an order using your referral code,
                  they enjoy free shipping, and you get GHS 50.00 credited directly to your Fridge Mall wallet.
                </p>
              </div>

              {/* Referral Code Copy Card */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
                <p className="text-sm font-bold text-slate-700">Your Shareable Code</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="rounded-xl bg-slate-100 px-5 py-3 font-mono text-2xl font-bold tracking-widest text-slate-800 border border-slate-200">
                    {referralCode || "FM------"}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-3.5 text-sm font-bold text-white transition shadow-md cursor-pointer select-none"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy Code"}
                  </button>
                </div>
              </div>

              {/* Reward history inside dashboard */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Referral Rewards History</h3>
                {successfulReferrals.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-sm">
                    No referrals recorded yet. Share your code to start earning!
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {successfulReferrals.map((reward: any) => (
                      <li
                        key={reward._id || reward.orderId}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3.5 text-sm"
                      >
                        <div>
                          <p className="font-bold text-slate-800">Successful Referral Reward</p>
                          <p className="text-xs text-slate-500">Order: {reward.orderId}</p>
                        </div>
                        <span className="font-black text-emerald-600">+GHS 50.00</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Balance & Stats Area */}
        <div className="space-y-6">
          {/* Wallet Balance Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs relative overflow-hidden">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-emerald-500/5" />
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Wallet Balance</h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-sm font-bold text-slate-500">GHS</span>
              <span className="text-3xl font-black text-slate-900">{formatCurrency(user.walletBalance).replace("GHS", "").trim()}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Use this balance to purchase products or withdraw funds.</p>

            <button
              onClick={handleAddFunds}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-slate-100 py-3 text-sm font-bold text-slate-700 transition border border-slate-200 cursor-pointer"
            >
              <CircleDollarSign className="h-4 w-4 text-emerald-600" />
              Add Mock Funds
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Earnings & Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <div className="flex items-center gap-2 text-slate-600">
                  <TrendingUp className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium">Referral Earnings</span>
                </div>
                <span className="font-bold text-emerald-600">{formatCurrency(totalEarned)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <div className="flex items-center gap-2 text-slate-600">
                  <Award className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium">Successful Invites</span>
                </div>
                <span className="font-bold text-slate-900">{successfulReferrals.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-600">
                  <ShoppingBag className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium">Orders Placed</span>
                </div>
                <span className="font-bold text-slate-900">{dbOrders.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
