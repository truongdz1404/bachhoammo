"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
interface AnimatedCollapseProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const AnimatedCollapse = ({
  isOpen,
  children,
}: AnimatedCollapseProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(isOpen ? contentHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className={cn("overflow-hidden transition-all duration-300 ease-in-out")}
      style={{ height: isOpen ? height : 0 }}
    >
      <div ref={contentRef} className="ml-6 space-y-1 py-1">
        {children}
      </div>
    </div>
  );
};
