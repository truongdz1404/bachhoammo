"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const localeNames: Record<string, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

export default function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("header");

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <Globe className="h-4 w-4" />
          <span className="hidden lg:inline text-xs">{t("language")}</span>
          <ChevronDown className="size-4 " />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchLocale(loc)}
            className={
              locale === loc
                ? "bg-accent text-primary-foreground"
                : "hover:bg-muted! text-muted-foreground!"
            }
          >
            {localeNames[loc] || loc}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
