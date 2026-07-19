/**
 * Utility for sending SMS via Moolre SMS API.
 * Documentation: POST https://api.moolre.com/open/sms/send
 */

export interface SmsMessage {
  /** Recipient phone number (e.g. "23324XXXXXXX" or "024XXXXXXX") */
  recipient: string;
  /** SMS text body */
  message: string;
  /** Optional reference string for tracking */
  ref?: string;
}

export interface SendSmsOptions {
  /** Approved Sender ID (max 11 chars). Defaults to process.env.MOOLRE_SENDER_ID || "FridgeMall" */
  senderid?: string;
  /** VAS Key for authentication. Defaults to process.env.MOOLRE_VAS_KEY */
  vaskey?: string;
}

export interface MoolreApiResponse {
  status: number; // 1 for success, 0 for failure
  code: string;
  message: string;
  data?: any;
  go?: any;
}

export interface SendSmsResult {
  success: boolean;
  status: number;
  code: string;
  message: string;
  data?: any;
  error?: string;
}

/**
 * Normalizes a phone number to standard international format without '+' sign.
 * E.g., '0241234567' -> '233241234567'
 */
export function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "233" + cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Sends single or bulk SMS messages using Moolre SMS API.
 *
 * @param messages A single message object or array of message objects.
 * @param options Optional sender ID or VAS key overrides.
 * @returns Promise<SendSmsResult>
 *
 * @example
 * // Single SMS
 * const res = await sendSms({
 *   recipient: "0241234567",
 *   message: "Your order #1001 has been confirmed!"
 * });
 *
 * @example
 * // Bulk SMS
 * const res = await sendSms([
 *   { recipient: "0241234567", message: "Hello John" },
 *   { recipient: "0209876543", message: "Hello Mary" },
 * ]);
 */
export async function sendSms(
  messages: SmsMessage | SmsMessage[],
  options?: SendSmsOptions
): Promise<SendSmsResult> {
  const vaskey = options?.vaskey || process.env.MOOLRE_VAS_KEY;
  const senderid = options?.senderid || process.env.MOOLRE_SENDER_ID || "FridgeMall";

  if (!vaskey) {
    console.error("sendSms error: MOOLRE_VAS_KEY environment variable or option is not set.");
    return {
      success: false,
      status: 0,
      code: "MISSING_KEY",
      message: "Authentication error: MOOLRE_VAS_KEY is not configured.",
      error: "MOOLRE_VAS_KEY is missing",
    };
  }

  const messageList: SmsMessage[] = Array.isArray(messages) ? messages : [messages];

  if (messageList.length === 0) {
    return {
      success: false,
      status: 0,
      code: "EMPTY_MESSAGES",
      message: "No messages provided to send.",
    };
  }

  // Format recipient numbers
  const formattedMessages = messageList.map((msg) => ({
    recipient: normalizePhoneNumber(msg.recipient),
    message: msg.message,
    ...(msg.ref ? { ref: msg.ref } : {}),
  }));

  const payload = {
    type: 1,
    senderid: senderid.slice(0, 11), // Sender ID max 11 chars
    messages: formattedMessages,
  };

  try {
    const response = await fetch("https://api.moolre.com/open/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-VASKEY": vaskey,
      },
      body: JSON.stringify(payload),
    });

    const data: MoolreApiResponse = await response.json();

    if (response.ok && data.status === 1) {
      return {
        success: true,
        status: data.status,
        code: data.code || "SMS01",
        message: data.message || "Success",
        data: data.data,
      };
    } else {
      return {
        success: false,
        status: data.status ?? response.status,
        code: data.code || "SMS_FAILED",
        message: data.message || "Failed to send SMS.",
        data: data.data,
        error: data.message,
      };
    }
  } catch (error: any) {
    console.error("sendSms request exception:", error);
    return {
      success: false,
      status: 0,
      code: "NETWORK_ERROR",
      message: "An error occurred while sending SMS request.",
      error: error?.message || String(error),
    };
  }
}

export default sendSms;
