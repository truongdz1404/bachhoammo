import { auth } from "@/auth";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Header } from "./_components/header";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const session = await auth();

  return (
    <div className="min-h-screen">
      <Header isSticky={true} />
      <main className="bg-background w-full">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold uppercase text-center py-12 text text-primary/20">
            Something is coming!
          </h1>
        </div>
      </main>
    </div>
  );
}
