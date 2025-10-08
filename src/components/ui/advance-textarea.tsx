import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface AdvanceTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "maxLength"> {
  maxLength: number;
  value: string;
  showCounter?: boolean;
  className?: string;
}

export const AdvanceTextarea = forwardRef<
  HTMLTextAreaElement,
  AdvanceTextareaProps
>(({ maxLength, value, showCounter = true, className, ...props }, ref) => {
  return (
    <div className="space-y-1 relative max-w-md">
      <Textarea
        ref={ref}
        value={value}
        maxLength={maxLength}
        className={cn("border border-border text-sm pb-8 min-h-20", className)}
        {...props}
      />
      {showCounter && (
        <div className="text-xs text-muted-foreground/50 font-medium absolute right-4 bottom-3">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
});

AdvanceTextarea.displayName = "AdvanceTextarea";
