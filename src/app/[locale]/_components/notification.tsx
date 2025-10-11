"use client";

import { HoverPopup } from "@/components/ui/hover-popup";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";

interface NotificationProps {
  className?: string;
}

export function Notification({ className }: NotificationProps) {
  const t = useTranslations("header");

  return (
    <div className={className}>
      <HoverPopup
        trigger={
          <a
            href="#"
            className="h-full gap-1 hover:bg-transparent hover:opacity-80 text-primary-foreground hidden md:flex items-center font-normal"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden lg:inline text-[0.8rem]">
              {t("notifications")}
            </span>
          </a>
        }
        width="w-80"
      >
        <div>
          <h3 className="z-50 p-2 text-sm text-foreground/40">
            {t("resentNotifications")}
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3 hover:bg-muted/50 p-2 rounded cursor-pointer">
              <div className="w-12 h-12 bg-muted rounded flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm uppercase">Something is comming</p>
              </div>
            </div>
          </div>
          <a
            href="#"
            className="block text-center text-sm hover:bg-muted/50 p-2"
          >
            {t("viewAll")}
          </a>
        </div>
      </HoverPopup>
    </div>
  );
}
