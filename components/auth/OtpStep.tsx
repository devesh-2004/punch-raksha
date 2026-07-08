"use client";

import type { OtpFlowLoading, OtpFlowMessage } from "@/lib/auth/useOtpFlow";

interface OtpStepProps {
  step: "phone" | "otp";
  phone: string;
  otp: string;
  loading: OtpFlowLoading;
  cooldown: number;
  message: OtpFlowMessage | null;
  onPhoneChange: (raw: string) => void;
  onOtpChange: (raw: string) => void;
  onSend: () => void;
  onVerify: () => void;
  onResend: () => void;
  onEdit: () => void;
  heading?: string;
  subheading?: React.ReactNode;
  /** Extra content rendered between the phone input and the GET OTP button (e.g. a consent checkbox). */
  phoneExtra?: React.ReactNode;
  showLegalLinks?: boolean;
}

function keepCaretAtEnd(e: React.SyntheticEvent<HTMLInputElement>) {
  const target = e.target as HTMLInputElement;
  setTimeout(() => target.setSelectionRange(target.value.length, target.value.length), 0);
}

export function OtpStep({
  step,
  phone,
  otp,
  loading,
  cooldown,
  message,
  onPhoneChange,
  onOtpChange,
  onSend,
  onVerify,
  onResend,
  onEdit,
  heading = "Login to Continue",
  subheading,
  phoneExtra,
  showLegalLinks = true,
}: OtpStepProps) {
  if (step === "phone") {
    return (
      <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-right-4">
        {heading && (
          <div className="font-outfit text-[26px] font-semibold text-[#121212] text-center mt-[45px] mb-[45px] md:mt-0 md:mb-2">
            {heading}
          </div>
        )}
        {subheading ? (
          <div className="font-outfit text-[14px] text-[#767676] mb-6 text-center">
            {subheading}
          </div>
        ) : (
          <div className="mb-6" />
        )}

        <div className="w-full relative flex items-center h-[52px] rounded-[5px] border border-black/20 overflow-hidden focus-within:border-[#045830] transition-colors mb-4">
          <div className="flex shrink-0 items-center justify-center gap-2 bg-[#f8fcf9] px-4 h-full border-r border-black/10 font-outfit text-[16px] font-semibold text-[#121212]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://flagcdn.com/w20/in.png"
              alt="India Flag"
              className="w-[20px]"
            />
            <span>+91</span>
          </div>
          <input
            type="tel"
            placeholder="Enter Mobile Number"
            maxLength={10}
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            className="flex-1 h-full px-4 outline-none font-outfit text-[16px] text-[#121212] placeholder:text-[14px] md:placeholder:text-[16px] placeholder:text-[#767676]"
          />
        </div>

        {phoneExtra}

        <button
          onClick={onSend}
          disabled={loading !== "idle" || phone.length !== 10}
          className="w-full h-[52px] rounded-[5px] bg-[#045830] text-white font-outfit text-[16px] font-bold uppercase tracking-wider hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-6"
        >
          {loading === "sending" ? "SENDING..." : "GET OTP"}
        </button>

        {showLegalLinks && (
          <div className="text-center font-outfit text-[12px] text-[#767676] leading-relaxed max-w-[80%] mx-auto mb-4">
            By logging in, I agree to Punchraksh&apos;s{" "}
            <a href="/privacy-policy" className="underline hover:text-[#045830]">
              Privacy Policy
            </a>
            ,{" "}
            <a href="/refund-policy" className="underline hover:text-[#045830]">
              Return Policy
            </a>
            , and{" "}
            <a href="/terms" className="underline hover:text-[#045830]">
              T&amp;Cs
            </a>
            .
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-right-4">
      <div className="font-outfit text-[14px] text-[#767676] mb-8 text-center">
        OTP sent to +91 {phone}{" "}
        <button
          onClick={onEdit}
          className="text-[#045830] underline font-semibold ml-1"
        >
          Edit
        </button>
      </div>

      <div className="w-full relative flex items-center h-[52px] rounded-[5px] border border-black/20 overflow-hidden focus-within:border-[#045830] transition-colors mb-2">
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          value={otp}
          onChange={(e) => onOtpChange(e.target.value)}
          onClick={keepCaretAtEnd}
          onFocus={keepCaretAtEnd}
          onKeyUp={keepCaretAtEnd}
          onKeyDown={(e) => {
            if (e.key === "Enter") onVerify();
            if (
              ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(
                e.key,
              )
            ) {
              e.preventDefault();
            }
          }}
          className="flex-1 h-full px-4 text-center tracking-[10px] outline-none font-outfit text-[20px] font-bold text-[#121212] placeholder:text-[#767676] placeholder:tracking-normal placeholder:font-normal placeholder:text-[16px]"
        />
      </div>

      <div className="h-6 w-full flex items-start justify-center mb-2">
        {message && (
          <div
            className={`flex items-center gap-1.5 font-outfit text-[14px] font-semibold animate-in fade-in duration-300 ${
              message.type === "error" ? "text-red-500" : "text-green-600"
            }`}
          >
            {message.type === "error" ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      <button
        onClick={onVerify}
        disabled={loading !== "idle" || otp.length !== 6}
        className="w-full h-[52px] rounded-[5px] bg-[#045830] text-white font-outfit text-[16px] font-bold uppercase tracking-wider hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-6"
      >
        {loading === "verifying" ? "VERIFYING..." : "VERIFY OTP"}
      </button>

      <div className="text-center font-outfit text-[14px] text-[#767676]">
        Didn&apos;t receive code?{" "}
        <button
          onClick={onResend}
          disabled={cooldown > 0}
          className="text-[#045830] underline font-semibold ml-1 disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
        >
          {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}
