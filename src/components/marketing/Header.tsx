"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/marketing/NavLink";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/audit-iq-logo-horizontal.png"
            alt="Audit-IQ RegTech"
            width={220}
            height={56}
            className="h-14 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
            activeClassName="text-foreground"
          >
            Home
          </NavLink>

          <NavLink
            href="/features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
            activeClassName="text-foreground"
          >
            Features
          </NavLink>

          <NavLink
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
            activeClassName="text-foreground"
          >
            Pricing
          </NavLink>

          <NavLink
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
            activeClassName="text-foreground"
          >
            About
          </NavLink>

          <NavLink
            href="/contact"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
            activeClassName="text-foreground"
          >
            Contact
          </NavLink>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {/* Lovable uses variant="hero":contentReference[oaicite:3]{index=3}.
              If your Button doesn't have hero, switch to variant="default" + className. */}
          <Button variant="default" size="sm" asChild>
            <Link href="/contact">Request Demo</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto flex flex-col space-y-4 px-4 py-6">
            <NavLink
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              activeClassName="text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              href="/features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              activeClassName="text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </NavLink>

            <NavLink
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              activeClassName="text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </NavLink>

            <NavLink
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              activeClassName="text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>

            <NavLink
              href="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              activeClassName="text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>

            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="default" asChild>
                <Link href="/contact">Request Demo</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
