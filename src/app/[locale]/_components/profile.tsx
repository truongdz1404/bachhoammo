"use client";

import SignOut from "@/components/auth/signout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverPopup } from "@/components/ui/hover-popup";
import { useUser } from "@/hooks/use-user";
import { Link } from "@/i18n/navigation";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";

interface ProfileProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  session?: Session | null;
}
const getSizeClasses = (size: string) => {
  switch (size) {
    case "md":
      return {
        avatar: "size-6",
        text: "text-sm",
        fallback: "text-xs",
        name: "text-base",
      };
    case "lg":
      return {
        avatar: "size-8",
        text: "text-base",
        fallback: "text-sm",
        name: "text-lg",
      };
    default:
      return {
        avatar: "size-4",
        text: "text-[0.5rem]",
        fallback: "text-[0.5rem]",
        name: "text-[0.8rem]",
      };
  }
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function Profile({ className, size = "sm", session }: ProfileProps) {
  const { data: user } = useUser();
  const username = user?.fullName || session?.user?.name || "Anonymous";
  const t = useTranslations("header");

  const sizeClasses = getSizeClasses(size);

  return (
    <div className={className}>
      <HoverPopup
        trigger={
          <Link
            href="/user/account/profile"
            className="flex items-center justify-center gap-1 h-full hover:bg-transparent hover:opacity-80"
          >
            <Avatar
              className={`${sizeClasses.avatar} bg-primary-foreground text-primary`}
            >
              <AvatarImage
                src={user?.avatarUrl ?? ""}
                alt={username}
                className="object-cover size-full"
              />
              <AvatarFallback className={sizeClasses.fallback}>
                {getInitials(username)}
              </AvatarFallback>
            </Avatar>
            <span
              className={`hidden lg:inline ${sizeClasses.name} max-w-24 truncate`}
            >
              {username}
            </span>
          </Link>
        }
        width="w-40"
        align="right"
      >
        <div className="flex flex-col">
          <Link
            href="/user/account/profile"
            className="w-full justify-start gap-3 px-4 py-2 h-auto font-normal hover:text-primary"
          >
            <span className="text-sm">{t("myAccount")}</span>
          </Link>

          <Link
            href="/user/purchase"
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
