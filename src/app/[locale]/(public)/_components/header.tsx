"use client";

import LanguageSwitcher from "@/app/[locale]/(public)/_components/language-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, HelpCircle, Menu, Search, X } from "lucide-react";
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
}

export function Header({ isSticky = true }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const t = useTranslations("header");

  const headerClasses = isSticky
    ? "w-full bg-primary text-primary-foreground sticky top-0 z-50"
    : "w-full bg-primary text-primary-foreground";

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10 text-xs">
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
              <a
                href="#"
                className="hover:opacity-80 transition-opacity hidden h-full sm:flex items-center"
              >
                {t("becomeSeller")}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 h-full">
            <Button
              variant="ghost"
              size="sm"
              className="h-full p-0! hover:bg-transparent hover:opacity-80 text-primary-foreground hidden md:flex font-normal"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden lg:inline text-xs">
                {t("notifications")}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-full p-0! hover:bg-transparent hover:opacity-80 text-primary-foreground hidden md:flex  font-normal"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden lg:inline text-xs">{t("support")}</span>
            </Button>
            <LanguageSwitcher className="h-full p-0! hover:bg-transparent hover:opacity-80 text-primary-foreground hidden sm:flex font-normal" />
            <div className="flex items-center gap-1 h-full">
              <a
                href="#"
                className="hover:opacity-80 transition-opacity h-full flex items-center"
              >
                {t("register")}
              </a>
              <span className="text-primary-foreground/40">|</span>
              <a
                href="#"
                className="hover:opacity-80 transition-opacity h-full flex items-center"
              >
                {t("login")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-white text-primary rounded-lg p-2">
            <svg
              className="h-6 w-6 md:h-8 md:w-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="currentColor"
                opacity="0.9"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xl md:text-2xl font-bold text-white">
            BachHoaMMO
          </span>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-2 hover:bg-white/10 text-primary-foreground md:hidden"
          onClick={() => setMobileSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">{t("search")}</span>
        </Button>

        <div className="hidden md:flex flex-1 max-w-3xl flex-col">
          <div className="relative">
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="w-full pr-12 h-10 md:h-11 bg-white text-foreground border-0 focus-visible:ring-2 focus-visible:ring-white/50 text-sm"
            />
            <Button
              size="icon"
              className="absolute right-0 top-0 h-10 md:h-11 w-10 md:w-12 rounded-l-none bg-white hover:bg-white/90 text-primary"
            >
              <Search className="h-4 w-4 md:h-5 md:w-5" />
              <span className="sr-only">{t("search")}</span>
            </Button>
          </div>

          <div className="flex items-center gap-3 overflow-hidden my-1">
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
                  className={`hover:opacity-80 transition-opacity flex-shrink-0 ${hiddenClass} text-xs`}
                >
                  {suggestion.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {mobileSearchOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileSearchOpen(false)}
          />
          <div className="fixed inset-x-0 top-0 bottom-0 w-80 bg-primary text-primary-foreground z-50 md:hidden overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-md font-semibold">{t("search")}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 hover:bg-transparent hover:opacity-80 text-primary-foreground"
                  onClick={() => setMobileSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">{t("close")}</span>
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                <a
                  href="#"
                  className="hover:opacity-80 transition-opacity py-2 border-b border-primary-foreground/20"
                  onClick={() => setMobileSearchOpen(false)}
                >
                  {t("sellerChannel")}
                </a>
                <a
                  href="#"
                  className="hover:opacity-80 transition-opacity py-2 border-b border-primary-foreground/20"
                  onClick={() => setMobileSearchOpen(false)}
                >
                  {t("becomeSeller")}
                </a>
                <a
                  href="#"
                  className="hover:opacity-80 transition-opacity py-2 border-b border-primary-foreground/20 flex items-center gap-2"
                  onClick={() => setMobileSearchOpen(false)}
                >
                  <Bell className="h-4 w-4" />
                  {t("notifications")}
                </a>
                <a
                  href="#"
                  className="hover:opacity-80 transition-opacity py-2 border-b border-primary-foreground/20 flex items-center gap-2"
                  onClick={() => setMobileSearchOpen(false)}
                >
                  <HelpCircle className="h-4 w-4" />
                  {t("support")}
                </a>
                <a
                  href="#"
                  className="hover:opacity-80 transition-opacity py-2 border-b border-primary-foreground/20"
                  onClick={() => setMobileSearchOpen(false)}
                >
                  {t("register")}
                </a>
                <a
                  href="#"
                  className="hover:opacity-80 transition-opacity py-2"
                  onClick={() => setMobileSearchOpen(false)}
                >
                  {t("login")}
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-primary text-primary-foreground z-50 md:hidden overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">{t("menu")}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 hover:bg-transparent hover:opacity-80 text-primary-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">{t("close")}</span>
                </Button>
              </div>
              <div className="flex flex-col gap-4">
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
                  <Bell className="h-4 w-4" />
                  {t("notifications")}
                </a>
                <a
                  href="#"
                  className="hover:opacity-80 transition-opacity py-2 border-b border-primary-foreground/20 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <HelpCircle className="h-4 w-4" />
                  {t("support")}
                </a>
                <a
                  href="#"
                  className="hover:opacity-80 transition-opacity py-2 border-b border-primary-foreground/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("register")}
                </a>
                <a
                  href="#"
                  className="hover:opacity-80 transition-opacity py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("login")}
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
