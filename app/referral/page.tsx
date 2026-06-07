"use client";

import { useEffect, useState } from "react";
import { Copy, Share2 } from "lucide-react";
import {
  REFERRAL_REWARD_AMOUNT,
  getOrCreateReferralCode,
  getReferralRewards,
  getTotalReferralEarnings,
} from "@/lib/referral";
import { ReferralReward } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function ReferralPage() {
  const [code, setCode] = useState("");
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(getOrCreateReferralCode());
    setRewards(getReferralRewards());
    setTotalEarnings(getTotalReferralEarnings());
  }, []);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const shareText = `Get quality fridges with FREE delivery at Fridge Mall! Use my referral code ${code} when you order and I'll earn ${formatCurrency(REFERRAL_REWARD_AMOUNT)}. Shop now!`;

  return (
    <div className="mx-auto w-full bg-white px-4 py-10 sm:px-6">
      <div className="rounded-2xl bg-linear-to-br from-amber-400 to-amber-500 p-8 text-slate-900">
        <p className="text-sm font-bold uppercase tracking-widest text-amber-900/70">
          Refer &amp; earn
        </p>
        <h1 className="mt-2 text-3xl font-bold">
          Earn {formatCurrency(REFERRAL_REWARD_AMOUNT)} instantly
        </h1>
        <p className="mt-3 text-amber-950/80">
          Share your code with friends. When they buy a fridge and enter your
          code at checkout, you receive {formatCurrency(REFERRAL_REWARD_AMOUNT)}{" "}
          immediately.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-slate-600">Your referral code</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="rounded-xl bg-slate-100 px-5 py-3 font-mono text-2xl font-bold tracking-widest text-slate-900">
            {code || "..."}
          </span>
          <button
            onClick={copyCode}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied!" : "Copy code"}
          </button>
        </div>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: "Fridge Mall", text: shareText });
            } else {
              navigator.clipboard.writeText(shareText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }
          }}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Share2 className="h-4 w-4" />
          Share with friends
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-600">Total earned</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">
            {formatCurrency(totalEarnings)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-600">Successful referrals</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {rewards.length}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-bold text-slate-900">How it works</h2>
        <ol className="mt-4 space-y-4">
          {[
            "Copy your unique referral code above.",
            "Share it with friends, family, or on social media.",
            "They enter your code at checkout when buying a fridge.",
            `You receive ${formatCurrency(REFERRAL_REWARD_AMOUNT)} instantly for each successful referral.`,
          ].map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-slate-700">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {rewards.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-slate-900">Reward history</h2>
          <ul className="mt-4 space-y-2">
            {rewards.map((reward) => (
              <li
                key={reward.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <span className="text-slate-600">
                  Order {reward.orderId} ·{" "}
                  {new Date(reward.createdAt).toLocaleDateString("en-GH")}
                </span>
                <span className="font-bold text-emerald-600">
                  +{formatCurrency(reward.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
