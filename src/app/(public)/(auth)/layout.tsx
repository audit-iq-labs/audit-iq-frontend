import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold">
            Audit-IQ
          </Link>
          <Link href="/pricing" className="text-sm underline underline-offset-4">
            Back to pricing
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">{children}</main>
    </div>
  );
}
