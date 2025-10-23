"use client";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { usePathname } from "@/i18n/navigation";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { DefaultProfile } from "./default-profile";
import { Logo } from "./logo";

const getRouteTitle = (path: string, t: (key: string) => string): string => {
  if (path.startsWith("/shop/registration")) {
    return t("shop.shopRegistration");
  }
  if (path.startsWith("/shop/management")) {
    return t("header.sellerChannel");
  }
  if (path.startsWith("/admin")) {
    return t("admin.title");
  }

  return "";
};

const DefaultHeader = ({ session }: { session?: Session | null }) => {
  const t = useTranslations();
  const pathname = usePathname();
  const title = getRouteTitle(pathname, t);
  return (
    <nav className="h-12 bg-background border-b sticky top-0 z-50">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4 h-full px-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo className="size-8" inverse={false} />
            <span className="relative select-none">
              <span className="absolute text-primary -bottom-[0.1rem] right-0 text-[0.4rem]">
                MMO
              </span>
              <span className="text-xl text-primary font-(family-name:--font-staatliches)">
                BACH HOA
              </span>
            </span>
          </Link>
          <h2 className="truncate max-w-sm md:max-w-md font-medium">{title}</h2>
        </div>

        <div className="flex items-center gap-3 h-full">
          <LanguageSwitcher className="hidden md:flex h-full items-center z-10" />
          {session && (
            <DefaultProfile
              className="flex h-full items-center z-10"
              size="lg"
              session={session}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default DefaultHeader;
