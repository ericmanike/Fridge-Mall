import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(req: Request) {
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

    let orders;
    if (currentUser.role === "admin") {
      // Admin can view all orders
      orders = await Order.find().sort({ createdAt: -1 });
    } else {
      // Regular user views only their own orders
      orders = await Order.find({
        $or: [{ userId: currentUser._id }, { "details.email": userEmail }],
      }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("GET orders API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { orderId, items, details, subtotal, deliveryFee, total, paymentMethod, status, referralCodeUsed } = body;

    if (!orderId || !items || !details || typeof subtotal !== "number" || typeof total !== "number") {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    let userId;
    let customerCode = null;
    let finalReferralCode = referralCodeUsed;

    if (session?.user?.email) {
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        userId = dbUser._id;
        customerCode = dbUser.code;
        if (!finalReferralCode && dbUser.referredBy) {
          finalReferralCode = dbUser.referredBy;
        }
      }
    }

    // Prevent self-referrals
    if (finalReferralCode && customerCode === finalReferralCode) {
      finalReferralCode = undefined;
    }

    // Double check that the referrer actually exists in the database
    if (finalReferralCode) {
      const referrerExists = await User.findOne({ code: finalReferralCode });
      if (!referrerExists) {
        finalReferralCode = undefined;
      }
    }

    // Map items to match IOrderItem schema
    const formattedItems = items.map((item: any) => ({
      productId: item.product.id || item.productId,
      name: item.product.name || item.name,
      brand: item.product.brand || item.brand,
      price: item.product.price || item.price,
      image: item.product.image || item.image,
      quantity: item.quantity,
    }));

    const newOrder = await Order.create({
      orderId,
      userId,
      items: formattedItems,
      details,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      status: status || "pending",
      referralCodeUsed: finalReferralCode,
      referralRewarded: false,
    });

    return NextResponse.json({ message: "Order stored in database", order: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("POST orders API error:", error);
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

    const { orderId, status, deliveryFee } = await req.json();
    if (!orderId) {
      return NextResponse.json({ message: "Missing orderId" }, { status: 400 });
    }

    const existingOrder = await Order.findOne({ orderId });
    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const updateFields: any = {};

    if (status) {
      if (!["pending", "processing", "delivered", "cancelled"].includes(status)) {
        return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
      }
      updateFields.status = status;
    }

    if (typeof deliveryFee === "number" && deliveryFee >= 0) {
      updateFields.deliveryFee = deliveryFee;
      updateFields.total = existingOrder.subtotal + deliveryFee;
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Process referral reward if order is delivered and not yet rewarded
    if (updatedOrder.status === "delivered" && updatedOrder.referralCodeUsed && !updatedOrder.referralRewarded) {
      const referrer = await User.findOne({ code: updatedOrder.referralCodeUsed });
      if (referrer) {
        referrer.walletBalance = (referrer.walletBalance || 0) + 50;
        await referrer.save();

        updatedOrder.referralRewarded = true;
        await updatedOrder.save();
      }
    }

    return NextResponse.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error: any) {
    console.error("PUT orders API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
