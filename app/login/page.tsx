"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useOtpFlow } from "@/lib/auth/useOtpFlow";
import { OtpStep } from "@/components/auth/OtpStep";

const IS_DEV = process.env.NEXT_PUBLIC_NODE_ENV === "development";

export default function LoginPage() {
  const router = useRouter();

  const otpFlow = useOtpFlow({
    onVerified: () => {
      toast.success("Logged in");
      router.push("/account");
    },
  });

  async function devLogin() {
    try {
      const res = await fetch("/api/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: otpFlow.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Dev login failed");
      toast.success("Logged in (dev)");
      router.push("/account");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Dev login failed");
    }
  }

  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-[1920px] px-4 py-[60px] sm:px-6 sm:py-[80px] lg:px-4 lg:px-[50px]">
        <h1 className="font-outfit text-[45px] font-semibold tracking-[1.35px] text-text-main">
          Login
        </h1>

        <div className="mt-10 max-w-[640px] rounded-[13px] border border-black/15 bg-white p-6">
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
          />

          {otpFlow.step === "phone" && IS_DEV && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px bg-black/10" />
                <span className="font-outfit text-[11px] font-semibold text-orange-500 bg-orange-50 border border-orange-200 rounded px-2 py-0.5 uppercase tracking-wider">
                  Dev Only
                </span>
                <div className="flex-1 h-px bg-black/10" />
              </div>
              <button
                disabled={otpFlow.loading !== "idle" || otpFlow.phone.length !== 10}
                onClick={devLogin}
                className="h-[68px] w-full rounded-[15px] border-2 border-dashed border-orange-400 bg-orange-50 font-outfit text-[18px] font-bold text-orange-600 uppercase tracking-wider disabled:opacity-50"
              >
                ⚡ Skip OTP (Dev Login)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
