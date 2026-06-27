import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userEmail = session.user.email;
    const currentUser = await User.findOne({ email: userEmail });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 1. Get all users who were referred by this user
    const referredUsers = await User.find({ referredBy: currentUser.code }).select("name email createdAt");

    // 2. Get all orders where this user's referral code was used
    // Note: We only reward referrer if the order status is "delivered" in production, but let's count them
    const orders = await Order.find({ referralCodeUsed: currentUser.code }).sort({ createdAt: -1 });

    const rewards = orders.map((order) => ({
      id: order._id.toString(),
      referrerCode: order.referralCodeUsed || "",
      orderId: order.orderId,
      amount: 50, // 50 GHS reward
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    }));

    // Total earnings is based on orders that are delivered and rewarded (i.e. referralRewarded: true)
    const totalEarnings = orders
      .filter((order) => order.referralRewarded)
      .reduce((sum, order) => sum + 50, 0);

    return NextResponse.json({
      code: currentUser.code,
      referredBy: currentUser.referredBy || null,
      referredUsersCount: referredUsers.length,
      referredUsers,
      rewards,
      totalEarnings,
    });
  } catch (error: any) {
    console.error("GET user referrals API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
