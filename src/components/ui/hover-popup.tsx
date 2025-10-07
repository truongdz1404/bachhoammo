"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface HoverPopupProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  width?: string;
}

export function HoverPopup({
  trigger,
  children,
  align = "right",
  width = "w-64",
}: HoverPopupProps) {
  return (
    <div className="relative group h-full cursor-pointer">
      {trigger}
      <div className="scale-0 group-hover:scale-100 transition-all duration-100 ease-out">
        <div
          className={cn(
            "absolute -top-2 left-1/2 -translate-x-1/2",
            "hidden lg:block"
          )}
        >
          <div className="w-4 h-4 bg-primary-foreground transform rotate-45 shadow-sm z-40" />
        </div>
        <div
          className={cn(
            "absolute z-50 -top-1",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <div
            className={`${width} max-w-[calc(100vw-2rem)] text-foreground shadow-lg relative`}
          >
            <div className="relative z-10 bg-primary-foreground rounded-md">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
