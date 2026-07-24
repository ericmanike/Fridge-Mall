export interface GenerateOTPOptions {
  number: string;
  sender_id?: string;
  message?: string;
  expiry?: number;
  length?: number;
  type?: 'numeric' | 'alpha' | 'alphanumeric';
  medium?: 'sms' | 'voice';
}

export interface VerifyOTPOptions {
  number: string;
  code: string;
}

/**
 * Clean and format Ghana / international phone numbers to standard Arkesel format (e.g. 233544919953)
 */
export function formatArkeselPhone(phone: string): string {
  let cleaned = String(phone).replace(/[\s\-\+\(\)]/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '233' + cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Generate and send OTP via Arkesel OTP API
 * Endpoint: https://sms.arkesel.com/api/otp/generate
 */
export async function generateArkeselOTP(options: GenerateOTPOptions) {
  const apiKey = process.env.ARKESEL_API_KEY || process.env.NEXT_PUBLIC_ARKESEL_API_KEY;
  const formattedNumber = formatArkeselPhone(options.number);
  const senderId = options.sender_id || process.env.ARKESEL_SENDER_ID || 'Arkesel';
  const message = options.message || 'This is OTP from Arkesel, %otp_code%';

  if (!apiKey) {
    console.warn('[ARKESEL OTP] Warning: ARKESEL_API_KEY is not configured in environment variables.');
  }

  const payload = {
    expiry: options.expiry ?? 5,
    length: options.length ?? 6,
    medium: options.medium || 'sms',
    message,
    number: formattedNumber,
    sender_id: senderId,
    type: options.type || 'numeric'
  };

  console.log('[ARKESEL GENERATE OTP REQUEST]', payload);

  try {
    const res = await fetch('https://sms.arkesel.com/api/otp/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey || ''
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('[ARKESEL GENERATE OTP RESPONSE]', res.status, data);

    if (res.ok && (data.code === '1000' || data.code === 1000 || data.status === 'success')) {
      return {
        success: true,
        message: data.message || 'OTP generated successfully',
        data: data.data || data
      };
    }

    return {
      success: false,
      error: data.message || data.error || 'Failed to generate OTP',
      data
    };
  } catch (error: any) {
    console.error('[ARKESEL GENERATE OTP ERROR]', error);
    return {
      success: false,
      error: error.message || 'Network error while generating OTP'
    };
  }
}

/**
 * Verify OTP code via Arkesel OTP API
 * Endpoint: https://sms.arkesel.com/api/otp/verify
 */
export async function verifyArkeselOTP(options: VerifyOTPOptions) {
  const apiKey = process.env.ARKESEL_API_KEY || process.env.NEXT_PUBLIC_ARKESEL_API_KEY;
  const formattedNumber = formatArkeselPhone(options.number);

  if (!apiKey) {
    console.warn('[ARKESEL OTP] Warning: ARKESEL_API_KEY is not configured in environment variables.');
  }

  const payload = {
    code: String(options.code).trim(),
    number: formattedNumber
  };

  console.log('[ARKESEL VERIFY OTP REQUEST]', payload);

  try {
    const res = await fetch('https://sms.arkesel.com/api/otp/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey || ''
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('[ARKESEL VERIFY OTP RESPONSE]', res.status, data);

    if (res.ok && (data.code === '1000' || data.code === 1000 || data.message?.toLowerCase().includes('success'))) {
      return {
        success: true,
        message: data.message || 'OTP verified successfully',
        data: data.data || data
      };
    }

    return {
      success: false,
      error: data.message || data.error || 'Invalid or expired OTP',
      data
    };
  } catch (error: any) {
    console.error('[ARKESEL VERIFY OTP ERROR]', error);
    return {
      success: false,
      error: error.message || 'Network error while verifying OTP'
    };
  }
}
