import { NextResponse } from 'next/server';
import { verifyArkeselOTP } from '@/lib/arkesel';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, code, otp } = body;

    const otpCode = code || otp;

    if (!phone || !otpCode) {
      return NextResponse.json(
        { success: false, message: 'Phone number and verification code are required' },
        { status: 400 }
      );
    }

    const result = await verifyArkeselOTP({
      number: phone,
      code: String(otpCode)
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message || 'OTP verified successfully',
        data: result.data
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error || 'Invalid or expired verification code' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('[VERIFY CODE API ERROR]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
