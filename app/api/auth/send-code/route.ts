import { NextResponse } from 'next/server';
import { generateArkeselOTP } from '@/lib/arkesel';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { phone, sender_id, senderId, message, expiry, length } = body;

    if (!phone || phone.length !== 10) {
      return NextResponse.json(
        { success: false, message: 'Phone number  must be exactly 10 digits' },
        { status: 400 }
      ); 
    }

    if (phone.startsWith("+233")) {
     return NextResponse.json(
       { success: false, message: 'Phone number  must not start with country code' },
       { status: 400 }
     ); 
    }
    

       const existingUser = await User.findOne({ phone });
        if (existingUser) {
            console.log("User with this phone number already exists", existingUser);
            return NextResponse.json(

              
                { message: "User with this phone number already exists" },
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
        message: result.message || 'OTP code sent successfully',
        data: result.data
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to send OTP code' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('[SEND CODE API ERROR]', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
