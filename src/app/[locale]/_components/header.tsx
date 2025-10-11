"use client";

import { Notification } from "@/app/[locale]/_components/notification";
import { Profile } from "@/app/[locale]/_components/profile";
import Register from "@/components/auth/register";
import SignIn from "@/components/auth/signin";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LanguageSwitcher from "@/components/ui/language-switcher";
import {
  ArrowLeft,
  BotMessageSquare,
  HelpCircle,
  Menu,
  Search,
  X,
} from "lucide-react";
import { User } from "next-auth";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

const SEARCH_SUGGESTIONS = [
  { id: 1, label: "Thuê vpn", showOn: "all" },
  { id: 2, label: "Acc liên quân", showOn: "all" },
  { id: 3, label: "Quizzlet", showOn: "all" },
  { id: 4, label: "Netflex", showOn: "all" },
  { id: 5, label: "Gmail", showOn: "lg" },
  { id: 7, label: "Buff like", showOn: "xl" },
] as const;

interface HeaderProps {
  isSticky?: boolean;
  user?: User;
}

export function Header({ isSticky = true, user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const t = useTranslations("header");

  const headerClasses = isSticky
    ? "w-full bg-primary text-primary-foreground sticky top-0 z-50"
    : "w-full bg-primary text-primary-foreground";

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-9 text-[0.8rem]">
          <div className="flex items-center gap-1 md:gap-2 h-full">
            <Button
              variant="ghost"
              size="sm"
              className="h-full p-1 hover:bg-transparent hover:opacity-80 text-primary-foreground md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{t("menu")}</span>
            </Button>

            <div className="flex items-center gap-1 h-full">
              <a
                href="#"
                className="hover:opacity-80 transition-opacity h-full flex items-center"
              >
                {t("sellerChannel")}
              </a>
              <span className="text-primary-foreground/40 hidden sm:inline">
                |
              </span>
              <Link
                href="/shop/registration"
                className="hover:opacity-80 transition-opacity hidden h-full sm:flex items-center"
              >
                {t("becomeSeller")}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 h-full">
            <Notification className="hidden md:flex h-full items-center z-10" />
            <a
              href="#"
              className="items-center gap-1 h-full hover:bg-transparent hover:opacity-80 text-primary-foreground hidden md:flex font-normal"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden lg:inline text-[0.8rem]">
                {t("support")}
              </span>
            </a>
            <LanguageSwitcher className="hidden md:flex h-full items-center z-10" />

            {user ? (
              <Profile
                className="hidden md:flex h-full items-center z-10"
                user={user}
              />
            ) : (
              <div className="flex items-center gap-1 h-full">
                <Register className="hover:opacity-80 transition-opacity h-full flex items-center">
                  {t("register")}
                </Register>
                <span className="text-primary-foreground/40">|</span>
                <SignIn className="hover:opacity-80 transition-opacity h-full flex items-center">
                  {t("login")}
                </SignIn>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-1 flex justify-between">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Logo className="size-10" inverse={true} />
          <span className="relative select-none">
            <span className="absolute -bottom-1 right-0 text-[0.5rem]">
              MMO
            </span>
            <span className="text-xl md:text-2xl text-primary-foreground font-(family-name:--font-staatliches)">
              BACH HOA
            </span>
          </span>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="p-2 size-10 hover:bg-white/10 text-primary-foreground md:hidden"
          onClick={() => setMobileSearchOpen(true)}
        >
          <Search className="size-5" />
          <span className="sr-only">{t("search")}</span>
        </Button>

        <div className="hidden md:flex flex-1 max-w-7xl flex-col ml-12">
          <div className="relative">
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="w-full pr-12 h-10 bg-primary-foreground text-foreground border-0 focus-visible:ring-2 focus-visible:ring-white/50 text-sm"
            />
            <Button
              size="icon"
              className="absolute right-1 top-1 h-8 w-13 md:w-14 hover:bg-primary/90 bg-primary text-primary-foreground"
            >
              <Search className="h-4 w-4 md:h-5 md:w-5" />
              <span className="sr-only">{t("search")}</span>
            </Button>
          </div>

          <div className="flex items-center gap-3 overflow-hidden mt-1">
            {SEARCH_SUGGESTIONS.map((suggestion) => {
              const hiddenClass =
                suggestion.showOn === "lg"
                  ? "hidden lg:inline"
                  : suggestion.showOn === "xl"
                  ? "hidden xl:inline"
                  : "";
              return (
                <a
                  key={suggestion.id}
                  href="#"
                  className={`hover:opacity-80 transition-opacity flex-shrink-0 ${hiddenClass} text-xs text-primary-foreground/90`}
                >
                  {suggestion.label}
                </a>
              );
            })}
          </div>
        </div>

        <div className="hidden lg:flex items-center mx-14">
          <Button variant="ghost" className="cursor-pointer">
            <BotMessageSquare className="size-8" />
          </Button>
        </div>
      </div>

      {mobileSearchOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileSearchOpen(false)}
          />
          <div className="fixed inset-x-0 top-0 bg-primary text-primary-foreground z-50 md:hidden p-4">
            <div className="flex items-center gap-2 mb-4 h-full">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 size-8 hover:bg-primary-foreground/20 text-primary-foreground rounded-full"
                onClick={() => setMobileSearchOpen(false)}
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">{t("back")}</span>
              </Button>
              <div className="flex-1 relative">
                <Input
                  type="search"
                  placeholder="Netflex bao ship 0Đ - Đăng ký ngay!"
                  className="w-full pr-12 h-10 bg-white text-foreground border-0 focus-visible:ring-2 focus-visible:ring-white/50 text-sm"
                  autoFocus
                />
                <Button
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10 rounded-l-none bg-white hover:bg-white/90 text-primary"
                >
                  <Search className="h-4 w-4" />
                  <span className="sr-only">{t("search")}</span>
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              {SEARCH_SUGGESTIONS.slice(0, 5).map((suggestion) => (
                <a
                  key={suggestion.id}
                  href="#"
                  className="hover:opacity-80 transition-opacity py-2"
                  onClick={() => setMobileSearchOpen(false)}
                >
                  {suggestion.label}
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-primary text-primary-foreground z-50 md:hidden overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 flex-shrink-0"
                >
                  <Logo className="size-10" inverse={true} />
                  <span className="relative select-none">
                    <span className="absolute -bottom-1 right-0 text-[0.5rem]">
                      MMO
                    </span>
                    <span className="text-xl md:text-2xl text-primary-foreground font-(family-name:--font-staatliches)">
                      BACH HOA
                    </span>
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 hover:bg-transparent hover:opacity-80 text-primary-foreground cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">{t("close")}</span>
                </Button>
              </div>
              <div className="flex flex-col gap-4 text-sm">
                <a
                  href="#"
                  className="hover:opacity-80 transition-opacity py-2 border-b border-primary-foreground/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("sellerChannel")}
                </a>
                <a
                  href="#"
                  className="hover:opacity-80 transition-opacity py-2 border-b border-primary-foreground/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("becomeSeller")}
                </a>
                <a
                  href="#"
                  className="hover:opacity-80 transition-opacity py-2 border-b border-primary-foreground/20 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("notifications")}
                </a>
                <a
                  href="#"
                  className="hover:opacity-80 transition-opacity py-2 border-b border-primary-foreground/20 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("support")}
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
