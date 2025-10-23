import Sidebar from "./_components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted">
      <div className="flex gap-4">
        <Sidebar className="flex-shrink-0 bg-card border border-border border-t-0 sticky top-0 h-[calc(100vh-2rem)] overflow-y-auto px-4" />
        <main className="flex-1 px-8 py-4 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
