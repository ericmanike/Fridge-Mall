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
    const userEmail = session.user.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletBalance: user.walletBalance,
      phone: user.phone || "",
      createdAt: user.createdAt,
    });
  } catch (error: any) {
    console.error("GET user API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { action, role, walletBalance } = await req.json();
    await dbConnect();
    const userEmail = session.user.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (action === "toggleRole") {
      user.role = user.role === "admin" ? "user" : "admin";
      await user.save();
      return NextResponse.json({ message: `Role toggled to ${user.role}`, role: user.role });
    }

    if (action === "addFunds") {
      user.walletBalance = (user.walletBalance || 0) + 1000;
      await user.save();
      return NextResponse.json({ message: "Funds added", walletBalance: user.walletBalance });
    }

    if (action === "updateProfile") {
      // General profile update
      if (role && ["user", "agent", "admin", "moderator"].includes(role)) {
        user.role = role as any;
      }
      if (typeof walletBalance === "number") {
        user.walletBalance = walletBalance;
      }
      await user.save();
      return NextResponse.json({ message: "Profile updated successfully", role: user.role, walletBalance: user.walletBalance });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST user API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
