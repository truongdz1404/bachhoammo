import { routing } from "@/i18n/routing";
import SWRProvider from "@/lib/swr";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter, Roboto_Mono, Staatliches } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const staatliches = Staatliches({
  subsets: ["latin"],
  variable: "--font-staatliches",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "BachHoaMMO",
  description: "A online marketplace",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${roboto_mono.variable} ${staatliches.variable} antialiased`}
    >
      <body className="bg-muted">
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <SWRProvider>{children}</SWRProvider>
          </SessionProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
