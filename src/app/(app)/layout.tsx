// src/app/(app)/layout.tsx

import AppNav from "@/components/AppNav";
import AppAuthGate from "@/components/AppAuthGate";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppAuthGate>
        <AppNav />
        <main className="flex-1">{children}</main>
      </AppAuthGate>
    </div>
  );
}
