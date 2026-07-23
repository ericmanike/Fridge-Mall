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
  Users,
  CreditCard,
  X,
  UserCheck,
  Smartphone,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
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
  const [copiedLink, setCopiedLink] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);

  // Withdrawal modal state
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [momoNumber, setMomoNumber] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [submittingWithdrawal, setSubmittingWithdrawal] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch("/api/withdrawals");
      if (res.ok) {
        const data = await res.json();
        setWithdrawalRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
    } finally {
      setLoadingWithdrawals(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const referralLink = `${baseUrl}?refferedby=${referralCode}`;

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
    fetchWithdrawals();

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



  const handleCopyCode = async () => {
    if (navigator.clipboard && referralCode) {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = async () => {
    if (navigator.clipboard && referralLink) {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Referral Rewards Count & Earning (computed mock or database logic)
  const totalEarned = dbOrders.filter((o) => o.referralCodeUsed === referralCode).length * 50;
  const successfulReferrals = dbOrders.filter((o) => o.referralCodeUsed === referralCode);

  const totalRequested = withdrawalRequests
    .filter((r) => r.status === "pending" || r.status === "approved")
    .reduce((sum, r) => sum + r.amount, 0);
  const withdrawableEarnings = Math.max(0, totalEarned - totalRequested);

  const handleWithdraw = () => {
    if (withdrawableEarnings < 50) {
      toast.error("Minimum withdrawable balance required is GHS 50.00.");
      return;
    }
    setWithdrawAmount(withdrawableEarnings.toString());
    setIsWithdrawModalOpen(true);
  };

  const confirmWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(withdrawAmount);

    if (isNaN(numericAmount) || numericAmount < 50) {
      toast.error("Minimum withdrawal amount is GHS 50.00.");
      return;
    }

    if (numericAmount > withdrawableEarnings) {
      toast.error(`Amount exceeds your available balance of GHS ${withdrawableEarnings.toFixed(2)}.`);
      return;
    }

    if (!momoNumber.trim()) {
      toast.error("Please enter your Mobile Money (MoMo) number.");
      return;
    }
    if (!beneficiaryName.trim()) {
      toast.error("Please enter the beneficiary name on the account.");
      return;
    }

    setSubmittingWithdrawal(true);
    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numericAmount,
          referralCode: referralCode,
          momoNumber: momoNumber.trim(),
          beneficiaryName: beneficiaryName.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || "Withdrawal request submitted successfully!");
        setIsWithdrawModalOpen(false);
        setMomoNumber("");
        setBeneficiaryName("");
        setWithdrawAmount("");
        fetchWithdrawals();
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Failed to submit withdrawal request.");
      }
    } catch (err) {
      toast.error("Failed to submit withdrawal request.");
    } finally {
      setSubmittingWithdrawal(false);
    }
  };

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

              {/* Recent Orders Card */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-base">Recent Orders</h3>
                  </div>
                  {dbOrders.length > 0 && (
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      View all orders
                    </button>
                  )}
                </div>

                {loadingOrders ? (
                  <div className="space-y-3">
                    <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                  </div>
                ) : dbOrders.length === 0 ? (
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
                    {dbOrders.slice(0, 3).map((o) => (
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

              {/* Developer / Tester Playground */}
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
                <div className="flex items-center gap-2 text-slate-800 mb-2">
                  <ShieldAlert className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-base">Development Playground</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Use these mock actions to toggle your role to <strong>admin</strong> (to see the Admin Panel subroutes).
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
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${
                                o.status === "delivered"
                                  ? "bg-emerald-600"
                                  : o.status === "processing"
                                  ? "bg-blue-600"
                                  : o.status === "cancelled"
                                  ? "bg-red-600"
                                  : "bg-amber-500"
                              }`}
                            >
                              {o.status === "delivered" ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : o.status === "processing" ? (
                                <Truck className="h-3 w-3" />
                              ) : o.status === "cancelled" ? (
                                <XCircle className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
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
              <div className="rounded-2xl bg-linear-to-br from-amber-400 to-amber-500 p-8 text-slate-900 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-900/80">Referral reward</p>
                  <h3 className="text-2xl font-black">Earn GHS 50.00 Instantly</h3>
                  <p className="text-sm text-amber-955/95 leading-relaxed max-w-xl">
                    Give friends the gift of quality refrigerators! When they place an order using your referral code,
                    they enjoy free shipping, and you get a GHS 50.00 reward.
                  </p>
                </div>

                {/* Earnings & Withdraw */}
                <div className="bg-white/35 backdrop-blur-xs p-5 rounded-xl border border-white/20 min-w-[220px] text-center shrink-0 w-full md:w-auto">
                  <p className="text-xs font-bold text-amber-950/80 uppercase tracking-wider">Withdrawable Balance</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">{formatCurrency(withdrawableEarnings)}</p>
                  <button
                    onClick={handleWithdraw}
                    className="mt-3 w-full inline-flex items-center justify-center rounded-xl bg-slate-950 hover:bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Withdraw Balance
                  </button>
                </div>
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

                {/* Referral Link */}
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Shareable Link</p>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      readOnly
                      value={referralLink}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-mono text-slate-600 outline-none select-all"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition cursor-pointer select-none"
                    >
                      {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedLink ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
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

              {/* Withdrawal History inside dashboard */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Withdrawal Requests History</h3>
                {loadingWithdrawals ? (
                  <div className="space-y-3">
                    <div className="h-10 animate-pulse rounded-xl bg-slate-100 animate-in" />
                    <div className="h-10 animate-pulse rounded-xl bg-slate-100 animate-in" />
                  </div>
                ) : withdrawalRequests.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-sm">
                    No withdrawal requests submitted yet.
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {withdrawalRequests.map((req: any) => (
                      <li
                        key={req._id}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3.5 text-sm"
                      >
                        <div>
                          <p className="font-bold text-slate-800">Referral Payout Request</p>
                          <p className="text-xs text-slate-500">
                            Requested: {new Date(req.createdAt).toLocaleDateString("en-GH")}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-slate-900">{formatCurrency(req.amount)}</span>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              req.status === "approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : req.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
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
                  <Users className="h-4 w-4 text-slate-400" />
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

      {/* MoMo Withdrawal Details Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Request Withdrawal</h2>
                  <p className="text-xs text-slate-500">Provide Mobile Money payout details</p>
                </div>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={confirmWithdrawal} className="mt-5 space-y-4">
              <div className="rounded-2xl bg-amber-50/70 border border-amber-200/60 p-4 text-center">
                <p className="text-xs font-bold text-amber-900/80 uppercase tracking-wider">Available Balance</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{formatCurrency(withdrawableEarnings)}</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                    Withdrawal Amount (GHS)
                  </label>
                  <span className="text-[11px] font-medium text-amber-600">Min: GHS 50.00</span>
                </div>
                <input
                  type="number"
                  required
                  min="50"
                  max={withdrawableEarnings}
                  step="0.01"
                  placeholder="Enter amount (min GHS 50)"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-amber-500 focus:bg-white transition font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                  Beneficiary Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kwame Mensah"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-amber-500 focus:bg-white transition font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                  Mobile Money (MoMo) Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 024XXXXXXX"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-amber-500 focus:bg-white transition font-medium text-slate-800"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingWithdrawal}
                  className="flex-1 rounded-xl bg-slate-950 hover:bg-slate-900 disabled:opacity-50 py-2.5 text-xs font-bold text-white transition active:scale-[0.98] cursor-pointer shadow-sm"
                >
                  {submittingWithdrawal ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
