"use client";

import SignOut from "@/components/auth/signout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverPopup } from "@/components/ui/hover-popup";
import { Link } from "@/i18n/navigation";
import { User } from "next-auth";
import { useTranslations } from "next-intl";

interface ProfileProps {
  className?: string;
  user?: User;
}

export function Profile({ className, user }: ProfileProps) {
  const t = useTranslations("header");
  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={className}>
      <HoverPopup
        trigger={
          <Link
            href="#"
            className="flex items-center justify-center gap-1 h-full"
          >
            <Avatar className="size-4 bg-primary-foreground text-primary">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-[0.6rem]">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden lg:inline">{user.name}</span>
          </Link>
        }
        width="w-40"
        align="right"
      >
        <div className="flex flex-col">
          <Link
            href="#"
            className="w-full justify-start gap-3 px-4 py-2 h-auto font-normal hover:text-primary"
          >
            <span className="text-sm">{t("myAccount")}</span>
          </Link>

          <Link
            href="#"
            className="w-full justify-start gap-3 px-4 py-2 h-auto font-normal hover:text-primary"
          >
            <span className="text-sm">{t("myPurchase")}</span>
          </Link>

          <SignOut className="w-full justify-start gap-3 px-4 py-2 h-auto font-normal hover:text-destructive flex">
            <span className="text-sm text-start">{t("logout")}</span>
          </SignOut>
        </div>
      </HoverPopup>
    </div>
  );
}
