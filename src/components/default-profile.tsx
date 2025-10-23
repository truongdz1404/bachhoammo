"use client";

import SignOut from "@/components/auth/signout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverPopup } from "@/components/ui/hover-popup";
import { useUser } from "@/hooks/use-user";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, LogOut } from "lucide-react";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";

interface ProfileProps {
  className?: string;
  size?: "sm" | "lg";
  session?: Session | null;
}

export function DefaultProfile({
  className,
  size = "sm",
  session,
}: ProfileProps) {
  const { data: user } = useUser();
  const username = user?.fullName || session?.user?.name || "Anonymous";

  const t = useTranslations("header");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "lg":
        return {
          avatar: "size-8",
          text: "text-sm",
          fallback: "text-xs",
          name: "text-[0.8rem]",
        };
      default:
        return {
          avatar: "size-4",
          text: "text-[0.6rem]",
          fallback: "text-[0.6rem]",
          name: "text-xs",
        };
    }
  };

  const sizeClasses = getSizeClasses(size);

  return (
    <div className={className}>
      <HoverPopup
        trigger={
          <Link
            href="#"
            className="flex items-center justify-center gap-1 h-full hover:bg-muted px-4"
          >
            <Avatar className={`${sizeClasses.avatar} `}>
              <AvatarImage src={user?.avatarUrl ?? ""} alt={username} />
              <AvatarFallback
                className={cn(
                  sizeClasses.fallback,
                  "bg-primary text-primary-foreground"
                )}
              >
                {getInitials(username ?? "")}
              </AvatarFallback>
            </Avatar>
            <span className={`hidden lg:inline ${sizeClasses.name}`}>
              {username}
            </span>
            <ChevronDown className="size-4 hidden lg:inline" />
          </Link>
        }
        width="w-60"
        align="right"
      >
        <div className="flex flex-col px-4 cursor-default">
          <div className="flex flex-col items-center justify-center py-4 gap-2">
            <Avatar className="size-10 bg-primary text-primary-foreground">
              <AvatarImage src={user?.avatarUrl ?? ""} alt={username} />
              <AvatarFallback className={"bg-primary"}>
                {getInitials(username)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{username}</span>
          </div>

          <SignOut className="border-t w-full justify-start items-center gap-3 px-4 py-2 h-auto font-normal hover:text-destructive flex">
            <LogOut className="size-4" />
            <span className="text-sm text-start">{t("logout")}</span>
          </SignOut>
        </div>
      </HoverPopup>
    </div>
  );
}
