"use client";

import { Header } from "../_components/header";
import Sidebar from "./_components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header isSticky={false} />
      <div className="bg-muted min-h-screen">
        <div className="container mx-auto p-4">
          <div className="flex gap-4">
            <Sidebar className="flex-shrink-0"/>
            <main className="flex-1 bg-card rounded-md border border-border px-8 py-4 min-h-[36rem]">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
