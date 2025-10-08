import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface ValidationInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "maxLength"> {
  maxLength: number;
  value: string;
  showCounter?: boolean;
  className?: string;
}

export const AdvanceInput = forwardRef<HTMLInputElement, ValidationInputProps>(
  ({ maxLength, value, showCounter = true, className, ...props }, ref) => {
    return (
      <div className="space-y-1 relative max-w-md">
        <Input
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={cn("border border-border text-sm pr-16", className)}
          {...props}
        />
        {showCounter && (
          <div className="text-xs text-muted-foreground/50 font-medium absolute right-4 top-1/2 -translate-y-1/2">
            {value.length}/{maxLength}
          </div>
        )}
      </div>
    );
  }
);

AdvanceInput.displayName = "ValidationInput";
