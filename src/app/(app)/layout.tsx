//src/app/(app)/layout.tsx

import AppNav from "@/components/AppNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      <main className="min-h-screen">{children}</main>
    </>
  );
}
