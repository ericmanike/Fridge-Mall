import { NextResponse } from 'next/server';
import { generateArkeselOTP } from '@/lib/arkesel';
import User from '@/models/User';
import { otpRateLimit } from '@/lib/ratelimit';

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
       { success: false, message: 'Phone number  must  start 0' },
       { status: 400 }
     ); 
    }
   


 
    const [ipCheck] = await Promise.all([
                        otpRateLimit.limit(phone),
                    ]);


      if(!ipCheck.success ){
        return NextResponse.json({message:'Too many request! Try after 3 minutes '})
      }

      //  const existingUser = await User.findOne({ phone });
      //   if (existingUser) {
      //       console.log("User with this phone number already exists", existingUser);
      //       return NextResponse.json(

              
      //           { message: "User with this phone number already exists" },
      //           { status: 400 }
      //       );
      //   }

      

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
     if (!navigator.onLine) {
    console.error("Check your internet connection");
     return NextResponse.json(
      { success: false, message: 'Check your internet connection' },
      { status: 500 }); 
  }
    
    return NextResponse.json(
      { success: false, message: 'Something went wrong, please try again ' },
      { status: 500 }
    ); 
  }
}
