import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { name, email, password, phone, referredBy } = await req.json();

        if (!name || !email || !password || !phone) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const cleanEmail = email.trim().toLowerCase();
        await dbConnect();

   

        // Validate referredBy code if provided
        let validReferredBy = undefined;
        if (referredBy) {
            const referrer = await User.findOne({ code: referredBy });
            if (referrer) {
                validReferredBy = referredBy;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: cleanEmail,
            password: hashedPassword,
            phone,
            referredBy: validReferredBy,
        });

        return NextResponse.json(
            { message: "User created successfully", user: { id: user._id, name: user.name, email: user.email } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "An error occurred while registering the user." },
            { status: 500 }
        );
    }
}
