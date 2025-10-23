import { auth } from "@/auth";
import { Header } from "../_components/header";
import Sidebar from "./_components/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <Header isSticky={false} session={session} />
      <div className="bg-muted min-h-96">
        <div className="container mx-auto p-4">
          <div className="flex gap-4">
            <Sidebar className="flex-shrink-0" />
            <main className="flex-1 bg-card rounded-md border border-border px-8 py-4 min-h-[36rem]">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
