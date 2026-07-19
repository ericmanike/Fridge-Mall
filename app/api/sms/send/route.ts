import { NextResponse } from "next/server";
import { sendSms } from "@/lib/sms";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { recipient, message, ref, senderid, messages } = body;

    const payload = messages || (recipient && message ? { recipient, message, ref } : null);

    if (!payload) {
      return NextResponse.json(
        { message: "Invalid payload. Provide recipient & message, or messages array." },
        { status: 400 }
      );
    }

    const result = await sendSms(payload, { senderid });

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: any) {
    console.error("API send SMS error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error?.message },
      { status: 500 }
    );
  }
}
