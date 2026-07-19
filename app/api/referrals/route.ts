import User from "@/models/User";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const code = user.code ? user.code.trim() : "";
        
        const referredUsers = code
            ? await User.find({ referredBy: { $regex: new RegExp(`^${code}$`, "i") } }).select("name email createdAt")
            : [];
        
        // Find orders where referralCodeUsed === user.code
        const orders = code
            ? await Order.find({ referralCodeUsed: { $regex: new RegExp(`^${code}$`, "i") } }).sort({ createdAt: -1 })
            : [];

        const rewards = orders.map((order) => ({
            id: order._id.toString(),
            referrerCode: order.referralCodeUsed || "",
            orderId: order.orderId,
            amount: 50,
            status: order.status,
            createdAt: order.createdAt.toISOString(),
        }));

        const totalEarnings = user.walletBalance || 0;

        return NextResponse.json({
            code,
            referredUsers,
            rewards,
            totalEarnings,
            successfulReferralsCount: referredUsers.length,
        });
    } catch (error) { 
        console.error("Error fetching referrals:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}