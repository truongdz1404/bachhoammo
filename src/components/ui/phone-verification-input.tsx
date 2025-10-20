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
import { useOtp } from "@/hooks/use-otp";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";

interface PhoneVerificationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onVerified: (otp: string) => void;
}

export function PhoneVerificationInput({
  value,
  onChange,
  placeholder = "",
  disabled = false,
  onVerified,
}: PhoneVerificationInputProps) {
  const t = useTranslations("shop.registration.shopInfo");
  const tException = useTranslations("exception");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const otpInputRef = useRef<OtpInputRef>(null);
  const {
    remaining,
    isRunning,
    start: startCountdown,
    reset: resetCountdown,
  } = useCountdown(60);

  const {
    isLoading,
    isVerifying,
    error: otpError,
    isVerified,
    send: sendOtpCode,
    verify: verifyOtpCode,
    reset: resetOtp,
    clearError,
    setVerifiedOtp,
  } = useOtp({ onVerified });

  const handleSendOtp = useCallback(
    async (phone: string) => {
      const success = await sendOtpCode(phone);
      if (success) {
        startCountdown();
      }
      return success;
    },
    [sendOtpCode, startCountdown]
  );

  const handleVerifyOtp = useCallback(
    async (phone: string, otp: string) => {
      const success = await verifyOtpCode(phone, otp);
      if (success) {
        setVerifiedOtp(otp);
        setIsPopupOpen(false);
      } else {
        otpInputRef.current?.clear();
      }
      return success;
    },
    [setVerifiedOtp, verifyOtpCode]
  );

  const handleVerifyClick = async () => {
    if (!isPopupOpen && !isRunning) {
      const success = await handleSendOtp(value);
      if (success) setIsPopupOpen(true);
    } else {
      setIsPopupOpen(true);
    }
  };

  const handleOtpComplete = (otp: string) => handleVerifyOtp(value, otp);

  const handleResendOtp = async () => {
    if (isRunning || isLoading || isVerifying) return;
    otpInputRef.current?.clear();
    clearError();
    const success = await handleSendOtp(value);
    if (!success) resetCountdown();
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    clearError();
    resetCountdown();
    otpInputRef.current?.clear();
    resetOtp();
  };

  const formattedPhone =
    value.length > 8 ? `+84 *** *** ${value.slice(-3)}` : value;
  const phoneRegex = /^0[0-9]{9,10}$/;
  const isPhoneValid = phoneRegex.test(value);
  const disableInput =
    disabled || isVerified || isPopupOpen || isLoading || isVerifying;
  const disableVerifyBtn =
    isPopupOpen || isLoading || isVerifying || !isPhoneValid;

  return (
    <div className="flex">
      <div className="flex items-center px-3 py-1.5 border border-r-0 border-border rounded-l-md bg-muted text-sm">
        {t("phonePrefix")}
      </div>

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
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
              <h3 className="text-md font-semibold text-foreground">
                {t("phoneVerification.title")}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 hover:bg-transparent text-foreground/80 hover:text-destructive"
              >
                <X className="h-4 w-4" strokeWidth={3} />
              </Button>
            </div>

            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">
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

              {otpError && (
                <p className="text-sm text-destructive">
                  {tException(otpError)}
                </p>
              )}
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
