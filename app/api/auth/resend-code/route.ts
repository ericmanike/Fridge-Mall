import { NextResponse } from 'next/server';
import { generateArkeselOTP } from '@/lib/arkesel';


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, sender_id, senderId, message, expiry, length } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    const result = await generateArkeselOTP({
      number: phone,
      sender_id: sender_id || senderId,
      message,
      expiry,
      length
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message || 'OTP code resent successfully',
        data: result.data
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to resend OTP code' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('[RESEND CODE API ERROR]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
