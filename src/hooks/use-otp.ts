import { otpApi, OtpRequestDto, OtpVerifyDto } from "@/lib/api-client/otp-api";
import { useCallback, useState } from "react";

interface UseOtpOptions {
  onVerified?: (otp: string) => void;
}

export function useOtp({ onVerified }: UseOtpOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const send = useCallback(async (phone: string) => {
    setIsLoading(true);
    setError("");

    try {
      const request: OtpRequestDto = { phone };
      const result = await otpApi.send(request);

      if (result.ok) {
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
        const result = await otpApi.verify(request);

        if (result.ok && result.data?.isVerified) {
          setIsVerified(true);
          onVerified?.(otpCode);
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
    [onVerified]
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

  const setVerifiedOtp = useCallback(
    (otp: string) => {
      setIsVerified(otp !== undefined);
      onVerified?.(otp);
    },
    [onVerified]
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
    setVerifiedOtp,
  };
}
