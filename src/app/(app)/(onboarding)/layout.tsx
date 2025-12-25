import AppAuthGate from "@/components/AppAuthGate";
import Link from "next/link";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppAuthGate>
      <div className="min-h-screen">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/projects" className="font-semibold">
              Audit-IQ
            </Link>
            <Link href="/projects" className="text-sm underline underline-offset-4">
              Skip for now
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-10">{children}</main>
      </div>
    </AppAuthGate>
  );
}
