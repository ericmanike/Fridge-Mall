"use client";

import { useEffect, useState } from "react";
import { Copy, Share2, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { REFERRAL_REWARD_AMOUNT } from "@/lib/referral";
import { formatCurrency } from "@/lib/utils";

export default function ReferralPage() {
  const { data: session, status } = useSession();
  const [code, setCode] = useState("");
  const [rewards, setRewards] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [successfulReferralsCount, setSuccessfulReferralsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (status !== "authenticated") {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/user/referrals");
        if (res.ok) {
          const data = await res.json();
          setCode(data.code || "");
          setRewards(data.rewards || []);
          setTotalEarnings(data.totalEarnings || 0);
          setSuccessfulReferralsCount(data.referredUsersCount || 0);
        }
      } catch (err) {
        console.error("Error fetching referral data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading") {
      fetchReferralData();
    }
  }, [status]);

  const referralLink = `${baseUrl}?refferedby=${code}`;

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  const shareText = `Get quality fridges with FREE delivery at Fridge Mall! Use my referral code ${code} when you order and I'll earn ${formatCurrency(REFERRAL_REWARD_AMOUNT)}. Shop now!`;

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#0066FF]" />
        <p className="mt-3 text-sm text-slate-500 font-bold">Loading your dashboard...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div className="mx-auto w-full max-w-4xl bg-white px-4 py-20 text-center sm:px-6">
        <div className="rounded-3xl bg-linear-to-br from-[#632cf5] to-[#4F46E5] p-10 text-white shadow-xl max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight">Refer &amp; Earn GHS 50</h1>
          <p className="mt-4 text-purple-100/90 leading-relaxed text-sm">
            Unlock your unique referral code and start earning commissions immediately. Share Fridge Mall with friends, and when they buy, you earn GHS 50 on their successful delivery!
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/login"
              className="w-full sm:w-auto rounded-full bg-white text-[#4F46E5] hover:bg-purple-50 px-8 py-3.5 text-sm font-bold transition-all shadow-md hover:scale-[1.02] cursor-pointer"
            >
              Sign In to start
            </Link>
            <Link
              href="/auth/signUp"
              className="w-full sm:w-auto rounded-full border border-purple-200/50 bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 text-sm font-bold transition-all hover:scale-[1.02] cursor-pointer"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            className="inline-flex items-center gap-2 rounded-xl bg-[#0066FF] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0066ffbc] cursor-pointer transition"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied!" : "Copy code"}
          </button>
        </div>

        {/* Shareable Link */}
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
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition cursor-pointer select-none"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedLink ? "Copied!" : "Copy link"}
            </button>
          </div>
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
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition"
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
            {successfulReferralsCount}
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
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm animate-in fade-in"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">Order {reward.orderId}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(reward.createdAt).toLocaleDateString("en-GH")} · Status: <span className="capitalize font-semibold text-slate-650">{reward.status}</span>
                  </span>
                </div>
                <span className={`font-bold ${reward.status === "delivered" ? "text-emerald-600" : "text-amber-500"}`}>
                  {reward.status === "delivered" ? "+" : ""}{formatCurrency(reward.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
