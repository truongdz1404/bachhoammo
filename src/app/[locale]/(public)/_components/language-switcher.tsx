"use client";

import { Button } from "@/components/ui/button";
import { HoverPopup } from "@/components/ui/hover-popup";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

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
  const [hovered, setHovered] = useState<string | null>(null);
  const t = useTranslations("header");

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className={className}>
      <HoverPopup
        trigger={
          <Button variant="ghost" size="sm" className={className}>
            <Globe className="h-4 w-4" />
            <span className="hidden lg:inline text-xs">{t("language")}</span>
            <ChevronDown className="size-4 " />
          </Button>
        }
        width="w-40"
      >
        <div className="flex flex-col px-2 group">
          {routing.locales.map((loc) => (
            <Button
              key={loc}
              variant="ghost"
              onClick={() => switchLocale(loc)}
              onMouseEnter={() => setHovered(loc)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "justify-start p-0! hover:bg-transparent",
                hovered
                  ? hovered === loc
                    ? "text-primary!"
                    : "text-muted-foreground!"
                  : locale === loc
                  ? "text-primary!"
                  : "text-muted-foreground!"
              )}
            >
              {localeNames[loc] || loc}
            </Button>
          ))}
        </div>
      </HoverPopup>
    </div>
  );
}
