"use client";

import Image from "next/image";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { useOtpFlow } from "@/lib/auth/useOtpFlow";
import { OtpStep } from "@/components/auth/OtpStep";

const IS_DEV = process.env.NEXT_PUBLIC_NODE_ENV === "development";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phone: string) => void;
  isCheckout?: boolean;
}

export function AuthModal({ isOpen, onClose, onSuccess, isCheckout }: AuthModalProps) {
  const otpFlow = useOtpFlow({
    onVerified: (phone) => onSuccess(phone),
  });

  useEffect(() => {
    if (!isOpen) otpFlow.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  // ⚠️  DEV-ONLY — bypasses OTP entirely
  const handleDevLogin = async () => {
    if (otpFlow.phone.length !== 10) {
      toast.error("Enter a 10-digit phone number first");
      return;
    }
    try {
      const res = await fetch("/api/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: otpFlow.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Dev login failed");
      toast.success("Dev login successful!");
      onSuccess(otpFlow.phone);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Dev login failed");
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 flex w-full max-w-[850px] overflow-hidden rounded-[16px] bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#767676] hover:bg-black/10 hover:text-black transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Left Side: Branding */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center bg-[#045830] p-12 text-center text-white">
          <div className="relative h-[80px] w-[200px] mb-8">
            <Image
              src="/brand/footer-logo.svg"
              alt="PunchRaksha"
              fill
              className="object-contain"
            />
          </div>
          <div className="font-outfit text-[26px] font-semibold leading-tight tracking-wide">
            Welcome to Punchraksh’s Natural Wellness
          </div>
        </div>

        {/* Right Side: Auth Flow */}
        <div className="flex w-full md:w-1/2 flex-col justify-center px-6 py-10 md:px-12 md:py-14">
          <OtpStep
            step={otpFlow.step}
            phone={otpFlow.phone}
            otp={otpFlow.otp}
            loading={otpFlow.loading}
            cooldown={otpFlow.cooldown}
            message={otpFlow.message}
            onPhoneChange={otpFlow.setPhoneDigit}
            onOtpChange={otpFlow.setOtpDigit}
            onSend={() => otpFlow.send(false)}
            onVerify={otpFlow.verify}
            onResend={otpFlow.resend}
            onEdit={otpFlow.editNumber}
            heading="Login to Continue"
            subheading={isCheckout ? "Please login to proceed with your order" : undefined}
            phoneExtra={
              <label className="flex items-center gap-3 w-full mb-8 cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <div className="h-4 w-4 rounded-sm border border-black/30 peer-checked:bg-[#045830] peer-checked:border-[#045830] peer-checked:[&>svg]:opacity-100 transition-colors flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-white opacity-0 transition-opacity"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
                <span className="font-outfit text-[14px] text-[#767676]">
                  Notify me for any updates & offers
                </span>
              </label>
            }
          />

          {otpFlow.step === "phone" && (
            <>
              {IS_DEV && (
                <div className="w-full mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-px bg-black/10" />
                    <span className="font-outfit text-[11px] font-semibold text-orange-500 bg-orange-50 border border-orange-200 rounded px-2 py-0.5 uppercase tracking-wider">
                      Dev Only
                    </span>
                    <div className="flex-1 h-px bg-black/10" />
                  </div>
                  <button
                    onClick={handleDevLogin}
                    disabled={otpFlow.loading !== "idle" || otpFlow.phone.length !== 10}
                    className="w-full h-[46px] rounded-[5px] border-2 border-dashed border-orange-400 text-orange-600 bg-orange-50 font-outfit text-[14px] font-bold uppercase tracking-wider hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ⚡ Skip OTP (Dev Login)
                  </button>
                </div>
              )}

              <a
                href="https://wa.me/917405498441"
                target="_blank"
                className="text-center font-outfit text-[14px] text-[#767676] underline hover:text-[#045830]"
              >
                Trouble logging in?
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
}
