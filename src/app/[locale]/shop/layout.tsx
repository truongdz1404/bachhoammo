import { auth } from "@/auth";
import DefaultHeader from "@/components/default-header";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

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
      <main className="bg-muted w-full min-h-screen">{children}</main>
    </>
  );
}
