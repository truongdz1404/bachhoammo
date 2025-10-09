"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OtpInput, OtpInputRef } from "@/components/ui/otp-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCountdown } from "@/hooks/use-countdown";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

interface PhoneVerificationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onVerificationSuccess?: () => void;
  verified?: boolean;
  onVerificationStatusChange?: (isVerified: boolean) => void;
}

export function PhoneVerificationInput({
  value,
  onChange,
  placeholder = "0123456789",
  disabled = false,
  verified = false,
  onVerificationSuccess,
  onVerificationStatusChange,
}: PhoneVerificationInputProps) {
  const t = useTranslations("shop.registration.shopInfo");
  const [isVerified, setIsVerified] = useState(verified);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const otpInputRef = useRef<OtpInputRef>(null);
  const {
    remaining,
    isRunning,
    start: startCountdown,
    reset: resetCountdown,
  } = useCountdown(60);

  useEffect(() => {
    setIsVerified(verified);
  }, [verified]);

  const handlePhoneChange = (val: string) => {
    if (isVerified) {
      setIsVerified(false);
      onVerificationStatusChange?.(false);
    }
    onChange(val);
  };

  const sendOtp = useCallback(
    async (phone: string) => {
      setIsLoading(true);
      setError("");
      try {
        // API thực tế: POST /api/send-otp
        await new Promise((res) => setTimeout(res, 1200));
        console.log(`OTP sent to ${phone}`);
        startCountdown();
        return true;
      } catch {
        setError(t("phoneVerification.sendError"));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [startCountdown, t]
  );

  const verifyOtp = useCallback(
    async (phone: string, otp: string) => {
      setIsVerifying(true);
      setError("");
      try {
        await new Promise((res) => setTimeout(res, 1000));
        if (otp === "123456") {
          setIsVerified(true);
          onVerificationStatusChange?.(true);
          onVerificationSuccess?.();
          setIsPopupOpen(false);
        } else {
          throw new Error("Invalid OTP");
        }
      } catch {
        setError(t("phoneVerification.verifyError"));
        otpInputRef.current?.clear();
      } finally {
        setIsVerifying(false);
      }
    },
    [t, onVerificationStatusChange, onVerificationSuccess]
  );

  const handleVerifyClick = async () => {
    if (!isPopupOpen && !isRunning) {
      const success = await sendOtp(value);
      if (success) setIsPopupOpen(true);
    } else {
      setIsPopupOpen(true);
    }
  };

  const handleOtpComplete = (otp: string) => verifyOtp(value, otp);

  const handleResendOtp = async () => {
    if (isRunning || isLoading || isVerifying) return;
    otpInputRef.current?.clear();
    setError("");
    const success = await sendOtp(value);
    if (!success) resetCountdown();
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    setError("");
    resetCountdown();
    otpInputRef.current?.clear();
    setIsLoading(false);
    setIsVerifying(false);
  };

  const formattedPhone =
    value.length > 8 ? `+84 *** *** ${value.slice(-3)}` : value;
  const disableInput =
    disabled || isVerified || isPopupOpen || isLoading || isVerifying;
  const disableVerifyBtn = isPopupOpen || isLoading || isVerifying;

  return (
    <div className="flex">
      <div className="flex items-center px-3 py-1.5 border border-r-0 border-border rounded-l-md bg-muted text-sm">
        {t("phonePrefix")}
      </div>

      <Input
        value={value}
        onChange={(e) => handlePhoneChange(e.target.value)}
        placeholder={placeholder}
        disabled={disableInput}
        className="rounded-l-none border border-border text-sm"
        maxLength={11}
      />

      {isVerified ? (
        <Button
          variant="outline"
          disabled
          className="ml-2 rounded-l-none text-xs uppercase bg-accent text-accent-foreground border-accent cursor-default"
        >
          {t("phoneVerification.verified")}
        </Button>
      ) : (
        <Popover
          open={isPopupOpen}
          onOpenChange={(open) => !open && handleClose()}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              onClick={handleVerifyClick}
              disabled={disableVerifyBtn}
              className="ml-2 rounded-l-none text-xs uppercase border-primary text-primary border-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full size-4 border-b-2 border-primary mx-auto" />
                  {t("phoneVerification.sending")}
                </>
              ) : (
                t("phoneVerification.verify")
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 p-6" align="center">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-foreground">
                {t("phoneVerification.title")}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 hover:bg-transparent hover:text-primary"
              >
                <X className="h-4 w-4" strokeWidth={3} />
              </Button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                {t("phoneVerification.codeSent")}{" "}
                <span className="font-medium">{formattedPhone}</span>
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                {t("phoneVerification.enterCode")}
              </p>

              <OtpInput
                ref={otpInputRef}
                length={6}
                onComplete={handleOtpComplete}
                disabled={isVerifying}
                className="justify-center mb-2"
              />

              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendOtp}
                disabled={isRunning || isLoading || isVerifying}
                className="w-full text-sm border-border hover:bg-muted"
              >
                {isRunning
                  ? `${t("phoneVerification.resendCode")} (${remaining}s)`
                  : t("phoneVerification.resendCode")}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {t("phoneVerification.notReceived")}
              </p>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
