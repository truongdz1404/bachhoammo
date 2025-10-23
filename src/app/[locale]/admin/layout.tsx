import { auth } from "@/auth";
import DefaultHeader from "@/components/default-header";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Sidebar from "./_components/sidebar";

export default async function Layout({
  children,
  params,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  const session = await auth();
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  return (
    <>
      <DefaultHeader session={session} />
      <div className="bg-muted">
        <div className="flex gap-4">
          <aside className="flex-shrink-0 hidden lg:block">
            <Sidebar className="sticky top-[3rem] h-[calc(100vh-3rem)] bg-card border border-border border-t-0 overflow-y-auto px-4" />
          </aside>

          <main className="flex-1 px-8 py-4 min-h-screen">{children}</main>
        </div>
      </div>
    </>
  );
}
