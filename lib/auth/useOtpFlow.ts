"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { ConfirmationResult } from "firebase/auth";
import { signInWithPhoneNumber } from "firebase/auth";
import { getFirebaseAuth, RecaptchaVerifier } from "@/lib/firebase/client";

export type OtpFlowStep = "phone" | "otp";
export type OtpFlowLoading = "idle" | "sending" | "verifying" | "resending";
export type OtpFlowMessage = { type: "error" | "success"; text: string };

export interface UseOtpFlowOptions {
  /** Called after the server confirms the Firebase ID token is valid. `data` is the parsed verify-endpoint response body. */
  onVerified: (phone: string, data: any) => void | Promise<void>;
  /** Server endpoint that accepts `{ idToken }` and performs the app-specific login/update logic. */
  verifyEndpoint?: string;
  /** HTTP method used for the verify call — some endpoints (e.g. phone-change) verify via PATCH. */
  verifyMethod?: "POST" | "PATCH";
}

const DEFAULT_VERIFY = "/api/auth/firebase-verify";

export function useOtpFlow({
  onVerified,
  verifyEndpoint = DEFAULT_VERIFY,
  verifyMethod = "POST",
}: UseOtpFlowOptions) {
  const [step, setStep] = useState<OtpFlowStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState<OtpFlowLoading>("idle");
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState<OtpFlowMessage | null>(null);

  // Tracks the digit-count at the previous keystroke so auto-send fires only on the
  // transition into a complete 10-digit number, not on every render while already complete.
  const prevLenRef = useRef(0);

  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Invisible reCAPTCHA needs a real DOM node; each hook instance gets its own hidden container.
  useEffect(() => {
    const div = document.createElement("div");
    div.style.display = "none";
    document.body.appendChild(div);
    containerRef.current = div;
    return () => {
      verifierRef.current?.clear();
      verifierRef.current = null;
      div.remove();
    };
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const getVerifier = useCallback(() => {
    if (verifierRef.current) return verifierRef.current;
    if (!containerRef.current) throw new Error("reCAPTCHA container not ready");
    const verifier = new RecaptchaVerifier(getFirebaseAuth(), containerRef.current, {
      size: "invisible",
    });
    verifierRef.current = verifier;
    return verifier;
  }, []);

  const send = useCallback(
    async (isResend = false, phoneOverride?: string) => {
      const targetPhone = phoneOverride ?? phone;
      if (targetPhone.length !== 10) {
        toast.error("Please enter a valid 10-digit mobile number");
        return false;
      }
      setLoading(isResend ? "resending" : "sending");
      try {
        const verifier = getVerifier();
        confirmationRef.current = await signInWithPhoneNumber(
          getFirebaseAuth(),
          `+91${targetPhone}`,
          verifier,
        );

        setStep("otp");
        setCooldown(30);
        const successText = isResend ? "OTP resent successfully" : "OTP sent successfully";
        setMessage({ type: "success", text: successText });
        setTimeout(() => {
          setMessage((prev) =>
            prev?.type === "success" && prev?.text === successText ? null : prev,
          );
        }, 4000);
        return true;
      } catch (e) {
        // The reCAPTCHA token is single-use — drop the verifier so the next attempt renders a fresh one.
        verifierRef.current?.clear();
        verifierRef.current = null;
        const msg = e instanceof Error ? e.message : "Failed to send OTP";
        toast.error(msg);
        return false;
      } finally {
        setLoading("idle");
      }
    },
    [phone, getVerifier],
  );

  const setPhoneDigit = useCallback(
    (raw: string) => {
      const digits = raw.replace(/\D/g, "").slice(0, 10);
      setPhone(digits);
      setMessage(null);
      if (digits.length === 10 && prevLenRef.current !== 10) {
        void send(false, digits);
      }
      prevLenRef.current = digits.length;
    },
    [send],
  );

  const setOtpDigit = useCallback((raw: string) => {
    setOtp(raw.replace(/\D/g, "").slice(0, 6));
    setMessage(null);
  }, []);

  const resend = useCallback(async () => {
    if (cooldown > 0) return;
    await send(true);
  }, [send, cooldown]);

  const verify = useCallback(async () => {
    if (otp.length !== 6) return;
    if (!confirmationRef.current) {
      toast.error("Please request a new OTP");
      return;
    }
    setLoading("verifying");
    try {
      const credential = await confirmationRef.current.confirm(otp);
      const idToken = await credential.user.getIdToken();

      const res = await fetch(verifyEndpoint, {
        method: verifyMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Verification failed");
      await onVerified(phone, data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid OTP";
      toast.error(msg);
      setMessage({ type: "error", text: "Enter a valid OTP" });
    } finally {
      setLoading("idle");
    }
  }, [otp, phone, verifyEndpoint, verifyMethod, onVerified]);

  /** Returns to the phone step so the number can be corrected; re-arms auto-send for the next completed entry. */
  const editNumber = useCallback(() => {
    setStep("phone");
    setOtp("");
    setMessage(null);
    prevLenRef.current = 0;
  }, []);

  const reset = useCallback(() => {
    setStep("phone");
    setPhone("");
    setOtp("");
    setMessage(null);
    setLoading("idle");
    setCooldown(0);
    prevLenRef.current = 0;
    confirmationRef.current = null;
  }, []);

  return {
    step,
    phone,
    otp,
    loading,
    cooldown,
    message,
    setPhoneDigit,
    setOtpDigit,
    send,
    resend,
    verify,
    editNumber,
    reset,
  };
}
