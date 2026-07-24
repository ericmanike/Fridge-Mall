"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast , ToastContainer} from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { User, Phone, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Gift, ArrowLeft, ShieldCheck } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [referredBy, setReferredBy] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false)
  const [ussdCode, setUssdCode] = useState('*928*01#')


  useEffect(() => {
    const savedCode = localStorage.getItem("fridgemall-referredby") || "";
    if (savedCode) {
      setReferredBy(savedCode);
    }
  }, []);

  // Send OTP and proceed to step 2
  const handleStartSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }
    
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || "Failed to send verification code");
      }

      setUssdCode(data.ussd_code || '*928*01#');
      toast.success("Verification code sent to your phone");
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP and complete registration
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid verification code");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Verify OTP with Arkesel
      const verifyRes = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.message || verifyData.error || "Invalid or expired verification code");
      }

      // 2. Complete User Registration
      const cleanEmail = email.trim().toLowerCase();
      const codeToUse = referredBy.trim() || localStorage.getItem("fridgemall-referredby") || "";

      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: cleanEmail,
          password,
          phone,
          referredBy: codeToUse,
        }),
      });

      const regData = await regRes.json();

      if (!regRes.ok) {
        throw new Error(regData.message || "Registration failed");
      }

      // 3. Log in user automatically
      const loginRes = await signIn("credentials", {
        email: cleanEmail,
        password,
        redirect: false,
        callbackUrl: sessionStorage.getItem("callbackUrl") || "/dashboard",
      });

      if (loginRes?.error) {
        toast.error(loginRes.error === "CredentialsSignin" ? "Invalid email or password" : loginRes.error);
      } else if (loginRes?.ok) {
        toast.success("Account created successfully!");
        const targetUrl = loginRes.url || sessionStorage.getItem("callbackUrl") || "/dashboard";
        router.push(targetUrl);
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!phone) {
      toast.error("Phone number is required");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || "Failed to resend code");
      }

      toast.success("Verification code resent successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code");
    } finally {
      setSending(false);
    }
  };

  if (step === 1) {
    return (
      <div className="w-full rounded-[24px] border border-slate-100 bg-white p-7 shadow-[0_10px_35px_rgba(0,0,0,0.04)] sm:p-9 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Title & Subtitle */}
        <ToastContainer position="bottom-right" 
        autoClose={6000} hideProgressBar={true} 
        closeButton={true} />
        <div className="mb-6 space-y-1 text-left">
          <h1 className="text-[22px] font-bold tracking-tight text-[#0f172a]">
            Create account
          </h1>
          <p className="text-[13px] font-medium text-slate-500">
            Sign up to get started as a reseller
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleStartSignUp} className="space-y-4">
          {/* Full Name input */}
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 text-slate-400">
              <User className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <input
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="block w-full rounded-xl border border-slate-200 bg-[#f4f5f7] py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400"
            />
          </div>

          {/* phone input */}
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 text-slate-400">
              <Phone className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <input
              type="text" 
              required
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number (e.g. 0544919953)"
              className="block w-full rounded-xl border border-slate-200 bg-[#f4f5f7] py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400"
            />
          </div>

          {/* Email input */}
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 text-slate-400">
              <Mail className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="block w-full rounded-xl border border-slate-200 bg-[#f4f5f7] py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400"
            />
          </div>

          {/* Password Input */}
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 text-slate-400">
              <Lock className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="block w-full rounded-xl border border-slate-200 bg-[#f4f5f7] py-3.5 pl-12 pr-12 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400"
            />
            {/* Password Visibility Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 z-10 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" strokeWidth={1.8} />
              ) : (
                <Eye className="h-5 w-5" strokeWidth={1.8} />
              )}
            </button>
          </div>

          {/* Referral Code input */}
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 text-slate-400">
              <Gift className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <input
              type="text"
              value={referredBy}
              onChange={(e) => setReferredBy(e.target.value.toUpperCase())}
              placeholder="Referral Code (Optional)"
              className="block w-full rounded-xl border border-slate-200 bg-[#f4f5f7] py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400 uppercase font-mono tracking-wider"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !name || !phone || !email || !password}
            className="relative flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0066ffbc] py-3.5 px-4 text-sm font-bold text-white shadow-sm transition-all duration-200 cursor-pointer select-none active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <>
                Continue & Verify Phone
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        {/* Footer Switch Page link */}
        <p className="mt-6 text-center text-[13px] font-medium text-slate-500">
          Already have an account?{" "}
          <Link
            href="/auth/signIn"
            className="font-bold text-[#fb923c] hover:text-[#f97316] transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    );
  } else {
    return (
      <div className="w-full rounded-[24px] border border-slate-100 bg-white p-7 shadow-[0_10px_35px_rgba(0,0,0,0.04)] sm:p-9 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to details
        </button>

        {/* Title & Subtitle */}
        <div className="mb-6 space-y-1 text-left">
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-bold tracking-tight text-[#0f172a]">
              Verify Your Phone
            </h1>
            
          </div>
          <p className="text-[13px] font-medium text-slate-500">
            We sent an SMS verification code to <span className="font-semibold text-slate-700">{phone}</span>
          </p>
        </div>

        <form onSubmit={handleVerifyAndRegister} className="space-y-4">
          {/* Verification Code Input */}
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-4 text-slate-400">
              <Lock className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <input
              type="text"
              required
              autoFocus
              maxLength={6}
              inputMode="numeric"
              pattern="\d{6}"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-Digit Code"
              className="block w-full rounded-xl border border-slate-200 bg-[#f4f5f7] py-3.5 pl-12 pr-4 text-center text-lg font-bold letter-spacing-2 text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400 tracking-widest font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !otp}
            className="relative flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0066ffbc] py-3.5 px-4 text-sm font-bold text-white shadow-sm transition-all duration-200 cursor-pointer select-none active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <>
                Verify & Create Account
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </>
            )}
          </button>

          {/* Resend Code Button */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={sending}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
            >
              {sending ? "Resending code..." : "Didn't receive code? Resend SMS"}
            </button>
          </div>

          {/* USSD fallback hint */}
          <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
            <p className="text-[12px] text-slate-900">
              Still no code? Dial{" "}
              <a
                href={`tel:${ussdCode}`}
                className="font-bold text-slate-700 tracking-widest hover:text-blue-600 transition-colors"
              >
                {ussdCode}
              </a>{" "}
              from your phone to retrieve it.
            </p>
          </div>
        </form>
        <ToastContainer
        position="bottom-right"
        autoClose={6000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      </div>
    );
  }
}