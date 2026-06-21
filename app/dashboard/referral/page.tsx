"use client";

import React, { useState, useEffect } from "react";
import { Gift, Copy, Check, TrendingUp, Award, ShoppingBag } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  REFERRAL_REWARD_AMOUNT,
  getOrCreateReferralCode,
  getReferralRewards,
  getTotalReferralEarnings,
} from "@/lib/referral";
import { ReferralReward } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function ReferralDashboardPage() {
  const [code, setCode] = useState("");
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(getOrCreateReferralCode());
    setRewards(getReferralRewards());
    setTotalEarnings(getTotalReferralEarnings());
  }, []);

  const handleCopyCode = async () => {
    if (navigator.clipboard && code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <ToastContainer />

      {/* Refer and Earn Banner */}
      <div className="rounded-2xl bg-linear-to-br from-amber-400 to-amber-500 p-8 text-slate-900 shadow-md">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-900/80">Referral program</p>
        <h3 className="mt-2 text-2xl font-black">Earn {formatCurrency(REFERRAL_REWARD_AMOUNT)} Instantly</h3>
        <p className="mt-3 text-sm text-amber-955/90 leading-relaxed">
          Share your referral code with friends and family. When they purchase a refrigerator using your code at checkout, they receive free shipping, and you instantly receive a GHS 50.00 reward.
        </p>
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
      </div>

      {/* Quick Metrics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Referral Earnings</p>
            <p className="mt-1 text-3xl font-black text-emerald-600">{formatCurrency(totalEarnings)}</p>
          </div>
          <div className="rounded-xl p-3 bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Successful Invites</p>
            <p className="mt-1 text-3xl font-black text-slate-900">{rewards.length}</p>
          </div>
          <div className="rounded-xl p-3 bg-blue-50 text-blue-600">
            <Award className="h-6 w-6" />
          </div>
        </div>
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
    </div>
  );
}
