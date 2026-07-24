import { NextResponse } from 'next/server';

async function sendArkeselSMS(
  recipients: string[],
  message: string,
  senderId: string
) {
  const apiKey = process.env.ARKESEL_API_KEY;

  if (!apiKey) {
    return { success: false, error: 'ARKESEL_API_KEY missing'};
  }

  const payload = {
    sender: String(senderId).trim().substring(0, 11),
    message,
    recipients
  };

  console.log('[SMS ARKESEL REQUEST]', {
    sender: payload.sender,
    recipientCount: recipients.length,
    recipients,
    message
  });

  const res = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  console.log('[SMS ARKESEL RESPONSE]', data);

  if (data.status === 'success') {
    return { success: true, message: data.message, data: data.data };
  }

  return { success: false, message: data.message, error: data.message };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipient, message} = body;

    const senderId = process.env.ARKESEL_SENDER_ID || 'fridgemall';


    const result = await sendArkeselSMS([recipient], message, senderId);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });

  } catch (err: any) {
    console.error('[SMS API ROUTE ERROR]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
