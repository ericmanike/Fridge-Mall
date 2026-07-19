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

    const { amount, referralCode, momoNumber, beneficiaryName } = await req.json();
    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount < 50) {
      return NextResponse.json({ message: "Minimum withdrawal amount is GHS 50.00" }, { status: 400 });
    }

    if (!referralCode) {
      return NextResponse.json({ message: "Missing referral code" }, { status: 400 });
    }

    if (!momoNumber || !momoNumber.trim() || !beneficiaryName || !beneficiaryName.trim()) {
      return NextResponse.json({ message: "MoMo number and beneficiary name are required" }, { status: 400 });
    }

    await dbConnect();
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const code = currentUser.code ? currentUser.code.trim() : "";
    const userOrdersCount = code
      ? await Order.countDocuments({ referralCodeUsed: { $regex: new RegExp(`^${code}$`, "i") } })
      : 0;
    const totalEarned = Math.max(currentUser.walletBalance || 0, userOrdersCount * 50);

    const existingRequests = await WithdrawalRequest.find({
      userId: currentUser._id,
      status: { $in: ["pending", "approved"] },
    });
    const totalRequested = existingRequests.reduce((sum, r) => sum + r.amount, 0);
    const withdrawableBalance = Math.max(0, totalEarned - totalRequested);

    if (numericAmount > withdrawableBalance) {
      return NextResponse.json(
        { message: `Insufficient earnings. Available withdrawable balance: GHS ${withdrawableBalance.toFixed(2)}` },
        { status: 400 }
      );
    }

    const newRequest = await WithdrawalRequest.create({
      userId: currentUser._id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      amount: numericAmount,
      momoNumber: momoNumber.trim(),
      beneficiaryName: beneficiaryName.trim(),
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

export async function DELETE(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing request id" }, { status: 400 });
    }

    const deletedRequest = await WithdrawalRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return NextResponse.json({ message: "Withdrawal request not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Withdrawal request deleted successfully" });
  } catch (error: any) {
    console.error("DELETE withdrawals API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

