import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
// @ts-ignore
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // 1. Authorize Admin
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
    }

    // 2. Parse request body for params to sign
    const body = await req.json();
    const { paramsToSign } = body;
    if (!paramsToSign) {
      return NextResponse.json({ message: "Missing paramsToSign" }, { status: 400 });
    }

    // 3. Generate secure signature
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({ signature }, { status: 200 });
  } catch (error: any) {
    console.error("Cloudinary signing API error:", error);
    return NextResponse.json(
      { message: "Failed to generate Cloudinary upload signature: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
