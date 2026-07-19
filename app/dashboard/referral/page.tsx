"use client";

import React, { useState, useEffect } from "react";
import { Gift, Copy, Check, Users } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { REFERRAL_REWARD_AMOUNT } from "@/lib/referral";
import { ReferralReward } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function ReferralDashboardPage() {
  const [code, setCode] = useState("");
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [referredUsers, setReferredUsers] = useState<any[]>([]);
  const [referredUsersCount, setReferredUsersCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [copied, setCopied] = useState(false);
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);

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
    fetchRewards();
    fetchWithdrawals();
  }, []);

  const fetchRewards = async () => {
    try {
      const res = await fetch("/api/referrals");
      if (res.ok) {
        const data = await res.json();
        setCode(data.code || "");
        setRewards(data.rewards || []);
        setReferredUsers(data.referredUsers || []);
        setReferredUsersCount(data.successfulReferralsCount ?? data.referredUsers?.length ?? 0);
        setTotalEarnings(data.totalEarnings || 0);
      }
    } catch (err) {
      console.error("Error fetching referrals:", err);
    }
  };

  const [copiedLink, setCopiedLink] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const referralLink = `${baseUrl}?refferedby=${code}`;

  const handleCopyCode = async () => {
    if (navigator.clipboard && code) {
      await navigator.clipboard.writeText(code);
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

  const withdrawableEarnings = totalEarnings;

  const handleWithdraw = async () => {
    if (withdrawableEarnings <= 0) {
      toast.error("You don't have any earnings to withdraw.");
      return;
    }

    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: withdrawableEarnings, referralCode: code }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || "Withdrawal request submitted successfully!");
        fetchWithdrawals();
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Failed to submit withdrawal request.");
      }
    } catch (err) {
      toast.error("Failed to submit withdrawal request.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <ToastContainer />

      {/* Refer and Earn Banner */}
      <div className="rounded-2xl bg-linear-to-br from-amber-400 to-amber-500 p-8 text-slate-900 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-900/80">Referral program</p>
          <h3 className="text-2xl font-black">Earn {formatCurrency(REFERRAL_REWARD_AMOUNT)} Instantly</h3>
          <p className="text-sm text-amber-955/95 leading-relaxed max-w-xl">
            Share your referral code with friends and family. When they purchase a refrigerator using your code at checkout, they receive free shipping, and you instantly receive a GHS 50.00 reward.
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

      {/* Referral Code details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <p className="text-sm font-bold text-slate-700">Your Shareable Referral Code</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="rounded-xl bg-slate-100 px-5 py-3 font-mono text-2xl font-bold tracking-widest text-slate-800 border border-slate-200">
            {code || "FM------"}
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

      {/* Quick Metrics */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Successful Invites</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{referredUsersCount}</p>
        </div>
        <div className="rounded-xl p-3 bg-blue-50 text-blue-600">
          <Users className="h-6 w-6" />
        </div>
      </div>

      {/* Referred Users List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Referred Accounts</h3>
        {referredUsers.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-sm">
            No users have signed up with your referral code yet.
          </div>
        ) : (
          <ul className="space-y-3 divide-y divide-slate-50">
            {referredUsers.map((user) => (
              <li
                key={user._id || user.email}
                className="flex items-center justify-between py-3.5 first:pt-0"
              >
                <div>
                  <p className="font-bold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  Joined {new Date(user.createdAt).toLocaleDateString("en-GH")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Referral Logs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Referral Reward History</h3>
        {rewards.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-sm">
            No referral rewards recorded yet. Share your code to start earning!
          </div>
        ) : (
          <ul className="space-y-3 divide-y divide-slate-50">
            {rewards.map((reward) => (
              <li
                key={reward.id}
                className="flex items-center justify-between py-3.5 first:pt-0"
              >
                <div>
                  <p className="font-bold text-slate-800">Successful Referral Credit</p>
                  <p className="text-xs text-slate-500">
                    Order {reward.orderId} · {new Date(reward.createdAt).toLocaleDateString("en-GH")}
                  </p>
                </div>
                <span className="font-black text-emerald-600">+{formatCurrency(reward.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Withdrawal Request History */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Withdrawal Request History</h3>
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
          <ul className="space-y-3 divide-y divide-slate-50">
            {withdrawalRequests.map((req) => (
              <li
                key={req._id}
                className="flex items-center justify-between py-3.5 first:pt-0"
              >
                <div>
                  <p className="font-bold text-slate-800 font-sans">Referral Payout Request</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Requested on {new Date(req.createdAt).toLocaleDateString("en-GH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
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
  );
}
