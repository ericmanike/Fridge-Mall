
import { ReferralReward } from "./types";
import dbConnect from './mongoose';
import User from '@/models/User';
import { getSession } from "next-auth/react";
import { authOptions } from "./auth";

export const REFERRAL_REWARD_AMOUNT = 50;
export const REFERRAL_CODE_KEY = "fridgemall-referral-code";
export const REFERRAL_REWARDS_KEY = "fridgemall-referral-rewards";


// async function getUserCode(){
//   const session = await getSession();
//   if (!session?.user?.email) {
//     throw new Error("Unauthorized");
//   }
//   await dbConnect();
//   const user = await User.findOne({ email: session.user.email });
//   if (!user) {
//     throw new Error("User not found");
//   }
//   return user.code || "";
// }




function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "FM";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function getOrCreateReferralCode(): string {
  if (typeof window === "undefined") return "FM------";
  const existing = localStorage.getItem(REFERRAL_CODE_KEY);
  if (existing) return existing;
  const code = generateCode();
  localStorage.setItem(REFERRAL_CODE_KEY, code);
  return code;
}

export function getReferralRewards(): ReferralReward[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(REFERRAL_REWARDS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ReferralReward[];
  } catch {
    return [];
  }
}

export function addReferralReward(
  referrerCode: string,
  orderId: string
): ReferralReward {
  const reward: ReferralReward = {
    id: `ref-${Date.now()}`,
    referrerCode,
    orderId,
    amount: REFERRAL_REWARD_AMOUNT,
    createdAt: new Date().toISOString(),
  };

  const rewards = getReferralRewards();
  rewards.unshift(reward);
  localStorage.setItem(REFERRAL_REWARDS_KEY, JSON.stringify(rewards));
  return reward;
}

export function getTotalReferralEarnings(): number {
  return getReferralRewards().reduce((sum, r) => sum + r.amount, 0);
}
