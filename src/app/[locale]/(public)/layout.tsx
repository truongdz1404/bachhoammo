import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Header } from "../_components/header";

export default async function Layout({
  children,
  params,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  return (
    <>
      <Header isSticky={true} />
      <main className="bg-background w-full">{children}</main>
    </>
  );
}
