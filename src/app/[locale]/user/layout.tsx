import { auth } from "@/auth";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Header } from "../_components/header";
import Sidebar from "./_components/sidebar";

export default async function Layout({
  children,
  params,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  const { locale } = await params;
  const session = await auth();
  setRequestLocale(locale as Locale);
  return (
    <>
      <Header isSticky={false} user={session?.user} />
      <div className="bg-muted min-h-screen">
        <div className="container mx-auto p-4">
          <div className="flex gap-4">
            <Sidebar className="flex-shrink-0" user={session?.user} />
            <main className="flex-1 bg-card rounded-md border border-border px-8 py-4 min-h-[36rem]">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
