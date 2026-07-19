import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Order from "@/models/Order";
import WithdrawalRequest from "@/models/WithdrawalRequest";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let requests;
    if (currentUser.role === "admin") {
      requests = await WithdrawalRequest.find().sort({ createdAt: -1 });
    } else {
      requests = await WithdrawalRequest.find({ userId: currentUser._id }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ requests });
  } catch (error: any) {
    console.error("GET withdrawals API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { amount, referralCode } = await req.json();
    if (typeof amount !== "number" || amount <= 0 || !referralCode) {
      return NextResponse.json({ message: "Invalid amount or referral code" }, { status: 400 });
    }

    await dbConnect();
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const walletBalance = currentUser.walletBalance || 0;

    if (amount > walletBalance) {
      return NextResponse.json(
        { message: `Insufficient earnings. Max withdrawable balance: GHS ${walletBalance.toFixed(2)}` },
        { status: 400 }
      );
    }

    const newRequest = await WithdrawalRequest.create({
      userId: currentUser._id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      amount,
      status: "pending",
    });

    return NextResponse.json(
      { message: "Withdrawal request submitted successfully", request: newRequest },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST withdrawals API error:", error);
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

    const { requestId, status } = await req.json();
    if (!requestId || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ message: "Invalid request ID or status" }, { status: 400 });
    }

    const updatedRequest = await WithdrawalRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json({ message: "Withdrawal request not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: `Withdrawal request status updated to ${status} successfully`,
      request: updatedRequest,
    });
  } catch (error: any) {
    console.error("PUT withdrawals API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
