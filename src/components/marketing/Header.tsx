// src/components/marketing/Header.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/marketing/NavLink";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Esc to close
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMenuOpen(false);
    }
    if (isMenuOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  const navItemClass =
    "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors";
  const navActiveClass = "text-foreground";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Audit-IQ Home">
          <Image
            src="/assets/audit-iq-logo-horizontal.png"
            alt="Audit-IQ RegTech"
            width={220}
            height={56}
            className="h-10 w-auto md:h-11" // slightly tighter + consistent
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          <NavLink href="/" className={navItemClass} activeClassName={navActiveClass}>
            Home
          </NavLink>
          <NavLink href="/features" className={navItemClass} activeClassName={navActiveClass}>
            Features
          </NavLink>
          <NavLink href="/pricing" className={navItemClass} activeClassName={navActiveClass}>
            Pricing
          </NavLink>
          <NavLink href="/about" className={navItemClass} activeClassName={navActiveClass}>
            About
          </NavLink>
          <NavLink href="/contact" className={navItemClass} activeClassName={navActiveClass}>
            Contact
          </NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>

          <Button variant="default" size="sm" asChild>
            <Link href="/signup">Sign up</Link>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link href="/contact">Request Demo</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-muted transition-colors"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="md:hidden relative z-50 border-t bg-background">
            <nav
              id="mobile-nav"
              className="max-w-6xl mx-auto flex flex-col gap-4 px-4 py-6"
              aria-label="Mobile"
            >
              <NavLink
                href="/"
                className={navItemClass}
                activeClassName={navActiveClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>

              <NavLink
                href="/features"
                className={navItemClass}
                activeClassName={navActiveClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </NavLink>

              <NavLink
                href="/pricing"
                className={navItemClass}
                activeClassName={navActiveClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </NavLink>

              <NavLink
                href="/about"
                className={navItemClass}
                activeClassName={navActiveClass}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </NavLink>

              <NavLink
                href="/contact"
                className={navItemClass}
                activeClassName={navActiveClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </NavLink>

              <div className="pt-2 space-y-2">
                <Button variant="default" className="w-full" asChild>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    Sign up
                  </Link>
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </Button>

                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                    Request Demo
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
