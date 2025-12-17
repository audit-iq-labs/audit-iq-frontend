"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/projects" className="font-semibold">
          Audit-IQ
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/projects"
            className={isActive("/projects") ? "font-semibold underline" : "text-gray-700 hover:underline"}
          >
            Projects
          </Link>
          <Link
            href="/billing"
            className={isActive("/billing") ? "font-semibold underline" : "text-gray-700 hover:underline"}
          >
            Plan & Billing
          </Link>

          <button
            className="text-gray-700 hover:underline"
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/login");
            }}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
