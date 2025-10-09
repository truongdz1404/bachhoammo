"use client";

import { cn } from "@/lib/utils";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  className?: string;
  disabled?: boolean;
}

export interface OtpInputRef {
  clear: () => void;
}

export const OtpInput = forwardRef<OtpInputRef, OtpInputProps>(
  ({ length = 6, onComplete, className, disabled = false }, ref) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useImperativeHandle(ref, () => ({
      clear: () => {
        const empty = new Array(length).fill("");
        setOtp(empty);
        inputRefs.current[0]?.focus();
      },
    }));

    useEffect(() => {
      inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
      if (disabled) return;

      if (value.length > 1) {
        const chars = value.replace(/\D/g, "").split("").slice(0, length);
        const newOtp = [...otp];
        chars.forEach((c, i) => {
          if (index + i < length) newOtp[index + i] = c;
        });
        setOtp(newOtp);

        const joined = newOtp.join("");
        if (joined.length === length) onComplete?.(joined);
        return;
      }

      if (!/^\d$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      const joined = newOtp.join("");
      if (joined.length === length) onComplete?.(joined);
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (disabled) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        const newOtp = [...otp];
        if (newOtp[index]) {
          newOtp[index] = "";
          setOtp(newOtp);
          return;
        }
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          const prev = [...otp];
          prev[index - 1] = "";
          setOtp(prev);
        }
      }
      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleFocus = (index: number) => {
      if (disabled) return;
      inputRefs.current[index]?.select();
    };

    return (
      <div className={cn("flex gap-2", className)}>
        {otp.map((value, index) => (
          <input
            key={index}
            ref={(input) => {
              inputRefs.current[index] = input;
            }}
            autoComplete="one-time-code"
            type="text"
            inputMode="numeric"
            pattern="\d{1}"
            maxLength={length}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={cn(
              "w-10 h-10 text-center text-lg font-medium border border-border rounded-md bg-background text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
              value && "border-primary"
            )}
          />
        ))}
      </div>
    );
  }
);

OtpInput.displayName = "OtpInput";
