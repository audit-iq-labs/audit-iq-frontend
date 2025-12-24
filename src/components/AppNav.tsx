"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Brand from "@/components/Brand";

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const linkClass = (href: string) =>
    isActive(href)
      ? "font-semibold underline"
      : "text-gray-700 hover:underline";

  return (
    <header className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Brand href="/projects" priority />

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/projects" className={linkClass("/projects")}>
            Projects
          </Link>

          <Link href="/billing" className={linkClass("/billing")}>
            Plan & Billing
          </Link>

          <button
            className="text-gray-700 hover:underline"
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/login");
              router.refresh();
            }}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
