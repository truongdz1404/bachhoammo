import Sidebar from "./_components/sidebar";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;
  return (
    <div className="bg-muted">
      <div className="flex gap-4">
        <aside className="flex-shrink-0 hidden lg:block">
          <Sidebar
            shopId={shopId}
            className="sticky top-[3rem] h-[calc(100vh-3rem)] bg-card border border-border border-t-0 overflow-y-auto px-4"
          />
        </aside>

        <main className="flex-1 px-8 py-4 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
