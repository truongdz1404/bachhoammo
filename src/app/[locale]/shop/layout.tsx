import { auth } from "@/auth";
import DefaultHeader from "@/components/ui/default-header";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

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
      <DefaultHeader user={session?.user} />
      <main className="bg-muted w-full min-h-screen">{children}</main>
    </>
  );
}
