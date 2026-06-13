import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
    }

    // Retrieve all users (excluding password field)
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("GET admin users API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
    }

    const { userId, role, walletBalance } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Role validation
    if (role) {
      if (!["user", "agent", "admin", "moderator"].includes(role)) {
        return NextResponse.json({ message: "Invalid role value" }, { status: 400 });
      }
      targetUser.role = role;
    }

    // Wallet balance validation
    if (typeof walletBalance === "number") {
      if (walletBalance < 0) {
        return NextResponse.json({ message: "Balance cannot be negative" }, { status: 400 });
      }
      targetUser.walletBalance = walletBalance;
    }

    await targetUser.save();

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        walletBalance: targetUser.walletBalance,
      },
    });
  } catch (error: any) {
    console.error("PUT admin users API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
