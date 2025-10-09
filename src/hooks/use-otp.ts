import {
  OtpRequestDto,
  OtpVerifyDto,
  sendOtp,
  verifyOtp,
} from "@/lib/api-client/otp-api";
import { useCallback, useState } from "react";

interface UseOtpOptions {
  onVerificationSuccess?: () => void;
  onVerificationStatusChange?: (isVerified: boolean) => void;
}

export function useOtp({
  onVerificationSuccess,
  onVerificationStatusChange,
}: UseOtpOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const send = useCallback(async (phone: string) => {
    setIsLoading(true);
    setError("");

    try {
      const request: OtpRequestDto = { phone };
      const result = await sendOtp(request);

      if (result.success) {
        return true;
      } else {
        setError(result.error || "500");
        return false;
      }
    } catch {
      setError("500");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verify = useCallback(
    async (phone: string, otpCode: string) => {
      setIsVerifying(true);
      setError("");

      try {
        const request: OtpVerifyDto = { phone, otpCode };
        const result = await verifyOtp(request);

        if (result.success && result.data?.isVerified) {
          setIsVerified(true);
          onVerificationStatusChange?.(true);
          onVerificationSuccess?.();
          return true;
        } else {
          setError(result.error || "500");
          return false;
        }
      } catch {
        setError("500");
        return false;
      } finally {
        setIsVerifying(false);
      }
    },
    [onVerificationStatusChange, onVerificationSuccess]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsVerifying(false);
    setError("");
    setIsVerified(false);
  }, []);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const setVerifiedStatus = useCallback(
    (verified: boolean) => {
      setIsVerified(verified);
      onVerificationStatusChange?.(verified);
    },
    [onVerificationStatusChange]
  );

  return {
    isLoading,
    isVerifying,
    error,
    isVerified,
    send,
    verify,
    reset,
    clearError,
    setVerifiedStatus,
  };
}
